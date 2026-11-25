import React, { useEffect } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'ink-testing-library';
import { Text } from 'ink';
import { CaretProvider } from '../../CaretProvider.js';
import { FocusProvider, useFocus } from '../../FocusProvider.js';
import { ScrollableList } from '../ScrollableList.js';

const KEY = {
  up: '\u001B[A',
  down: '\u001B[B',
  enter: '\r',
};

// Laisse à Ink le temps de lire la touche et de redessiner. 30 ms ne suffisaient
// pas toujours : selon la charge de la machine, des tests échouaient au hasard.
const tick = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

const names = (count: number) => Array.from({ length: count }, (_, i) => `Ligne ${i + 1}`);

// Donne le focus à la liste, comme le ferait l'application.
function Focus({ id }: { id: string | null }) {
  const { requestFocus } = useFocus();
  useEffect(() => {
    if (id) {
      requestFocus(id);
    }
  }, [id, requestFocus]);
  return null;
}

interface Props {
  items?: string[];
  height?: number;
  autoScroll?: boolean;
  focus?: boolean;
}

function setup(initial: Props = {}) {
  const onSelect = vi.fn();
  const element = ({ items = names(3), height = 3, autoScroll = false, focus = true }: Props) => (
    <CaretProvider>
      <FocusProvider>
        <Focus id={focus ? 'liste' : null} />
        <ScrollableList
          id="liste"
          items={items}
          height={height}
          autoScroll={autoScroll}
          onSelect={onSelect}
          renderItem={(item) => <Text>{item}</Text>}
        />
      </FocusProvider>
    </CaretProvider>
  );
  const view = render(element(initial));
  const press = async (...keys: string[]) => {
    for (const key of keys) {
      view.stdin.write(key);
      await tick();
    }
  };
  const lines = () => (view.lastFrame() ?? '').split('\n');
  return {
    ...view,
    onSelect,
    press,
    /** Les lignes affichées, sans curseur ni barre de défilement. */
    rows: () => lines().map((line) => /Ligne \d+/.exec(line)?.[0]).filter(Boolean),
    /** Le texte de la ligne qui porte le curseur ">". */
    selected: () => /Ligne \d+/.exec(lines().find((line) => line.includes('>')) ?? '')?.[0],
    hasScrollbar: () => (view.lastFrame() ?? '').includes('█'),
    update: async (props: Props) => {
      view.rerender(element({ ...initial, ...props }));
      await tick();
    },
  };
}

describe('ScrollableList', () => {
  it('met le curseur sur la première ligne', async () => {
    const s = setup();
    await tick();
    expect(s.rows()).toEqual(['Ligne 1', 'Ligne 2', 'Ligne 3']);
    expect(s.selected()).toBe('Ligne 1');
  });

  it('descend et monte avec les flèches', async () => {
    const s = setup();
    await tick();
    await s.press(KEY.down, KEY.down);
    expect(s.selected()).toBe('Ligne 3');
    await s.press(KEY.up);
    expect(s.selected()).toBe('Ligne 2');
  });

  it('boucle du premier au dernier et du dernier au premier', async () => {
    const s = setup({ items: names(6) });
    await tick();
    await s.press(KEY.up);
    expect(s.selected()).toBe('Ligne 6');
    expect(s.rows()).toEqual(['Ligne 4', 'Ligne 5', 'Ligne 6']);
    await s.press(KEY.down);
    expect(s.selected()).toBe('Ligne 1');
    expect(s.rows()).toEqual(['Ligne 1', 'Ligne 2', 'Ligne 3']);
  });

  it('fait défiler la fenêtre pour garder le curseur affiché', async () => {
    const s = setup({ items: names(6) });
    await tick();
    await s.press(KEY.down, KEY.down, KEY.down);
    expect(s.rows()).toEqual(['Ligne 2', 'Ligne 3', 'Ligne 4']);
    expect(s.selected()).toBe('Ligne 4');
    await s.press(KEY.up, KEY.up, KEY.up);
    expect(s.rows()).toEqual(['Ligne 1', 'Ligne 2', 'Ligne 3']);
    expect(s.selected()).toBe('Ligne 1');
  });

  it('valide la ligne active avec Entrée', async () => {
    const s = setup();
    await tick();
    await s.press(KEY.down, KEY.enter);
    expect(s.onSelect).toHaveBeenCalledTimes(1);
    expect(s.onSelect).toHaveBeenCalledWith('Ligne 2');
  });

  it('ignore les touches et cache le curseur sans le focus', async () => {
    const s = setup({ focus: false });
    await tick();
    await s.press(KEY.down, KEY.enter);
    expect(s.selected()).toBeUndefined();
    expect(s.onSelect).not.toHaveBeenCalled();
  });

  it('affiche une barre de défilement seulement quand la liste dépasse', async () => {
    const short = setup({ items: names(3) });
    await tick();
    expect(short.hasScrollbar()).toBe(false);
    const long = setup({ items: names(6) });
    await tick();
    expect(long.hasScrollbar()).toBe(true);
  });

  it('accepte une liste vide', async () => {
    const s = setup({ items: [] });
    await tick();
    await s.press(KEY.down, KEY.up, KEY.enter);
    expect(s.rows()).toEqual([]);
    expect(s.onSelect).not.toHaveBeenCalled();
  });

  it('ramène le curseur dans la liste quand elle rétrécit', async () => {
    const s = setup({ items: names(6) });
    await tick();
    await s.press(KEY.up);
    expect(s.selected()).toBe('Ligne 6');
    await s.update({ items: names(4) });
    expect(s.selected()).toBe('Ligne 4');
    expect(s.rows()).toEqual(['Ligne 2', 'Ligne 3', 'Ligne 4']);
  });

  describe('autoScroll', () => {
    it('commence en bas quand la liste dépasse', async () => {
      const s = setup({ items: names(6), autoScroll: true });
      await tick();
      expect(s.rows()).toEqual(['Ligne 4', 'Ligne 5', 'Ligne 6']);
      expect(s.selected()).toBe('Ligne 6');
    });

    it('suit les lignes ajoutées', async () => {
      const s = setup({ items: names(6), autoScroll: true });
      await tick();
      await s.press(KEY.up, KEY.up);
      expect(s.selected()).toBe('Ligne 4');
      await s.update({ items: names(7) });
      expect(s.rows()).toEqual(['Ligne 5', 'Ligne 6', 'Ligne 7']);
      expect(s.selected()).toBe('Ligne 7');
    });

    it('reste en haut tant que la liste tient dans la hauteur', async () => {
      const s = setup({ items: names(2), autoScroll: true });
      await tick();
      expect(s.selected()).toBe('Ligne 1');
    });
  });
});

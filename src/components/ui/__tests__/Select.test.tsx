import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'ink-testing-library';
import { CaretProvider } from '../../CaretProvider.js';
import { Select, type SelectOption } from '../Select.js';

const KEY = {
  up: '\u001B[A',
  down: '\u001B[B',
  enter: '\r',
  escape: '\u001B',
  ctrlU: '\u0015',
  ctrlD: '\u0004',
  pageUp: '\u001B[5~',
  pageDown: '\u001B[6~',
  home: '\u001B[H',
  end: '\u001B[F',
};

// Laisse à Ink le temps de lire la touche et de redessiner.
const tick = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));

const fruits: SelectOption[] = [
  { label: 'Annuler', value: 'annuler' },
  { label: 'Banane', value: 'banane' },
  { label: 'Cerise', value: 'cerise' },
];

const many: SelectOption[] = Array.from({ length: 12 }, (_, i) => ({
  label: `Option ${String(i + 1).padStart(2, '0')}`,
  value: `o${i + 1}`,
}));

function setup(props: Partial<React.ComponentProps<typeof Select>> = {}) {
  const onSelect = vi.fn();
  const onCancel = vi.fn();
  const view = render(
    <CaretProvider>
      <Select options={fruits} onSelect={onSelect} onCancel={onCancel} {...props} />
    </CaretProvider>,
  );
  const press = async (...keys: string[]) => {
    for (const key of keys) {
      view.stdin.write(key);
      await tick();
    }
  };
  // Le libellé de la ligne qui porte le curseur ">".
  const focused = () => {
    const line = (view.lastFrame() ?? '').split('\n').find((l) => l.includes('>'));
    return line?.replace(/[│>]/g, '').trim();
  };
  return { ...view, onSelect, onCancel, press, focused };
}

describe('Select', () => {
  it('met le curseur sur la première option', async () => {
    const s = setup();
    await tick();
    expect(s.focused()).toBe('Annuler');
    expect(s.lastFrame()).toContain('Banane');
  });

  it('descend et monte avec les flèches', async () => {
    const s = setup();
    await tick();
    await s.press(KEY.down);
    expect(s.focused()).toBe('Banane');
    await s.press(KEY.down, KEY.up, KEY.up);
    expect(s.focused()).toBe('Annuler');
  });

  it('boucle du premier au dernier et du dernier au premier', async () => {
    const s = setup();
    await tick();
    await s.press(KEY.up);
    expect(s.focused()).toBe('Cerise');
    await s.press(KEY.down);
    expect(s.focused()).toBe('Annuler');
  });

  it('valide avec Entrée', async () => {
    const s = setup();
    await tick();
    await s.press(KEY.down, KEY.enter);
    expect(s.onSelect).toHaveBeenCalledTimes(1);
    expect(s.onSelect).toHaveBeenCalledWith('banane');
  });

  it('annule avec Échap', async () => {
    const s = setup();
    await tick();
    await s.press(KEY.escape);
    await tick(150);
    expect(s.onCancel).toHaveBeenCalledTimes(1);
  });

  it('ne pose jamais le curseur sur une option désactivée', async () => {
    const options: SelectOption[] = [
      { label: 'Annuler', value: 'annuler', disabled: true },
      { label: 'Banane', value: 'banane' },
      { label: 'Cerise', value: 'cerise', disabled: true },
      { label: 'Datte', value: 'datte', disabled: true },
      { label: 'Figue', value: 'figue' },
      { label: 'Goyave', value: 'goyave', disabled: true },
    ];
    const disabled = options.filter((o) => o.disabled);
    const s = setup({ options, visibleCount: 3 });
    await tick();
    // La première option est désactivée : le curseur commence sur la suivante.
    expect(s.focused()).toBe('Banane');

    const visited: (string | undefined)[] = [];
    const keys = [
      KEY.down, KEY.down, KEY.down, KEY.up, KEY.up, KEY.up,
      'j', 'j', 'k', 'k', KEY.ctrlD, KEY.ctrlD, KEY.ctrlU, KEY.ctrlU,
      KEY.pageDown, KEY.pageUp, KEY.end, KEY.home,
    ];
    for (const key of keys) {
      await s.press(key, KEY.enter);
      visited.push(s.focused());
    }

    for (const option of disabled) {
      expect(visited).not.toContain(option.label);
      expect(s.onSelect).not.toHaveBeenCalledWith(option.value);
    }
    // Les flèches passent bien d'une option active à l'autre, en bouclant.
    expect(visited.slice(0, 3)).toEqual(['Figue', 'Banane', 'Figue']);
    expect(s.onSelect).toHaveBeenCalledTimes(keys.length);
  });

  it('n’a pas de curseur et ne valide rien quand tout est désactivé', async () => {
    const s = setup({
      options: fruits.map((option) => ({ ...option, disabled: true })),
    });
    await tick();
    await s.press(KEY.down, KEY.up, KEY.enter);
    expect(s.focused()).toBeUndefined();
    expect(s.onSelect).not.toHaveBeenCalled();
  });

  it('va au début et à la fin avec Début et Fin, et d’une page avec Page suivante', async () => {
    const s = setup({ options: many, visibleCount: 4 });
    await tick();
    await s.press(KEY.end);
    expect(s.focused()).toBe('Option 12');
    await s.press(KEY.home);
    expect(s.focused()).toBe('Option 01');
    await s.press(KEY.pageDown);
    expect(s.focused()).toBe('Option 05');
    await s.press(KEY.pageUp);
    expect(s.focused()).toBe('Option 01');
  });

  it('ignore les touches quand isActive est faux', async () => {
    const s = setup({ isActive: false });
    await tick();
    await s.press(KEY.down, KEY.enter);
    expect(s.focused()).toBe('Annuler');
    expect(s.onSelect).not.toHaveBeenCalled();
  });

  it('fait défiler la fenêtre quand la liste dépasse visibleCount', async () => {
    const s = setup({ options: many, visibleCount: 4 });
    await tick();
    expect(s.lastFrame()).not.toContain('Option 05');
    expect(s.lastFrame()).toContain('▼ 8 more');
    await s.press(KEY.down, KEY.down, KEY.down, KEY.down);
    expect(s.focused()).toBe('Option 05');
    expect(s.lastFrame()).toContain('▲ 1 more');
  });

  it('avance et recule d’une page avec ctrl+d et ctrl+u', async () => {
    const s = setup({ options: many, visibleCount: 4 });
    await tick();
    await s.press(KEY.ctrlD);
    expect(s.focused()).toBe('Option 05');
    await s.press(KEY.ctrlU);
    expect(s.focused()).toBe('Option 01');
  });

  it('j et k déplacent le curseur quand le typeahead est coupé', async () => {
    const s = setup();
    await tick();
    await s.press('j');
    expect(s.focused()).toBe('Banane');
    await s.press('k');
    expect(s.focused()).toBe('Annuler');
  });

  describe('avec typeahead', () => {
    const actions: SelectOption[] = [
      { label: 'Annuler', value: 'annuler' },
      { label: 'Éditer', value: 'editer' },
      { label: 'Envoyer', value: 'envoyer', disabled: true },
      { label: 'Exporter', value: 'exporter' },
      { label: 'Joindre', value: 'joindre' },
      { label: 'Kiosque', value: 'kiosque' },
    ];

    it('ne réagit pas aux lettres quand l’option est coupée', async () => {
      const s = setup({ options: actions });
      await tick();
      await s.press('e');
      expect(s.focused()).toBe('Annuler');
    });

    it('saute à l’option qui commence par la lettre, accents ignorés', async () => {
      const s = setup({ options: actions, typeahead: true });
      await tick();
      await s.press('e');
      expect(s.focused()).toBe('Éditer');
    });

    it('saute les options désactivées', async () => {
      const s = setup({ options: actions, typeahead: true });
      await tick();
      await s.press('e', 'e');
      expect(s.focused()).toBe('Exporter');
    });

    it('j et k cherchent une option au lieu de déplacer le curseur', async () => {
      const s = setup({ options: actions, typeahead: true });
      await tick();
      await s.press('j');
      expect(s.focused()).toBe('Joindre');
      await tick(600);
      await s.press('k');
      expect(s.focused()).toBe('Kiosque');
    });

    it('garde les flèches, ctrl+d et Entrée', async () => {
      const s = setup({ options: actions, typeahead: true });
      await tick();
      // "e" va sur Éditer ; la flèche saute Envoyer, qui est désactivée.
      await s.press('e', KEY.down, KEY.enter);
      expect(s.onSelect).toHaveBeenCalledWith('exporter');
      await s.press(KEY.ctrlD);
      expect(s.focused()).toBe('Kiosque');
    });

    it('valide avec Entrée juste après une recherche', async () => {
      const s = setup({ options: actions, typeahead: true });
      await tick();
      await s.press('j', KEY.enter);
      expect(s.onSelect).toHaveBeenCalledTimes(1);
      expect(s.onSelect).toHaveBeenCalledWith('joindre');
    });

    it('fait défiler la fenêtre jusqu’à une option hors écran', async () => {
      const options = [...many, { label: 'Zèbre', value: 'z' }];
      const s = setup({ options, visibleCount: 4, typeahead: true });
      await tick();
      expect(s.lastFrame()).not.toContain('Zèbre');
      await s.press('z');
      expect(s.focused()).toBe('Zèbre');
      expect(s.lastFrame()).toContain('▲ 9 more');
    });

    it('adapte la ligne d’aide', async () => {
      const s = setup({ options: actions, typeahead: true });
      await tick();
      expect(s.lastFrame()).toContain('type to search');
      expect(s.lastFrame()).not.toContain('jk');
    });
  });
});

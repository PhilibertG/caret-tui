import React, { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'ink-testing-library';
import { Text, useInput } from 'ink';
import { useTypeahead, type UseTypeaheadOptions } from '../index.js';

const tick = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));

const LABELS = ['Annuler', 'Éditer', 'Envoyer', 'Jeter', 'Quitter'];

type HarnessProps = Partial<UseTypeaheadOptions> & {
  seen?: (input: string, used: boolean) => void;
};

// A list reduced to the minimum: an index, and the hook fed from useInput.
function Harness({ seen, ...options }: HarnessProps) {
  const [current, setCurrent] = useState(options.current ?? 0);
  const labels = options.labels ?? LABELS;
  const typeahead = useTypeahead({ labels, onMatch: setCurrent, ...options, current });
  useInput((input, key) => {
    const used = typeahead.handleInput(input, key);
    seen?.(input, used);
  });
  return <Text>{`[${labels[current]}] ${typeahead.isSearching() ? 'recherche' : 'repos'}`}</Text>;
}

function setup(props: HarnessProps = {}) {
  const seen = vi.fn();
  const view = render(<Harness seen={seen} {...props} />);
  const press = async (...keys: string[]) => {
    for (const key of keys) {
      view.stdin.write(key);
      await tick();
    }
  };
  const current = () => /\[(.*)\]/.exec(view.lastFrame() ?? '')?.[1];
  return { ...view, seen, press, current };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useTypeahead', () => {
  it('saute à l’élément qui commence par la lettre tapée', async () => {
    const s = setup();
    await tick();
    await s.press('q');
    expect(s.current()).toBe('Quitter');
  });

  it('ignore les accents et la casse : "e" trouve "Éditer"', async () => {
    const s = setup();
    await tick();
    await s.press('e');
    expect(s.current()).toBe('Éditer');
  });

  it('plusieurs lettres tapées vite précisent la recherche', async () => {
    const s = setup();
    await tick();
    await s.press('e', 'n');
    expect(s.current()).toBe('Envoyer');
  });

  it('la même lettre répétée passe au suivant, puis reboucle', async () => {
    const s = setup();
    await tick();
    await s.press('e');
    expect(s.current()).toBe('Éditer');
    await s.press('e');
    expect(s.current()).toBe('Envoyer');
    await s.press('e');
    expect(s.current()).toBe('Éditer');
  });

  it('oublie les lettres après le délai', async () => {
    const s = setup({ timeout: 60 });
    await tick();
    await s.press('e');
    await tick(120);
    await s.press('q');
    // Sans l'oubli, la recherche serait "eq" et ne trouverait rien.
    expect(s.current()).toBe('Quitter');
  });

  it('saute les éléments désactivés', async () => {
    const s = setup({ isDisabled: (index) => index === 1 });
    await tick();
    await s.press('e');
    expect(s.current()).toBe('Envoyer');
  });

  it('ne bouge pas quand aucune étiquette ne correspond, mais prend la touche', async () => {
    const s = setup();
    await tick();
    await s.press('z');
    expect(s.current()).toBe('Annuler');
    expect(s.seen).toHaveBeenLastCalledWith('z', true);
  });

  it('laisse passer ctrl+lettre, les flèches et Entrée', async () => {
    const s = setup();
    await tick();
    await s.press('\u0005', '\u001B[B', '\r');
    expect(s.current()).toBe('Annuler');
    expect(s.seen.mock.calls.map((call) => call[1])).toEqual([false, false, false]);
  });

  it('une flèche met fin à la recherche en cours', async () => {
    const s = setup();
    await tick();
    await s.press('e', '\u001B[B', 'n');
    // "n" seul ne trouve rien ; avec "en" on serait allé sur "Envoyer".
    expect(s.current()).toBe('Éditer');
  });

  it('Espace seul reste à l’appelant, mais continue une recherche', async () => {
    const s = setup({ labels: ['Ouvrir', 'Ne pas ouvrir', 'Nettoyer'] });
    await tick();
    await s.press(' ');
    expect(s.seen).toHaveBeenLastCalledWith(' ', false);
    await s.press('n', 'e', ' ');
    expect(s.seen).toHaveBeenLastCalledWith(' ', true);
    expect(s.current()).toBe('Ne pas ouvrir');
  });

  it('traite un texte reçu en un seul morceau comme une suite de lettres', async () => {
    const onMatch = vi.fn();
    function Direct() {
      const typeahead = useTypeahead({ labels: LABELS, current: 0, onMatch });
      React.useEffect(() => {
        typeahead.handleInput('en');
      }, [typeahead]);
      return <Text>direct</Text>;
    }
    render(<Direct />);
    await tick();
    expect(onMatch).toHaveBeenLastCalledWith(2);
  });

  it('ne fait rien quand isActive est faux', async () => {
    const s = setup({ isActive: false });
    await tick();
    await s.press('q');
    expect(s.current()).toBe('Annuler');
    expect(s.seen).toHaveBeenLastCalledWith('q', false);
  });

  it('respecte la langue passée en option', async () => {
    const labels = ['Zèbre', 'Äpple', 'Apa'];
    const sv = setup({ labels, locale: 'sv' });
    await tick();
    await sv.press('a');
    expect(sv.current()).toBe('Apa');
    const fr = setup({ labels, locale: 'fr' });
    await tick();
    await fr.press('a');
    expect(fr.current()).toBe('Äpple');
  });

  it('annule son minuteur quand la liste disparaît', async () => {
    const s = setup({ timeout: 10_000 });
    await tick();
    await s.press('e');
    const clear = vi.spyOn(globalThis, 'clearTimeout');
    s.unmount();
    await tick();
    expect(clear).toHaveBeenCalled();
  });
});

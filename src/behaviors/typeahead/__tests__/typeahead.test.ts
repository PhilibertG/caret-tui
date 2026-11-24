// Cases ported from UI SDK's packages/core/test/typeahead.test.ts (commit
// d5c6249e1a0b1df47334d3012180bfba9b9374ec), to check that the adapted copy
// in ../vendor/typeahead.ts still behaves like the original.
import { describe, expect, test } from 'vitest';
import { createTypeahead } from '../vendor/typeahead.js';

const type = (labels: string[], keys: string, current = -1) => {
  const search = createTypeahead();
  let index = current;
  for (const key of keys) {
    const found = search(key, labels, index);
    if (found !== -1) {
      index = found;
    }
  }
  search.reset();
  return labels[index];
};

describe('typeahead (copie de UI SDK)', () => {
  test('matches ignoring case and accents', () => {
    const search = createTypeahead();
    expect(search.normalize('Éditer')).toBe('editer');
    expect(type(['Fichier', 'Éditer'], 'e')).toBe('Éditer');
  });

  test('matches non-Latin scripts', () => {
    expect(type(['Файл', 'Журнал'], 'ж')).toBe('Журнал');
  });

  test('a repeated letter cycles through matches', () => {
    expect(type(['Lamp', 'Lock', 'Note'], 'll')).toBe('Lock');
  });

  test('a label that starts with the doubled letter still wins', () => {
    expect(type(['Lamp', 'llama', 'Lock'], 'll')).toBe('llama');
  });

  test('a single letter starts after the current item', () => {
    expect(type(['Date', 'Delete'], 'd', 0)).toBe('Delete');
  });

  test('a longer prefix can stay on the current item', () => {
    expect(type(['Share', 'Show sidebar'], 'sha', 0)).toBe('Share');
  });

  test('with nothing highlighted, a longer query starts from the first item, not the last', () => {
    const search = createTypeahead();
    const labels = ['Bar', 'Car', 'Bat'];
    expect(search('b', labels, -1)).toBe(0);
    expect(search('a', labels, -1)).toBe(0);
    search.reset();
  });

  test('a third press of the same letter keeps stepping', () => {
    expect(type(['Lamp', 'Lock', 'Loop', 'Note'], 'lll')).toBe('Loop');
  });

  test('space only continues a search', () => {
    const search = createTypeahead();
    expect(search(' ', ['Open file'], -1)).toBe(-1);
  });

  // Not in the original: the two changes made to the copy.
  test('the locale is an option: Swedish keeps "ä" apart from "a"', () => {
    const sv = createTypeahead({ locale: 'sv' });
    expect(sv('a', ['Äpple', 'Apa'], -1)).toBe(1);
    sv.reset();
    const fr = createTypeahead({ locale: 'fr' });
    expect(fr('a', ['Äpple', 'Apa'], -1)).toBe(0);
    fr.reset();
  });

  test('the query clears after the timeout', async () => {
    const search = createTypeahead({ timeout: 30 });
    search('b', ['Bar', 'Bat'], -1);
    expect(search.active()).toBe(true);
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(search.active()).toBe(false);
  });
});

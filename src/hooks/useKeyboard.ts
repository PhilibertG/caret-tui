import { useInput } from 'ink';

interface KeyboardOptions {
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onEnter?: () => void;
  onEscape?: () => void;
  onTab?: () => void;
  onPageUp?: () => void;
  onPageDown?: () => void;
  onKey?: (key: string) => void;
  isActive?: boolean;
}

export const useKeyboard = (options: KeyboardOptions) => {
  const { isActive = true } = options;

  useInput((input, key) => {
    if (!isActive) return;

    if (key.upArrow) options.onUp?.();
    if (key.downArrow) options.onDown?.();
    if (key.leftArrow) options.onLeft?.();
    if (key.rightArrow) options.onRight?.();
    if (key.return) options.onEnter?.();
    if (key.escape) options.onEscape?.();
    if (key.tab) options.onTab?.();

    // Page navigation via ctrl+u / ctrl+d
    if (key.ctrl && input === 'u') options.onPageUp?.();
    if (key.ctrl && input === 'd') options.onPageDown?.();

    if (input && !key.ctrl && !key.meta) options.onKey?.(input);
  }, { isActive });
};

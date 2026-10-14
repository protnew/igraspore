import { describe, it, expect, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

function load() {
  vi.useFakeTimers();
  const code = fs.readFileSync(path.resolve(__dirname, '../../js/toast_queue.js'), 'utf-8');
  const el = { id: 'toast', style: {}, textContent: '' };
  const sandbox = {
    window: {},
    document: {
      getElementById: () => el,
      createElement: () => el,
      body: { appendChild: () => {} },
    },
    setTimeout: (fn, ms) => setTimeout(fn, ms),
    Date, console,
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return { sandbox, el };
}

describe('toast queue', () => {
  it('shows one toast and collapses a duplicate', () => {
    const { sandbox, el } = load();
    sandbox.showToast('Деление', '#8ff');
    sandbox.showToast('Деление', '#8ff');
    expect(el.textContent).toBe('Деление');
    expect(sandbox._toastQueueState().q).toBe(0);
    vi.useRealTimers();
  });

  it('does not show a third distinct toast in the same second', () => {
    const { sandbox, el } = load();
    sandbox.showToast('a', '#fff');
    sandbox.showToast('b', '#fff');
    sandbox.showToast('c', '#fff');
    expect(el.textContent).toBe('a');
    expect(sandbox._toastQueueState().q).toBe(1);
    vi.useRealTimers();
  });
});

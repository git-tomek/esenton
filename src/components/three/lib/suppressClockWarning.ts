// REMOVE when upgrading to @react-three/fiber v10 (it uses THREE.Timer).
//
// R3F 9.x instantiates `THREE.Clock` on every Canvas mount, and three r183
// deprecated Clock in favour of Timer, so the console gets spammed with a
// harmless deprecation warning. Filter only that exact message; everything
// else passes through untouched. Idempotent across HMR reloads.
declare global {
  interface Window {
    __clockWarnPatched?: boolean;
  }
}

const CLOCK_DEPRECATION = 'Clock: This module has been deprecated';

if (typeof window !== 'undefined' && !window.__clockWarnPatched) {
  window.__clockWarnPatched = true;
  const originalWarn = console.warn.bind(console);
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes(CLOCK_DEPRECATION)) {
      return;
    }
    originalWarn(...args);
  };
}

export {};

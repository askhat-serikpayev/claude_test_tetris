import { useEffect, useRef } from 'react';

export function useGameLoop(callback: (deltaMs: number) => void, active: boolean): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!active) return;

    let lastTime = performance.now();
    let frameId: number;

    const loop = (now: number): void => {
      const delta = now - lastTime;
      lastTime = now;
      callbackRef.current(delta);
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frameId);
  }, [active]);
}

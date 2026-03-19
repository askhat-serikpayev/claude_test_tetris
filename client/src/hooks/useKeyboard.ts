import { useEffect, useRef } from 'react';
import { GameEngine } from '../game';
import { Direction, RotationDirection, GameState } from '../types';

export function useKeyboard(engine: GameEngine): void {
  const engineRef = useRef(engine);
  engineRef.current = engine;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const eng = engineRef.current;

      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          eng.move(Direction.Left);
          break;
        case 'ArrowRight':
        case 'KeyD':
          eng.move(Direction.Right);
          break;
        case 'ArrowDown':
        case 'KeyS':
          eng.move(Direction.Down);
          break;
        case 'ArrowUp':
        case 'KeyW':
          eng.rotate(RotationDirection.Clockwise);
          break;
        case 'KeyZ':
          eng.rotate(RotationDirection.CounterClockwise);
          break;
        case 'Space':
          e.preventDefault();
          eng.hardDrop();
          break;
        case 'KeyC':
        case 'ShiftLeft':
        case 'ShiftRight':
          eng.hold();
          break;
        case 'KeyP':
        case 'Escape':
          eng.togglePause();
          break;
        case 'KeyR':
          if (eng.getState() === GameState.GameOver) {
            eng.start();
          }
          break;
        default:
          return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}

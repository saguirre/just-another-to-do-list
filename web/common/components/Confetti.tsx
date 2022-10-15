import { useCallback, useEffect, useRef, useState } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';

const canvasStyles: any = {
  position: 'absolute',
  zIndex: 1000,
  pointerEvents: 'none',
  width: '60%',
  borderRadius: '25%',
  top: -300,
};

interface ConfettiProps {
  shouldFire: boolean;
  defaultFireCount?: number;
}

export const Confetti: React.FC<ConfettiProps> = ({ shouldFire, defaultFireCount = 1 }) => {
  const refAnimationInstance = useRef<any>(null);
  const [fireCount, setFireCount] = useState(defaultFireCount);

  const getInstance = useCallback((instance: any) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback((particleRatio: number, opts: any) => {
    refAnimationInstance.current &&
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      });
  }, []);

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
    setFireCount((current) => current - 1);
  }, [makeShot]);

  useEffect(() => {
    if (shouldFire && fireCount > 0) {
      fire();
    }
  }, [shouldFire]);

  return <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />;
};

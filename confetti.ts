import confetti from 'canvas-confetti';

export const triggerCelebration = () => {
  // Elegant gold, warm amber, champagne, and emerald palette
  const colors = ['#f59e0b', '#fbbf24', '#d97706', '#10b981', '#34d399', '#fef3c7'];

  // Left side burst
  confetti({
    particleCount: 45,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.7 },
    colors,
    ticks: 200,
    gravity: 0.9,
    scalar: 1.1,
  });

  // Right side burst
  confetti({
    particleCount: 45,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.7 },
    colors,
    ticks: 200,
    gravity: 0.9,
    scalar: 1.1,
  });

  // Center gentle fountain
  setTimeout(() => {
    confetti({
      particleCount: 30,
      spread: 100,
      origin: { x: 0.5, y: 0.6 },
      colors,
      ticks: 220,
      gravity: 0.8,
    });
  }, 150);
};

export const triggerGrandFinish = () => {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 120, zIndex: 1000 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval = window.setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 40 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#f59e0b', '#e11d48', '#10b981', '#3b82f6', '#fbbf24'],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#f59e0b', '#e11d48', '#10b981', '#3b82f6', '#fbbf24'],
    });
  }, 250);
};

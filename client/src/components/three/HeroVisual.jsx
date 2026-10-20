import { Suspense, lazy, useState, useEffect } from 'react';

const Scene = lazy(() => import('./HeroScene'));

function Fallback() {
  return (
    <div
      className="aspect-square w-full max-w-md mx-auto rounded-card bg-surface-secondary border border-border flex items-center justify-center"
      aria-hidden
    >
      <div className="h-32 w-32 rounded-full border-2 border-accent/40 border-dashed animate-pulse" />
    </div>
  );
}

export function HeroVisual() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (e) => setReduceMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (!mounted || reduceMotion) {
    return <Fallback />;
  }

  return (
    <div className="aspect-square w-full max-w-md mx-auto">
      <Suspense fallback={<Fallback />}>
        <Scene />
      </Suspense>
    </div>
  );
}

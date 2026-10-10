'use client';

import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';

function useCountUp(target: number, start: boolean, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return val;
}

function Stat({
  num,
  label,
  start,
  accent,
}: {
  num: number;
  label: string;
  start: boolean;
  accent?: boolean;
}) {
  const v = useCountUp(num, start);
  return (
    <div className="stat">
      <div className="stat-num">
        {accent ? <em>{v.toLocaleString()}</em> : v.toLocaleString()}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStart(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="container" style={{ paddingBottom: '1rem' }}>
      <Reveal>
        <div className="stats" ref={ref}>
          <Stat num={2648} label="total skills" start={start} accent />
          <Stat num={899} label="original skills" start={start} />
          <Stat num={1749} label="curated imports" start={start} />
          <Stat num={31} label="original categories" start={start} />
        </div>
      </Reveal>
    </div>
  );
}

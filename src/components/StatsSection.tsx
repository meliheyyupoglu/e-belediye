"use client";

import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current || target === 0) {
      setCount(target);
      return;
    }
    started.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return count;
}

function StatItem({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const animated = useCountUp(value);
  return (
    <div className={`stat-card ${color}`}>
      <div className="text-3xl md:text-4xl font-bold text-gray-900 tabular-nums">
        {animated}
      </div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
}

export default function StatsSection() {
  const [stats, setStats] = useState({
    toplam: 0,
    incelemede: 0,
    cozuldu: 0,
    devam: 0,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/basvurular?stats=1")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="stat-card animate-pulse h-24 bg-gray-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatItem label="Toplam Başvuru" value={stats.toplam} color="primary" />
      <StatItem label="İncelemede" value={stats.incelemede} color="warning" />
      <StatItem label="Çözülen" value={stats.cozuldu} color="success" />
      <StatItem label="Devam Eden" value={stats.devam} color="danger" />
    </div>
  );
}

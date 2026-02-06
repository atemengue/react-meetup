import { useRef, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface RenderTrackerProps {
  name: string;
  children: ReactNode;
  active?: boolean;
}

export function RenderTracker({ name, children, active = true }: RenderTrackerProps) {
  const renderCount = useRef(0);
  const [flashing, setFlashing] = useState(false);
  const lastRenderTime = useRef(Date.now());

  renderCount.current += 1;
  const timeSinceLastRender = Date.now() - lastRenderTime.current;
  lastRenderTime.current = Date.now();

  useEffect(() => {
    if (!active || renderCount.current <= 1) return;
    setFlashing(true);
    const timer = setTimeout(() => setFlashing(false), 600);
    return () => clearTimeout(timer);
  });

  if (!active) return <>{children}</>;

  return (
    <div className={`render-tracker ${flashing ? 'flash' : ''}`}>
      <div className="render-tracker-badge">
        <span className="tracker-name">{name}</span>
        <span className="tracker-count">{renderCount.current}x</span>
        {timeSinceLastRender < 5000 && renderCount.current > 1 && (
          <span className="tracker-time">
            {timeSinceLastRender < 1000
              ? `${timeSinceLastRender}ms`
              : `${(timeSinceLastRender / 1000).toFixed(1)}s`}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

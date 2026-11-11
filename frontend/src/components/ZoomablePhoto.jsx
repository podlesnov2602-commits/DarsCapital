import React, { useRef, useState } from 'react';

const initialView = { scale: 1, x: 0, y: 0 };
const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value));

function sample(touches) {
  if (!touches.length) return null;
  const [a, b = a] = Array.from(touches);
  return {
    count: touches.length,
    x: (a.clientX + b.clientX) / 2,
    y: (a.clientY + b.clientY) / 2,
    distance: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
  };
}

export default function ZoomablePhoto({ src, alt, onPrevious, onNext }) {
  const image = useRef(null);
  const previous = useRef(null);
  const swipeOrigin = useRef(null);
  const view = useRef(initialView);
  const [position, setPosition] = useState(initialView);

  function start(event) {
    const point = sample(event.touches);
    previous.current = point;
    swipeOrigin.current = point.count === 1 && view.current.scale === 1 ? point : null;
  }

  function move(event) {
    const point = sample(event.touches);
    const last = previous.current;
    previous.current = point;
    if (!point || !last || point.count !== last.count) return;

    const old = view.current;
    if (point.count === 1 && old.scale === 1) return;
    const ratio = point.count >= 2 && last.distance ? point.distance / last.distance : 1;
    const scale = Math.max(1, Math.min(8, old.scale * ratio));
    const bounds = event.currentTarget.getBoundingClientRect();
    const photo = image.current;
    if (!photo.naturalWidth || !photo.naturalHeight) return;
    const fit = Math.min(bounds.width / photo.naturalWidth, bounds.height / photo.naturalHeight);
    const limitX = Math.max(0, (photo.naturalWidth * fit * scale - bounds.width) / 2);
    const limitY = Math.max(0, (photo.naturalHeight * fit * scale - bounds.height) / 2);
    const cx = bounds.left + bounds.width / 2;
    const cy = bounds.top + bounds.height / 2;
    const next = {
      scale,
      x: clamp(point.x - cx - (last.x - cx - old.x) * scale / old.scale, limitX),
      y: clamp(point.y - cy - (last.y - cy - old.y) * scale / old.scale, limitY),
    };
    view.current = next;
    setPosition(next);
  }

  function end(event) {
    previous.current = sample(event.touches);
    const origin = swipeOrigin.current;
    swipeOrigin.current = null;
    if (!origin || previous.current || view.current.scale !== 1) return;
    const endPoint = event.changedTouches[0];
    const dx = endPoint.clientX - origin.x;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(endPoint.clientY - origin.y)) {
      if (dx < 0) onNext();
      else onPrevious();
    }
  }

  return (
    <div className="w-full h-full overflow-hidden touch-none select-none"
      onTouchStart={start} onTouchMove={move} onTouchEnd={end}
      onTouchCancel={() => { previous.current = null; swipeOrigin.current = null; }}>
      <img ref={image} src={src} alt={alt} draggable={false}
        className="w-full h-full object-contain"
        style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${position.scale})` }} />
    </div>
  );
}

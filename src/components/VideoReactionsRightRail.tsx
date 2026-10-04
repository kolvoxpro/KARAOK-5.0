import React, { useEffect, useState, useRef } from 'react';
import { LiveReaction } from '../types';

interface FloatingRailItem {
  key: string;
  emoji: string;
  senderName: string;
}

interface VideoReactionsRightRailProps {
  reactions: LiveReaction[];
}

export const VideoReactionsRightRail: React.FC<VideoReactionsRightRailProps> = ({ reactions }) => {
  const [activeItems, setActiveItems] = useState<FloatingRailItem[]>([]);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const isFirstMountRef = useRef<boolean>(true);

  useEffect(() => {
    if (!reactions) return;

    // On initial mount, mark all existing past reactions as already seen
    // so they are NOT dumped onto the screen on page load!
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      reactions.forEach((r) => seenIdsRef.current.add(r.id));
      return;
    }

    // Only process brand new reactions that arrived AFTER mount
    const newReactions = reactions.filter((r) => !seenIdsRef.current.has(r.id));
    if (newReactions.length === 0) return;

    newReactions.forEach((r) => {
      seenIdsRef.current.add(r.id);
      const itemKey = `${r.id}-${Date.now()}-${Math.random()}`;

      const newItem: FloatingRailItem = {
        key: itemKey,
        emoji: r.emoji,
        senderName: r.senderName || 'Plateia'
      };

      // Add only this single selected emoji
      setActiveItems((prev) => [...prev.slice(-6), newItem]);

      // Remove after animation completes (2.8s)
      setTimeout(() => {
        setActiveItems((prev) => prev.filter((i) => i.key !== itemKey));
      }, 2800);
    });
  }, [reactions]);

  if (activeItems.length === 0) return null;

  return (
    <div className="absolute right-4 bottom-6 z-30 pointer-events-none flex flex-col items-end space-y-2.5 max-w-[220px] select-none">
      {activeItems.map((item) => (
        <div
          key={item.key}
          className="animate-float-right-rail flex items-center gap-2 bg-neutral-950/90 border border-cyan-400/80 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)]"
        >
          <span className="text-3xl animate-bounce leading-none drop-shadow-md">
            {item.emoji}
          </span>
          <div className="text-right leading-tight max-w-[130px]">
            <span className="block text-xs font-black text-white truncate">
              {item.senderName}
            </span>
            <span className="text-[9px] text-cyan-300 font-bold uppercase tracking-wider">
              Plateia ao Vivo
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

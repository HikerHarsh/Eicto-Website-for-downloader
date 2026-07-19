"use client";

import { useEffect, useState, useCallback } from "react";
import "./AquariumBackground.css";

interface Fish {
    id: number;
    top: number;
    duration: number;
    delay: number;
    scale: number;
    direction: 'left' | 'right';
}

interface Bubble {
    id: number;
    left: number;
    size: number;
    duration: number;
}

interface CursorBubble {
    id: number;
    x: number;
    y: number;
    size: number;
}

export default function AquariumBackground() {
    const [fishes, setFishes] = useState<Fish[]>([]);
    const [bubbles, setBubbles] = useState<Bubble[]>([]);
    const [cursorBubbles, setCursorBubbles] = useState<CursorBubble[]>([]);

    useEffect(() => {
        // Generate 15 fishes
        const newFishes: Fish[] = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            top: Math.random() * 90, // 0 to 90vh
            duration: 15 + Math.random() * 20, // 15s to 35s to cross screen
            delay: Math.random() * -30, // Start at different times (negative delay means already on screen)
            scale: 0.5 + Math.random() * 0.8, // Different sizes
            direction: Math.random() > 0.5 ? 'left' : 'right'
        }));
        setFishes(newFishes);

        // Generate ambient bubbles
        const newBubbles: Bubble[] = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100, // 0 to 100vw
            size: 4 + Math.random() * 10,
            duration: 5 + Math.random() * 10
        }));
        setBubbles(newBubbles);
    }, []);

    // Cursor hover bubble effect
    const handleMouseMove = useCallback((e: MouseEvent) => {
        // Only create a bubble every few pixels to avoid lagging
        if (Math.random() > 0.85) {
            const newBubble: CursorBubble = {
                id: Date.now() + Math.random(),
                x: e.clientX,
                y: e.clientY,
                size: 8 + Math.random() * 12
            };
            
            setCursorBubbles(prev => [...prev, newBubble]);

            // Remove bubble after animation ends (approx 2s)
            setTimeout(() => {
                setCursorBubbles(prev => prev.filter(b => b.id !== newBubble.id));
            }, 2000);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [handleMouseMove]);

    return (
        <div className="aquarium-container">
            {/* Ambient Background Bubbles */}
            {bubbles.map(bubble => (
                <div 
                    key={bubble.id} 
                    className="ambient-bubble"
                    style={{
                        left: `${bubble.left}vw`,
                        width: `${bubble.size}px`,
                        height: `${bubble.size}px`,
                        animationDuration: `${bubble.duration}s`,
                        animationDelay: `-${Math.random() * bubble.duration}s`
                    }}
                />
            ))}

            {/* Hover Cursor Bubbles */}
            {cursorBubbles.map(bubble => (
                <div 
                    key={bubble.id} 
                    className="cursor-bubble"
                    style={{
                        left: `${bubble.x}px`,
                        top: `${bubble.y}px`,
                        width: `${bubble.size}px`,
                        height: `${bubble.size}px`,
                    }}
                />
            ))}

            {/* Fishes */}
            {fishes.map(fish => (
                <div 
                    key={fish.id} 
                    className={`fish-wrapper animate-${fish.direction}`}
                    style={{
                        top: `${fish.top}vh`,
                        animationDuration: `${fish.duration}s`,
                        animationDelay: `${fish.delay}s`,
                        transform: `scale(${fish.scale})`
                    }}
                >
                    {/* Simple SVG Fish */}
                    <svg viewBox="0 0 100 50" className="fish-svg">
                        <path 
                            d="M 80,25 Q 90,10 100,5 L 95,25 L 100,45 Q 90,40 80,25 Z M 10,25 Q 30,5 50,5 Q 70,5 85,25 Q 70,45 50,45 Q 30,45 10,25 Z M 20,25 A 3,3 0 1,1 20,24.9 Z" 
                            fill="rgba(255,255,255,0.15)"
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth="1"
                        />
                        <path d="M 40,25 Q 50,15 60,25 Q 50,35 40,25 Z" fill="rgba(255,255,255,0.05)" />
                    </svg>
                </div>
            ))}
        </div>
    );
}

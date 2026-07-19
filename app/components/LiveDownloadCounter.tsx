"use client";

import { useEffect, useState } from "react";
import "./LiveDownloadCounter.css";

// Formatter to add commas (e.g., 1,452,890)
const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
};

export default function LiveDownloadCounter() {
    const [count, setCount] = useState<number | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    // Fetch initial count and poll every 10 seconds for live updates
    useEffect(() => {
        let isMounted = true;

        const fetchCount = async () => {
            try {
                const res = await fetch("/api/downloads");
                if (res.ok) {
                    const data = await res.json();
                    if (isMounted && data.totalDownloads) {
                        setCount(data.totalDownloads);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch download count", error);
            }
        };

        fetchCount(); // Initial fetch
        const intervalId = setInterval(fetchCount, 10000); // Poll every 10s

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, []);

    // Expose a function to window so we can trigger it from the main page button
    useEffect(() => {
        (window as any).triggerDownloadIncrement = async () => {
            // Optimistic update in UI
            setCount((prev) => (prev !== null ? prev + 1 : prev));
            
            // Trigger pulse animation
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 500);

            // Call API
            try {
                await fetch("/api/downloads", { method: "POST" });
            } catch (error) {
                console.error("Failed to increment download count", error);
            }
        };

        return () => {
            delete (window as any).triggerDownloadIncrement;
        };
    }, []);

    if (count === null) {
        return (
            <div className="live-counter-skeleton">
                <div className="skeleton-pulse"></div>
            </div>
        );
    }

    return (
        <div className={`live-download-counter ${isAnimating ? 'pulse-anim' : ''}`}>
            <span className="live-dot"></span>
            <span className="counter-number">{formatNumber(count)}</span>
            <span className="counter-text">Total Downloads</span>
        </div>
    );
}

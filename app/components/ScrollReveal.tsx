'use client';

import React, { useEffect, useRef } from 'react';

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    distance?: number;
    once?: boolean;
    margin?: string;
}

export default function ScrollReveal({
    children,
    className = '',
    delay = 0,
    duration = 0.5,
    direction = 'up',
    distance = 30,
    once = true,
    margin = '50px',
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || typeof IntersectionObserver === 'undefined' || typeof el.animate !== 'function'
            || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const offset = {
            up: `translateY(${distance}px)`,
            down: `translateY(-${distance}px)`,
            left: `translateX(${distance}px)`,
            right: `translateX(-${distance}px)`,
            none: 'none',
        }[direction];
        let animation: Animation | undefined;

        // The server-rendered content stays visible. Motion only enhances it
        // once browser code is running; it never gates access to the section.
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    animation?.cancel();
                    animation = el.animate([
                        { opacity: 0.65, transform: offset },
                        { opacity: 1, transform: 'none' },
                    ], {
                        duration: Math.max(0, duration * 1000),
                        delay: Math.max(0, delay * 1000),
                        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    });
                    if (once) observer.unobserve(el);
                }
            },
            { rootMargin: margin }
        );

        observer.observe(el);
        return () => {
            observer.disconnect();
            animation?.cancel();
        };
    }, [delay, direction, distance, duration, margin, once]);

    return (
        <div
            ref={ref}
            className={className}
        >
            {children}
        </div>
    );
}

'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';

interface CounterProps {
  targetNumber: number;
  duration?: number; // Optional duration for counting animation in seconds
  text: string;
}

const Counter: React.FC<CounterProps> = ({ targetNumber, duration = 2, text }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const hasAnimated = useRef(false);

  const startCounting = useCallback(() => {
    const increment = Math.ceil(targetNumber / (duration * 60)); // Divide target by total frames (approx. 60 frames per second)
    let currentCount = 0;

    const counterInterval = setInterval(() => {
      currentCount += increment;
      if (currentCount >= targetNumber) {
        setCount(targetNumber);
        clearInterval(counterInterval);
      } else {
        setCount(currentCount);
      }
    }, 1000 / 60); // Update 60 times per second
  }, [targetNumber, duration]);

  useEffect(() => {
    const element = ref.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          startCounting();
        }
      },
      { threshold: 0.1 }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [startCounting]);

  return (
    <div ref={ref} className="counter">
      <h1 className="font-bold font-serif">{count}+</h1>
      <p className="mt-3 text-sm">{text}</p>
    </div>
  );
};

export default Counter;

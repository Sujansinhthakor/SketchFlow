import { useEffect, useRef, useState } from "react";

export default function FeatureCard({
    icon,
    title,
    description,
    delay,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay: number;
  }) {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) setVisible(true);
        },
        { threshold: 0.2 },
      );
      obs.observe(el);
      return () => obs.disconnect();
    }, []);
  
    return (
      <div
        ref={ref}
        className={`group relative rounded-2xl border p-6 backdrop-blur-xl transition-all duration-700 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        } bg-white/50 border-gray-200/60 hover:bg-white/80 hover:border-gray-300/80 dark:bg-white/[.03] dark:border-white/[.06] dark:hover:bg-white/[.06] dark:hover:border-white/[.12] hover:shadow-lg`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        <div
          className="inline-flex items-center justify-center h-10 w-10 rounded-xl mb-4 transition-colors duration-300 bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-900 dark:bg-white/[.08] dark:text-gray-300 dark:group-hover:bg-white/[.15] dark:group-hover:text-white"
        >
          {icon}
        </div>
        <h3
          className="text-sm font-semibold mb-1.5 transition-colors text-gray-900 dark:text-gray-100"
        >
          {title}
        </h3>
        <p
          className="text-xs leading-relaxed text-gray-500"
        >
          {description}
        </p>
      </div>
    );
  }
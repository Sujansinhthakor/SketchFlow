export default function SketchyCanvas() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#f8f7f2] dark:bg-[#090c12]"
    >
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(0, -18px, 0) scale(1.03); }
        }
        @keyframes floatMedium {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
          50% { transform: translate3d(0, 14px, 0) rotate(3deg); }
        }
        @keyframes driftLeft {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(-14px, -10px, 0); }
        }
        @keyframes driftRight {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(16px, 10px, 0); }
        }
        @keyframes pulseSoft {
          0%, 100% { opacity: .35; transform: scale(1); }
          50% { opacity: .7; transform: scale(1.08); }
        }

        .float-slow { 
          animation: floatSlow 12s ease-in-out infinite; 
          will-change: transform;
        }
        .float-med { 
          animation: floatMedium 9s ease-in-out infinite; 
          will-change: transform;
        }
        .drift-left { 
          animation: driftLeft 10s ease-in-out infinite; 
          will-change: transform;
        }
        .drift-right { 
          animation: driftRight 11s ease-in-out infinite; 
          will-change: transform;
        }
        .pulse-soft { 
          animation: pulseSoft 4.5s ease-in-out infinite; 
          will-change: opacity, transform;
        }
        .gpu-layer {
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
        }

        .ambient-glow-1 {
          background-image: radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%);
        }
        .dark .ambient-glow-1 {
          background-image: radial-gradient(circle, rgba(34, 211, 238, 0.08) 0%, transparent 70%);
        }
        .ambient-glow-2 {
          background-image: radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%);
        }
        .dark .ambient-glow-2 {
          background-image: radial-gradient(circle, rgba(167, 139, 250, 0.08) 0%, transparent 70%);
        }
        .ambient-glow-3 {
          background-image: radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%);
        }
        .dark .ambient-glow-3 {
          background-image: radial-gradient(circle, rgba(52, 211, 153, 0.08) 0%, transparent 70%);
        }

        .grid-pattern-1 {
          background-image: repeating-linear-gradient(
            0deg,
            rgba(0,0,0,0.03) 0,
            rgba(0,0,0,0.03) 1px,
            transparent 1px,
            transparent 24px
          ),
          repeating-linear-gradient(
            90deg,
            rgba(0,0,0,0.03) 0,
            rgba(0,0,0,0.03) 1px,
            transparent 1px,
            transparent 24px
          );
        }
        .dark .grid-pattern-1 {
          background-image: repeating-linear-gradient(
            0deg,
            rgba(255,255,255,0.03) 0,
            rgba(255,255,255,0.03) 1px,
            transparent 1px,
            transparent 24px
          ),
          repeating-linear-gradient(
            90deg,
            rgba(255,255,255,0.03) 0,
            rgba(255,255,255,0.03) 1px,
            transparent 1px,
            transparent 24px
          );
        }

        .grid-pattern-2 {
          background-image: repeating-linear-gradient(
            0deg,
            rgba(0,0,0,0.05) 0,
            rgba(0,0,0,0.05) 1px,
            transparent 1px,
            transparent 96px
          ),
          repeating-linear-gradient(
            90deg,
            rgba(0,0,0,0.05) 0,
            rgba(0,0,0,0.05) 1px,
            transparent 1px,
            transparent 96px
          );
        }
        .dark .grid-pattern-2 {
          background-image: repeating-linear-gradient(
            0deg,
            rgba(255,255,255,0.05) 0,
            rgba(255,255,255,0.05) 1px,
            transparent 1px,
            transparent 96px
          ),
          repeating-linear-gradient(
            90deg,
            rgba(255,255,255,0.05) 0,
            rgba(255,255,255,0.05) 1px,
            transparent 1px,
            transparent 96px
          );
        }
      `}</style>

      {/* Ambient glows */}
      <div className="absolute left-1/2 top-1/3 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 float-slow gpu-layer ambient-glow-1" />
      <div className="absolute right-[-8rem] top-[12%] h-[26rem] w-[26rem] float-med gpu-layer ambient-glow-2" />
      <div className="absolute bottom-[-10rem] left-[12%] h-[22rem] w-[22rem] drift-right gpu-layer ambient-glow-3" />

      {/* Static Grid Patterns */}
      <div className="absolute inset-0 opacity-70 gpu-layer grid-pattern-1" />
      <div className="absolute inset-0 opacity-55 gpu-layer grid-pattern-2" />

      {/* Shapes */}

      {/* 1. Rectangle shape */}
      <svg
        className="absolute left-[8%] top-[16%] w-[260px] h-[180px] float-med gpu-layer pointer-events-none"
        viewBox="0 0 260 180"
      >
        <rect
          x="10"
          y="10"
          width="220"
          height="140"
          rx="22"
          className="fill-white/65 dark:fill-white/[.03] stroke-black/10 dark:stroke-white/20"
          strokeWidth="2"
          strokeDasharray="8 7"
          transform="rotate(-7 120 80)"
        />
      </svg>

      {/* 2. Circle shape */}
      <svg
        className="absolute left-[78%] top-[20%] w-[130px] h-[130px] drift-left gpu-layer pointer-events-none"
        viewBox="0 0 130 130"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <circle
          cx="65"
          cy="65"
          r="58"
          className="fill-white/52 dark:fill-white/[.02] stroke-black/10 dark:stroke-white/20"
          strokeWidth="2"
          strokeDasharray="7 7"
        />
      </svg>

      {/* 3. Wave line shape */}
      <svg
        className="absolute left-[18%] top-[72%] w-[45%] h-[100px] float-slow gpu-layer pointer-events-none"
        viewBox="0 0 500 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 0 50 C 60 10, 160 10, 220 50 S 380 90, 440 50"
          fill="none"
          className="stroke-black/[.11] dark:stroke-white/20"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      {/* 4. Diamond shape */}
      <svg
        className="absolute left-[70%] top-[55%] w-[150px] h-[150px] drift-right gpu-layer pointer-events-none"
        viewBox="0 0 150 150"
      >
        <polygon
          points="75,20 130,75 75,130 20,75"
          fill="none"
          className="stroke-black/10 dark:stroke-white/20"
          strokeWidth="2"
          strokeDasharray="6 5"
        />
      </svg>

      {/* 5. Ellipse shape */}
      <svg
        className="absolute left-[52%] top-[82%] w-[200px] h-[100px] float-med gpu-layer pointer-events-none"
        viewBox="0 0 200 100"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <ellipse
          cx="100"
          cy="50"
          rx="92"
          ry="42"
          fill="none"
          className="stroke-black/[.08] dark:stroke-white/16"
          strokeWidth="2"
          strokeDasharray="4 6"
        />
      </svg>

      {/* Tiny Doodles */}
      <svg
        className="absolute left-[120px] top-[520px] w-[50px] h-[50px] float-slow gpu-layer pointer-events-none"
        viewBox="0 0 50 50"
      >
        <path
          d="M25 7 l18 18 l-18 18 l-18 -18 z"
          fill="none"
          className="stroke-black/10 dark:stroke-white/12"
          strokeWidth="2"
        />
      </svg>

      <svg
        className="absolute left-[75%] top-[180px] w-[40px] h-[40px] float-med gpu-layer pointer-events-none"
        viewBox="0 0 40 40"
      >
        <path
          d="M20 6 l14 14 l-14 14 l-14 -14 z"
          fill="none"
          className="stroke-black/10 dark:stroke-white/12"
          strokeWidth="2"
        />
      </svg>

      <svg
        className="absolute left-[60%] top-[620px] w-[80px] h-[40px] drift-left gpu-layer pointer-events-none"
        viewBox="0 0 80 40"
      >
        <path
          d="M10 30 c18 -20 38 -20 56 0"
          fill="none"
          className="stroke-black/10 dark:stroke-white/12"
          strokeWidth="2"
        />
      </svg>

      <svg
        className="absolute left-[200px] top-[160px] w-[60px] h-[30px] drift-right gpu-layer pointer-events-none"
        viewBox="0 0 60 30"
      >
        <path
          d="M10 20 c10 -12 22 -12 32 0"
          fill="none"
          className="stroke-black/10 dark:stroke-white/12"
          strokeWidth="2"
        />
      </svg>

      <svg
        className="absolute left-[80%] top-[520px] w-[60px] h-[30px] float-slow gpu-layer pointer-events-none"
        viewBox="0 0 60 30"
      >
        <path
          d="M10 20 c10 -12 22 -12 32 0"
          fill="none"
          className="stroke-black/10 dark:stroke-white/12"
          strokeWidth="2"
        />
      </svg>

      {/* Soft particles */}
      <div className="absolute inset-0">
        <span className="absolute left-[16%] top-[26%] h-2 w-2 rounded-full pulse-soft gpu-layer bg-black/20 dark:bg-white/30" />
        <span
          className="absolute left-[72%] top-[22%] h-2 w-2 rounded-full pulse-soft gpu-layer bg-cyan-500/25 dark:bg-cyan-300/40"
          style={{ animationDelay: "1s" }}
        />
        <span
          className="absolute left-[52%] top-[76%] h-2 w-2 rounded-full pulse-soft gpu-layer bg-violet-500/22 dark:bg-violet-300/35"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(248,247,242,0.80)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_28%,rgba(9,12,18,0.72)_100%)]" />
    </div>
  );
}

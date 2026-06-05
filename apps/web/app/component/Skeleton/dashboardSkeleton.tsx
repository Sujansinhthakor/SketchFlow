const WorkspacesSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col p-5 rounded-2xl border bg-white border-gray-200 dark:bg-[#111113]/50 dark:border-white/6"
        >
          {/* ── Card header: folder icon skeleton ── */}
          <div className="flex items-start justify-between mb-8">
            <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-white/10 animate-pulse" />
          </div>

          {/* ── Card footer: name + meta row skeleton ── */}
          <div>
            {/* Title skeleton */}
            <div className="h-5 bg-gray-200 dark:bg-white/10 rounded-md w-2/3 mb-3 animate-pulse" />

            {/* Metadata row — timestamp left, actions right */}
            <div className="flex items-center justify-between gap-2">
              <div className="h-3 bg-gray-100 dark:bg-white/5 rounded-md w-5/12 animate-pulse" />
              <div className="h-7 w-7 bg-gray-100 dark:bg-white/5 rounded-md flex-shrink-0 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkspacesSkeleton;

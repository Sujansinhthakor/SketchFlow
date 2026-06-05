interface ConnectingOverlayProps {
  title?: string;
  message?: string;
}

const ConnectingOverlay = ({ 
  title = "Joining Room", 
  message = "Establishing connection…" 
}: ConnectingOverlayProps) => {
    return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-md transition-opacity duration-300 dark:bg-black/50">
        <div className="flex flex-col items-center gap-5 rounded-3xl border border-gray-200/60 bg-white/80 px-10 py-8 shadow-2xl backdrop-blur-2xl animate-[slideUp_300ms_ease-out] dark:border-white/[0.08] dark:bg-[#1a1a1f]/80 dark:shadow-[0_8px_64px_rgba(0,0,0,0.6)]">
            {/* Animated spinner */}
            <div className="relative h-12 w-12">
                <div className="absolute inset-0 rounded-full border-[3px] border-gray-200 dark:border-white/10" />
                <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-blue-500 dark:border-t-blue-400" />
                <div className="absolute inset-1.5 animate-[spin_1.5s_linear_infinite_reverse] rounded-full border-[2px] border-transparent border-b-violet-500 dark:border-b-violet-400" />
            </div>

            {/* Text */}
            <div className="text-center">
                <p className="text-sm font-semibold tracking-tight text-gray-800 dark:text-white">
                    {title}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {message}
                </p>
            </div>

            {/* Pulsing dots */}
            <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 animate-[pulse_1.4s_ease-in-out_infinite] rounded-full bg-blue-500 dark:bg-blue-400" />
                <span className="h-1.5 w-1.5 animate-[pulse_1.4s_ease-in-out_0.2s_infinite] rounded-full bg-violet-500 dark:bg-violet-400" />
                <span className="h-1.5 w-1.5 animate-[pulse_1.4s_ease-in-out_0.4s_infinite] rounded-full bg-blue-500 dark:bg-blue-400" />
            </div>
        </div>
    </div>
}
export default ConnectingOverlay
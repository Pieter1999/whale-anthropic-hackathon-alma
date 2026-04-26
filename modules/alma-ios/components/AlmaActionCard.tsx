import { ChevronRightIcon, MicIcon } from "./Icons";

export function AlmaActionCard({
  isLoading = false,
  isInCall = false,
  isSpeaking = false,
  onAsk,
}: {
  isLoading?: boolean;
  isInCall?: boolean;
  isSpeaking?: boolean;
  onAsk?: () => void;
}) {
  const label = isLoading
    ? "Connecting to Alma..."
    : isSpeaking
      ? "Alma is speaking"
      : isInCall
        ? "End voice call"
        : "Ask Alma";

  const sublabel = isInCall || isSpeaking || isLoading
    ? null
    : "Voice · Patient profile · Real-time guidance";

  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={onAsk}
      className="mx-3.5 mb-2 flex w-[calc(100%-28px)] items-center gap-3 rounded-[16px] bg-gradient-to-b from-[#1A3829] to-[#142E20] p-3.5 text-left text-[#F5EDD8] shadow-[0_6px_20px_rgba(20,46,32,0.30)]"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#C8923A] to-[#A67530] shadow-[0_2px_10px_rgba(168,117,48,0.40)]">
        <MicIcon />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-semibold leading-tight">
          {label}
        </span>
        {sublabel ? (
          <span className="mt-0.5 block text-[10.5px] text-[#F5EDD8]/60">
            {sublabel}
          </span>
        ) : null}
      </span>
      <span className="shrink-0 opacity-40">
        <ChevronRightIcon />
      </span>
    </button>
  );
}

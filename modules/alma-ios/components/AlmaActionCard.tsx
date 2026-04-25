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
        : "Ask or save a preference";

  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={onAsk}
      className="mx-3.5 mb-2 flex w-[calc(100%-28px)] items-center gap-3 rounded-[14px] bg-gradient-to-b from-[#2B2622] to-[#1F1B17] p-3.5 text-left text-[#FBEFE5] shadow-[0_4px_14px_rgba(31,27,23,0.18)]"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#E8A276] to-[#B5552A] shadow-[0_2px_10px_rgba(181,85,42,0.35)]">
        <MicIcon />
      </span>
      <span className="min-w-0 flex-1 text-[12.5px] font-semibold leading-tight">
        {label}
      </span>
      <span className="shrink-0 opacity-50">
        <ChevronRightIcon />
      </span>
    </button>
  );
}

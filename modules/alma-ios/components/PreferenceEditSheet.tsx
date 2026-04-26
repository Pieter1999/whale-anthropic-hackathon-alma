"use client";

import { useEffect, useState } from "react";
import type { Preference, PreferenceDraft } from "../types";
import { PlayIcon } from "./Icons";

export type PreferenceEditTarget = {
  index: number | null;
  preference: Preference;
  isNew?: boolean;
};

function initialsFromSource(source: string) {
  return source
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function PreferenceEditSheet({
  target,
  isSaving = false,
  onClose,
  onSave,
  onMarkOutdated,
}: {
  target: PreferenceEditTarget | null;
  isSaving?: boolean;
  onClose: () => void;
  onSave: (index: number | null, draft: PreferenceDraft) => void;
  onMarkOutdated?: (index: number | null, preference: Preference) => void;
}) {
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (target) {
      const timer = setTimeout(() => {
        setName(target.preference.name);
        setTrigger(target.preference.trigger ?? "");
        setNote(target.preference.note);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [target]);

  if (!target) {
    return null;
  }

  const { preference, index, isNew } = target;
  const labelStyle =
    "mb-1.5 block font-mono text-[10.5px] font-semibold uppercase tracking-[1.2px] text-[#8A7F71]";
  const inputStyle =
    "mb-3 block w-full rounded-[10px] border border-[#DCD2C2] bg-white px-3 py-2.5 text-[15px] text-[#2B2622] outline-none transition focus:border-[#B5552A]";

  function handleSave() {
    if (isSaving) return;
    onSave(index, {
      name: name.trim() || preference.name,
      trigger: trigger.trim(),
      note: note.trim() || preference.note,
      source: index == null ? preference.source : undefined,
      date: index == null ? preference.date : undefined,
    });
  }

  return (
    <div
      className="absolute inset-0 z-[200] flex flex-col justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preference-edit-title"
    >
      <button
        type="button"
        aria-label="Close edit preference"
        className="min-h-0 flex-1 cursor-default bg-[#2B2622]/40"
        onClick={onClose}
      />
      <div className="max-h-[88%] overflow-y-auto rounded-t-[20px] border border-b-0 border-[#DCD2C2] bg-[#FFFCF7] px-5 pb-7 pt-4 shadow-[0_-8px_32px_rgba(43,38,34,0.14)]">
        <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-[#DCD2C2]" />

        <p className="mb-1 font-mono text-[10.5px] font-semibold uppercase tracking-[1.4px] text-[#8A7F71]">
          {isNew ? "New preference" : "Edit preference"}
        </p>
        <h2
          id="preference-edit-title"
          className="mb-2 font-serif text-[22px] font-normal leading-[1.2] tracking-[-0.4px] text-[#2B2622]"
        >
          {name || preference.name}
        </h2>

        {isNew ? (
          <p className="mb-3 text-[12.5px] leading-[1.5] text-[#4F4740]">
            Alma pre-filled a name, trigger, and note from your voice note. Edit
            anything before saving — it will become a new entry in the Care
            Passport.
          </p>
        ) : null}

        <label className={labelStyle} htmlFor="pref-name">
          Name
        </label>
        <input
          id="pref-name"
          className={inputStyle}
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoFocus
        />

        <label className={labelStyle} htmlFor="pref-trigger">
          Trigger
        </label>
        <input
          id="pref-trigger"
          className={inputStyle}
          value={trigger}
          onChange={(event) => setTrigger(event.target.value)}
          placeholder="When to use this"
        />

        <label className={labelStyle} htmlFor="pref-note">
          Note
        </label>
        <textarea
          id="pref-note"
          className={`${inputStyle} min-h-[110px] resize-y leading-[1.45]`}
          rows={5}
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />

        <div className="mt-3 flex items-start gap-3 rounded-[14px] border border-[#DCD2C2] bg-white px-3.5 py-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#A6B49A] font-serif text-sm font-semibold text-white">
            {initialsFromSource(preference.source)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] text-[#8A7F71]">
              {preference.source} said on {preference.date}
            </p>
            <button
              type="button"
              className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#DCD2C2] bg-[#F2EEE7] px-2.5 py-1 text-[11px] font-medium text-[#4F4740]"
            >
              <PlayIcon />
              Play voice-note · 0:18
            </button>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => {
              if (onMarkOutdated) {
                onMarkOutdated(index, preference);
              } else {
                onClose();
              }
            }}
            className="flex-1 rounded-[12px] border border-[#DCD2C2] bg-white px-3 py-2.5 text-[12.5px] font-medium text-[#4F4740] disabled:opacity-50"
          >
            Mark outdated
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="flex-1 rounded-[12px] bg-[#2B2622] px-3 py-2.5 text-[12.5px] font-semibold text-[#FBEFE5] disabled:opacity-60"
          >
            {isSaving ? "Saving…" : "Got it"}
          </button>
        </div>
      </div>
    </div>
  );
}

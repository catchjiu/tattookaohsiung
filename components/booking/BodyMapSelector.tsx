"use client";

import { useState } from "react";

const REGIONS = [
  { id: "head", label: "Head / Neck" },
  { id: "chest", label: "Chest" },
  { id: "arm-left", label: "Left Arm" },
  { id: "arm-right", label: "Right Arm" },
  { id: "stomach", label: "Stomach / Ribs" },
  { id: "back", label: "Back" },
  { id: "leg-left", label: "Left Leg" },
  { id: "leg-right", label: "Right Leg" },
  { id: "hand-left", label: "Left Hand" },
  { id: "hand-right", label: "Right Hand" },
  { id: "foot-left", label: "Left Foot" },
  { id: "foot-right", label: "Right Foot" },
] as const;

type Props = {
  value?: string[];
  onChange?: (regions: string[]) => void;
  maxSelections?: number;
};

/**
 * Sleek body map for placement selection.
 * Minimalist front-facing silhouette with clickable region chips.
 */
export function BodyMapSelector({
  value = [],
  onChange,
  maxSelections = 3,
}: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set(value));

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else if (next.size < maxSelections) {
      next.add(id);
    }
    setSelected(next);
    onChange?.(Array.from(next));
  };

  return (
    <div className="space-y-4">
      {/* Minimal body silhouette — front view */}
      <div className="relative mx-auto flex max-w-[200px] justify-center">
        <svg
          viewBox="0 0 120 240"
          className="w-full text-foreground-muted"
          aria-label="Body placement selector"
        >
          {/* Head */}
          <ellipse
            cx="60"
            cy="25"
            rx="22"
            ry="28"
            fill={selected.has("head") ? "currentColor" : "transparent"}
            fillOpacity={selected.has("head") ? 0.15 : 0}
            stroke={selected.has("head") ? "currentColor" : "currentColor"}
            strokeWidth={selected.has("head") ? 1.5 : 0.5}
            strokeOpacity={selected.has("head") ? 0.6 : 0.2}
            className="cursor-pointer transition-all duration-200 hover:fill-[currentColor] hover:fill-opacity-10"
            onClick={() => toggle("head")}
          />
          {/* Chest */}
          <path
            d="M 38 55 L 35 95 L 38 120 L 82 120 L 85 95 L 82 55 Z"
            fill={selected.has("chest") ? "currentColor" : "transparent"}
            fillOpacity={selected.has("chest") ? 0.15 : 0}
            stroke="currentColor"
            strokeWidth={selected.has("chest") ? 1 : 0.5}
            strokeOpacity={selected.has("chest") ? 0.6 : 0.2}
            className="cursor-pointer transition-all duration-200 hover:fill-[currentColor] hover:fill-opacity-10"
            onClick={() => toggle("chest")}
          />
          {/* Stomach */}
          <path
            d="M 38 120 L 35 150 L 38 150 L 82 150 L 85 150 L 82 120 Z"
            fill={selected.has("stomach") ? "currentColor" : "transparent"}
            fillOpacity={selected.has("stomach") ? 0.15 : 0}
            stroke="currentColor"
            strokeWidth={selected.has("stomach") ? 1 : 0.5}
            strokeOpacity={selected.has("stomach") ? 0.6 : 0.2}
            className="cursor-pointer transition-all duration-200 hover:fill-[currentColor] hover:fill-opacity-10"
            onClick={() => toggle("stomach")}
          />
          {/* Left arm */}
          <path
            d="M 38 60 L 15 75 L 5 120 L 8 125 L 18 85 L 35 65 Z"
            fill={selected.has("arm-left") ? "currentColor" : "transparent"}
            fillOpacity={selected.has("arm-left") ? 0.15 : 0}
            stroke="currentColor"
            strokeWidth={selected.has("arm-left") ? 1 : 0.5}
            strokeOpacity={selected.has("arm-left") ? 0.6 : 0.2}
            className="cursor-pointer transition-all duration-200 hover:fill-[currentColor] hover:fill-opacity-10"
            onClick={() => toggle("arm-left")}
          />
          {/* Right arm */}
          <path
            d="M 82 60 L 105 75 L 115 120 L 112 125 L 102 85 L 85 65 Z"
            fill={selected.has("arm-right") ? "currentColor" : "transparent"}
            fillOpacity={selected.has("arm-right") ? 0.15 : 0}
            stroke="currentColor"
            strokeWidth={selected.has("arm-right") ? 1 : 0.5}
            strokeOpacity={selected.has("arm-right") ? 0.6 : 0.2}
            className="cursor-pointer transition-all duration-200 hover:fill-[currentColor] hover:fill-opacity-10"
            onClick={() => toggle("arm-right")}
          />
          {/* Left leg */}
          <path
            d="M 38 150 L 35 180 L 32 230 L 48 230 L 50 180 L 50 150 Z"
            fill={selected.has("leg-left") ? "currentColor" : "transparent"}
            fillOpacity={selected.has("leg-left") ? 0.15 : 0}
            stroke="currentColor"
            strokeWidth={selected.has("leg-left") ? 1 : 0.5}
            strokeOpacity={selected.has("leg-left") ? 0.6 : 0.2}
            className="cursor-pointer transition-all duration-200 hover:fill-[currentColor] hover:fill-opacity-10"
            onClick={() => toggle("leg-left")}
          />
          {/* Right leg */}
          <path
            d="M 82 150 L 85 180 L 88 230 L 72 230 L 70 180 L 70 150 Z"
            fill={selected.has("leg-right") ? "currentColor" : "transparent"}
            fillOpacity={selected.has("leg-right") ? 0.15 : 0}
            stroke="currentColor"
            strokeWidth={selected.has("leg-right") ? 1 : 0.5}
            strokeOpacity={selected.has("leg-right") ? 0.6 : 0.2}
            className="cursor-pointer transition-all duration-200 hover:fill-[currentColor] hover:fill-opacity-10"
            onClick={() => toggle("leg-right")}
          />
        </svg>
      </div>

      {/* Region chips — tap to select */}
      <div className="flex flex-wrap gap-2">
        {REGIONS.map((region) => {
          const isSelected = selected.has(region.id);
          return (
            <button
              key={region.id}
              type="button"
              onClick={() => toggle(region.id)}
              className={`rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors ${
                isSelected
                  ? "border-accent bg-accent-muted text-accent"
                  : "border-border text-foreground-muted hover:border-accent/50 hover:text-accent"
              }`}
            >
              {region.label}
            </button>
          );
        })}
      </div>
      {selected.size > 0 && (
        <p className="text-xs text-foreground-muted">
          Selected:{" "}
          {Array.from(selected)
            .map((id) => REGIONS.find((r) => r.id === id)?.label)
            .join(", ")}
        </p>
      )}
    </div>
  );
}

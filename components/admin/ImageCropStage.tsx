"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

export type ImageCropStageProps = {
  imageSrc: string;
  aspect: number;
  cropShape?: "rect" | "round";
  /** Rule-of-thirds grid inside the masked area */
  showGrid?: boolean;
  objectFit?: "contain" | "horizontal-cover" | "vertical-cover" | "cover";
  /** Outer box (aspect frame + zoom slider live outside this wrapper) */
  className?: string;
  zoomMin?: number;
  zoomMax?: number;
  zoomStep?: number;
  caption?: React.ReactNode;
  zoomLabel?: string;
  zoomLabelClassName?: string;
  onCropPixelsReady: (pixels: Area | null) => void;
};

function ImageCropStageInner({
  imageSrc,
  aspect,
  cropShape = "rect",
  showGrid = true,
  objectFit = "contain",
  className = "relative h-64 w-full overflow-hidden rounded-md border border-[var(--border)] bg-[#0d0d0d]",
  zoomMin = 1,
  zoomMax = 3,
  zoomStep = 0.1,
  caption,
  zoomLabel = "Zoom",
  zoomLabelClassName = "text-xs text-[var(--muted)]",
  onCropPixelsReady,
}: ImageCropStageProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropComplete = useCallback(
    (_pc: Area, pixels: Area) => onCropPixelsReady(pixels),
    [onCropPixelsReady]
  );

  return (
    <>
      <div className={className}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          cropShape={cropShape}
          showGrid={showGrid}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          objectFit={objectFit}
          style={{ containerStyle: { backgroundColor: "#0d0d0d" } }}
        />
      </div>
      {caption ? <>{caption}</> : null}
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={zoomMin}
          max={zoomMax}
          step={zoomStep}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="flex-1"
        />
        <span className={zoomLabelClassName}>{zoomLabel}</span>
      </div>
    </>
  );
}

/** Remounted when `imageSrc` changes so crop/zoom reset without syncing through an effect */
export function ImageCropStage(props: ImageCropStageProps) {
  return <ImageCropStageInner key={props.imageSrc} {...props} />;
}

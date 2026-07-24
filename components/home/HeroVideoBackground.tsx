"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const VIDEO_SRC = "/hero.mp4";
const POSTER_SRC = "/hero-poster.jpg";

export function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion || failed) return;
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const play = video.play();
    if (play !== undefined) {
      play.catch(() => setFailed(true));
    }
  }, [reducedMotion, failed]);

  const showStatic = reducedMotion || failed;

  return (
    <div className="absolute inset-0">
      {showStatic ? (
        <Image
          src={POSTER_SRC}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={POSTER_SRC}
          preload="metadata"
          aria-hidden
          onError={() => setFailed(true)}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      )}

      {/* Dark gradient overlay for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.75), rgba(10,10,10,0.6), rgba(10,10,10,1))",
        }}
      />
    </div>
  );
}

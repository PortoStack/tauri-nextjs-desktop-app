"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { soundEffects } from "@/utils/audio";

type EmotionType = "normal" | "happy" | "scan" | "wink" | "sleep";

interface EmotionStep {
  emotion: EmotionType;
  gaze: { x: number; y: number };
  duration: number;
  onStart?: () => void;
}

// Continuous Autonomous Emotion Loop Sequence
const EMOTION_LOOP: EmotionStep[] = [
  // 1. Normal Caring State - Centered Gaze
  {
    emotion: "normal",
    gaze: { x: 0, y: 0 },
    duration: 5000,
  },
  // 2. Attentive Left Glance
  {
    emotion: "normal",
    gaze: { x: -35, y: -8 },
    duration: 3200,
  },
  // 3. Medical Vitals Diagnostic Scan
  {
    emotion: "scan",
    gaze: { x: 0, y: 0 },
    duration: 4200,
    onStart: () => soundEffects.playScanSweep(),
  },
  // 4. Happy Joyful Smile - Warm Gaze
  {
    emotion: "happy",
    gaze: { x: 28, y: -6 },
    duration: 4500,
    onStart: () => soundEffects.playHappyChime(),
  },
  // 5. Normal Calm Caring State
  {
    emotion: "normal",
    gaze: { x: 0, y: 0 },
    duration: 3500,
  },
  // 6. Playful Nurse Wink
  {
    emotion: "wink",
    gaze: { x: 0, y: 0 },
    duration: 3200,
    onStart: () => soundEffects.playBoop(180),
  },
  // 7. Standby Rest Mode
  {
    emotion: "sleep",
    gaze: { x: 0, y: 0 },
    duration: 4000,
  },
];

export default function NurseRobotFace() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);

  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentStep = EMOTION_LOOP[currentStepIndex];
  const expression = currentStep.emotion;
  const eyeOffset = currentStep.gaze;

  // 1. Continuous Hands-Free Emotion Loop
  useEffect(() => {
    if (currentStep.onStart) {
      currentStep.onStart();
    }

    stepTimerRef.current = setTimeout(() => {
      setCurrentStepIndex((prev) => (prev + 1) % EMOTION_LOOP.length);
    }, currentStep.duration);

    return () => {
      if (stepTimerRef.current) {
        clearTimeout(stepTimerRef.current);
      }
    };
  }, [currentStepIndex, currentStep]);

  // 2. Natural Organic Blinking (Active during awake states)
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (expression === "sleep") return;
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 160);
    }, 3800);

    return () => clearInterval(blinkInterval);
  }, [expression]);

  // 3. Touch Screen Handler -> Navigates to Home Page
  const handleTouchScreen = () => {
    soundEffects.playBoop(240);
    router.push("/home");
  };

  const isHappy = expression === "happy";
  const isWink = expression === "wink";
  const isScan = expression === "scan";
  const isSleep = expression === "sleep";

  // Pure CSS box-shadows & gradients for eye illumination
  const eyeColorStyle = isScan
    ? {
        boxShadow:
          "0 0 50px rgba(16, 185, 129, 0.85), 0 0 100px rgba(16, 185, 129, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.55)",
        background:
          "radial-gradient(circle at 45% 40%, #a7f3d0 0%, #10b981 50%, #047857 100%)",
      }
    : isHappy || isWink
      ? {
          boxShadow:
            "0 0 50px rgba(244, 114, 182, 0.85), 0 0 100px rgba(244, 114, 182, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.55)",
          background:
            "radial-gradient(circle at 45% 40%, #fce7f3 0%, #f472b6 50%, #be185d 100%)",
        }
      : {
          boxShadow:
            "0 0 50px rgba(6, 182, 212, 0.85), 0 0 100px rgba(6, 182, 212, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.65)",
          background:
            "radial-gradient(circle at 45% 40%, #cffafe 0%, #06b6d4 50%, #0e7490 100%)",
        };

  return (
    <div
      onClick={handleTouchScreen}
      onTouchStart={handleTouchScreen}
      className="fixed inset-0 w-screen h-screen bg-black overflow-hidden flex items-center justify-center select-none cursor-pointer relative"
    >
      {/* Laser Scanning Line for 'scan' emotion */}
      {isScan && (
        <div className="absolute inset-x-0 h-1 bg-emerald-400 shadow-[0_0_30px_#10b981] animate-laser-sweep pointer-events-none z-50" />
      )}

      {/* CENTERED EXPANDED ROBOT EYES ONLY (NO MOUTH) */}
      <div className="relative z-10 flex items-center justify-center gap-12 sm:gap-24 md:gap-36 lg:gap-44 w-full max-w-7xl px-4 pointer-events-none my-auto">
        {/* LEFT EYE (EXPANDED SCALE) */}
        <div className="relative flex items-center justify-center w-40 sm:w-60 md:w-76 lg:w-92 h-56 sm:h-76 md:h-[360px] lg:h-[430px]">
          {isSleep ? (
            /* Sleeping Eye */
            <div
              className="w-full h-6 sm:h-8 md:h-10 border-b-[8px] sm:border-b-[12px] md:border-b-[16px] border-cyan-400 rounded-b-full transition-all duration-500"
              style={{
                filter: "drop-shadow(0 0 16px rgba(6, 182, 212, 0.95))",
              }}
            />
          ) : isHappy ? (
            /* Happy Eye */
            <div
              className="w-full h-28 sm:h-44 md:h-56 lg:h-64 border-t-[16px] sm:border-t-[24px] md:border-t-[32px] border-pink-400 rounded-t-full transition-all duration-500"
              style={{
                filter:
                  "drop-shadow(0 0 20px rgba(244, 114, 182, 0.95)) drop-shadow(0 0 40px rgba(244, 114, 182, 0.5))",
              }}
            />
          ) : isWink ? (
            /* Wink Eye */
            <div
              className="w-full h-6 sm:h-8 md:h-10 border-b-[9px] sm:border-b-[14px] md:border-b-[18px] border-pink-400 rounded-b-full transition-all duration-500"
              style={{
                filter: "drop-shadow(0 0 16px rgba(244, 114, 182, 0.95))",
              }}
            />
          ) : (
            /* Normal / Scan Eye */
            <div
              className="w-full h-full rounded-[55px] sm:rounded-[80px] md:rounded-[110px] lg:rounded-[130px] p-3.5 sm:p-5 md:p-6 flex items-center justify-center transition-all duration-500 ease-out"
              style={{
                ...eyeColorStyle,
                transform: isBlinking ? "scaleY(0.04)" : "scaleY(1)",
                transformOrigin: "center",
              }}
            >
              {/* Eye Catchlight Glints */}
              <div
                className="relative w-full h-full rounded-[45px] sm:rounded-[70px] md:rounded-[95px] lg:rounded-[115px] overflow-hidden flex items-center justify-center transition-transform duration-700 ease-out"
                style={{
                  transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                }}
              >
                {/* Primary Catchlight Glint (Top-Left) */}
                <div className="absolute top-3.5 left-3.5 sm:top-6 sm:left-6 md:top-8 md:left-8 w-8 sm:w-14 md:w-18 lg:w-22 h-12 sm:h-20 md:h-26 lg:h-32 bg-white rounded-full opacity-95 shadow-[0_0_16px_rgba(255,255,255,0.95)] transform -rotate-15 pointer-events-none" />

                {/* Secondary Catchlight Glint (Bottom-Right) */}
                <div className="absolute bottom-4 right-4 sm:bottom-7 sm:right-7 md:bottom-9 md:right-9 w-4 sm:w-7 md:w-9 lg:w-11 h-4 sm:h-7 md:h-9 lg:h-11 bg-white/90 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.85)] pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT EYE (EXPANDED SCALE) */}
        <div className="relative flex items-center justify-center w-40 sm:w-60 md:w-76 lg:w-92 h-56 sm:h-76 md:h-[360px] lg:h-[430px]">
          {isSleep ? (
            <div
              className="w-full h-6 sm:h-8 md:h-10 border-b-[8px] sm:border-b-[12px] md:border-b-[16px] border-cyan-400 rounded-b-full transition-all duration-500"
              style={{
                filter: "drop-shadow(0 0 16px rgba(6, 182, 212, 0.95))",
              }}
            />
          ) : isHappy ? (
            <div
              className="w-full h-28 sm:h-44 md:h-56 lg:h-64 border-t-[16px] sm:border-t-[24px] md:border-t-[32px] border-pink-400 rounded-t-full transition-all duration-500"
              style={{
                filter:
                  "drop-shadow(0 0 20px rgba(244, 114, 182, 0.95)) drop-shadow(0 0 40px rgba(244, 114, 182, 0.5))",
              }}
            />
          ) : (
            /* Open Eye in Normal, Scan, and Wink */
            <div
              className="w-full h-full rounded-[55px] sm:rounded-[80px] md:rounded-[110px] lg:rounded-[130px] p-3.5 sm:p-5 md:p-6 flex items-center justify-center transition-all duration-500 ease-out"
              style={{
                ...eyeColorStyle,
                transform: isBlinking ? "scaleY(0.04)" : "scaleY(1)",
                transformOrigin: "center",
              }}
            >
              <div
                className="relative w-full h-full rounded-[45px] sm:rounded-[70px] md:rounded-[95px] lg:rounded-[115px] overflow-hidden flex items-center justify-center transition-transform duration-700 ease-out"
                style={{
                  transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                }}
              >
                {/* Primary Catchlight Glint */}
                <div className="absolute top-3.5 left-3.5 sm:top-6 sm:left-6 md:top-8 md:left-8 w-8 sm:w-14 md:w-18 lg:w-22 h-12 sm:h-20 md:h-26 lg:h-32 bg-white rounded-full opacity-95 shadow-[0_0_16px_rgba(255,255,255,0.95)] transform -rotate-15 pointer-events-none" />

                {/* Secondary Catchlight Glint */}
                <div className="absolute bottom-4 right-4 sm:bottom-7 sm:right-7 md:bottom-9 md:right-9 w-4 sm:w-7 md:w-9 lg:w-11 h-4 sm:h-7 md:h-9 lg:h-11 bg-white/90 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.85)] pointer-events-none" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

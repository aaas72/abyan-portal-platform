"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { subtleMicroHover } from "@/lib/animations";
import { CultureService } from "@/services/culture.service";

import { AudioTrack } from "@/types/schemas";

interface FolkAudioPlayerProps {
  activeTrack?: AudioTrack;
  tracks?: AudioTrack[];
  compact?: boolean;
}

export default function FolkAudioPlayer({ activeTrack, tracks, compact = false }: FolkAudioPlayerProps) {
  const defaultTracks: AudioTrack[] = CultureService.getFolkAudioTracks();

  const playlist = tracks && tracks.length > 0 ? tracks : defaultTracks;
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioHtmlRef = useRef<HTMLAudioElement | null>(null);

  // Synchronize when activeTrack is explicitly passed from activeTab!
  useEffect(() => {
    if (activeTrack) {
      const foundIdx = playlist.findIndex((t) => t.id === activeTrack.id);
      if (foundIdx !== -1) {
        setCurrentTrackIndex(foundIdx);
      }
      stopPlayback();
    }
  }, [activeTrack, playlist]);

  const currentTrack = activeTrack || playlist[currentTrackIndex];

  // Stop sound synthesizer and HTML audio
  const stopPlayback = () => {
    setIsPlaying(false);
    setProgress(0);
    if (soundTimerRef.current) {
      clearInterval(soundTimerRef.current);
      soundTimerRef.current = null;
    }
    if (audioHtmlRef.current) {
      audioHtmlRef.current.pause();
    }
  };

  // Play synthetic oriental pentatonic folk notes for web audio demonstration on mobile & desktop
  const playFolkMelodyNote = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }

      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Oriental Folk Pentatonic scale frequencies (Hz)
      const pentatonicScale = [220.0, 261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
      const randomNote = pentatonicScale[Math.floor(Math.random() * pentatonicScale.length)];

      osc.type = "sine";
      osc.frequency.setValueAtTime(randomNote, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Graceful fallback if Web Audio is blocked
    }
  };

  // Simulated progress and web audio timer loop
  useEffect(() => {
    let progressTimer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            stopPlayback();
            return 0;
          }
          return prev + 1;
        });

        // Trigger gentle melody note pulse every 400ms
        playFolkMelodyNote();
      }, 300);
    }

    return () => {
      if (progressTimer) clearInterval(progressTimer);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      // Resume or start Web Audio context on user gesture (iOS Safari requirement)
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      if (currentTrack.audioUrl && audioHtmlRef.current) {
        audioHtmlRef.current.play().catch(() => {});
      }

      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    stopPlayback();
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  const handlePrev = () => {
    stopPlayback();
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  return (
    <div className="w-full text-right cursor-default select-none">
      {/* HTML5 Audio Fallback */}
      {currentTrack.audioUrl && (
        <audio ref={audioHtmlRef} src={currentTrack.audioUrl} preload="auto" />
      )}

      {/* CARD CONTAINER - STRICT NO BORDERS NO SHADOWS SOLID GRADIENT */}
      <div className="bg-gradient-to-br from-emerald-100 via-white to-sky-100 border-none shadow-none p-4 sm:p-6 text-right space-y-3.5 rounded-2xl w-full">
        {/* Header Title & Category */}
        <div className="flex justify-between items-center gap-2">
          <span className="text-xs font-normal text-[#10b981] font-abyan-title truncate">
            المقطوعة المرفقة: {currentTrack.category}
          </span>
          <span className="text-xs font-normal text-slate-500 font-abyan-title shrink-0">
            {currentTrack.duration}
          </span>
        </div>

        {/* Track Title & Artist */}
        <div className="space-y-1">
          <h3 className="font-abyan-title text-sm sm:text-base lg:text-lg text-slate-900 font-normal leading-snug">
            {currentTrack.title}
          </h3>
          <p className="text-xs text-slate-600 font-abyan-body font-normal">
            {currentTrack.artist}
          </p>
        </div>

        {/* Lyrics Excerpt Prompt */}
        {currentTrack.lyricsExcerpt && (
          <p className="text-xs text-sky-600 font-abyan-body font-normal leading-relaxed pt-0.5">
            « {currentTrack.lyricsExcerpt} »
          </p>
        )}

        {/* Progress Bar */}
        <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-sky-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Audio Controls - Touch & Audio Compatible for Mobile & Desktop */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 w-full">
          
          {/* Action Buttons Row */}
          <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 w-full sm:w-auto">
            <motion.button
              onClick={handlePrev}
              {...subtleMicroHover}
              className="text-xs text-slate-600 hover:text-slate-900 font-abyan-title bg-transparent border-none shadow-none cursor-pointer px-2 py-1 whitespace-nowrap"
            >
              المقطوعة السابقة
            </motion.button>

            <motion.button
              onClick={togglePlay}
              {...subtleMicroHover}
              className={`text-xs font-medium text-white px-4 sm:px-5 py-2 rounded-full border-none shadow-none cursor-pointer transition-colors font-abyan-title whitespace-nowrap shrink-0 ${
                isPlaying ? "bg-emerald-600 hover:bg-emerald-700" : "bg-sky-600 hover:bg-sky-700"
              }`}
            >
              {isPlaying ? "إيقاف مؤقت ❚❚" : "استماع للألحان ▶"}
            </motion.button>

            <motion.button
              onClick={handleNext}
              {...subtleMicroHover}
              className="text-xs text-slate-600 hover:text-slate-900 font-abyan-title bg-transparent border-none cursor-pointer px-2 py-1 whitespace-nowrap"
            >
              المقطوعة التالية
            </motion.button>
          </div>

          {/* Subtitle Info Tag */}
          <span className="text-[11px] text-slate-400 font-abyan-title font-normal text-center sm:text-left w-full sm:w-auto truncate">
            استكشاف ألحان الشفاهيات والتراث
          </span>

        </div>
      </div>
    </div>
  );
}

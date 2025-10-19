// src/lib/ffmpeg.ts
import { FFmpeg, LogEvent } from "@ffmpeg/ffmpeg";

let ffmpegPromise: Promise<FFmpeg> | null = null;

const load = async (logger?: (log: LogEvent) => void): Promise<FFmpeg> => {
  const ffmpeg = new FFmpeg();
  if (logger) {
    ffmpeg.on("log", logger);
  }
  // Use direct paths to the files in your /public directory
  await ffmpeg.load({
    coreURL: "/ffmpeg-core.js",
    wasmURL: "/ffmpeg-core.wasm",
  });
  return ffmpeg;
};

export function getFFmpeg(logger?: (log: LogEvent) => void): Promise<FFmpeg> {
  if (!ffmpegPromise) {
    ffmpegPromise = load(logger);
  }
  return ffmpegPromise;
}

// src/components/home/hero.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LucideArrowRight, LucidePlay, LucideLoader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Uploader } from "./uploader"; // Import the client component
import Image from "next/image";

function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.onerror = (err) => {
      reject("Error loading video metadata.");
    };
    video.src = URL.createObjectURL(file);
  });
}

const Hero = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const MAX_DURATION = 150;

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please select a video file.");
      setSelectedFile(null);
      return;
    }

    setIsLoading(true);
    setSelectedFile(file); // Show file in UI while checking

    try {
      const duration = await getVideoDuration(file);

      if (duration > MAX_DURATION) {
        alert(
          `Video is too long (${Math.round(
            duration
          )}s). Please upload a file under 2.5 minutes (150s).`
        );
        setSelectedFile(null);
        setIsLoading(false);
        return;
      }

      // Success! Navigate to editor
      const videoUrl = URL.createObjectURL(file);
      router.push(`/edit?videoSrc=${encodeURIComponent(videoUrl)}`);
      // No need to setIsLoading(false) because we are navigating away
    } catch (error) {
      console.error(error);
      alert("Could not read video metadata. Please try another file.");
      setSelectedFile(null);
      setIsLoading(false);
    }
  };

  const handleStartEditing = async () => {
    if (isLoading) return; // Don't do anything if already loading

    if (selectedFile) {
      setIsLoading(true);
      try {
        const duration = await getVideoDuration(selectedFile);

        if (duration > MAX_DURATION) {
          alert(
            `Video is too long (${Math.round(
              duration
            )}s). Please upload a file under 2.5 minutes (150s).`
          );
          setSelectedFile(null);
          setIsLoading(false);
          return;
        }

        // Success! Navigate to editor
        const videoUrl = URL.createObjectURL(selectedFile);
        router.push(`/edit?videoSrc=${encodeURIComponent(videoUrl)}`);
      } catch (error) {
        console.error(error);
        alert("Could not read video metadata. Please try another file.");
        setSelectedFile(null);
        setIsLoading(false);
      }
    } else {
      // No file selected, just go to the empty editor
      router.push(`/edit`);
    }
  };

  return (
    <section className="pt-20 pb-16-gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="leading-[1.2] pt-8 pb-4 mb-8 space-y-2 text-4xl font-bold tracking-tight md:text-6xl text-gray-900">
            Your Creative Vision Without the
            <span className="block gradient-text">Complexity</span>
          </h1>
          <p className="text-xl text-gray-600 pt-8 mb-8 max-w-3xl mx-auto">
            Effortlessly videos to life with our intuitive online editor,
            designed for creators of all levels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              className="px-8 py-4 text-lg font-smibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
              onClick={handleStartEditing}
              disabled={isLoading}
            >
              {isLoading && selectedFile ? (
                <LucideLoader2 className="w-8 h-8 mr-2 animate-spin" />
              ) : (
                <LucideArrowRight className="w-8 h-8" />
              )}
              <span>
                {isLoading && selectedFile ? "Checking..." : "Start Editing"}
              </span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <LucidePlay className="w-8 h-8" />
              <span>Tutorial</span>
            </Button>
          </div>
          <div className="relative flex max-w-7xl mx-auto">
            <div className="bg-gray-900 rounded-xl p-2 shadow-2xl w-1/2">
              <Uploader
                selectedFile={selectedFile}
                onFileChange={handleFileChange}
                disabled={isLoading}
              />
            </div>
            <div className="bg-gray-900 rounded-xl p-2 shadow-2xl w-1/2 overflow-hidden relative">
              <Image
                src="/hero-showcase.png"
                alt="Video editor app showcase"
                fill
                className="w-full h-full object-cover rounded-md"
                priority
              />
            </div>

            <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Live Preview
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

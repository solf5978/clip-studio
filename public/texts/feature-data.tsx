import {
  LucideCloud,
  LucidePalette,
  LucideScissors,
  LucideShare,
  LucideVideo,
  LucideZap,
} from "lucide-react";
import React from "react";

type FeatureFormat = {
  icon: React.ReactNode;
  featureTitle: string;
  featureDescription: string;
};

export const featuresData: FeatureFormat[] = [
  {
    icon: <LucideCloud className="w-8 h-8" />,
    featureTitle: "Cloud Storage",
    featureDescription:
      "Access your projects anywhere. Automatic saves and unlimited cloud storage for all your creations.",
  },
  {
    icon: <LucidePalette className="w-8 h-8" />,
    featureTitle: "Visual Effects",
    featureDescription:
      "Add stunning transitions, filters, and effects to make your videos stand out from the crowd.",
  },
  {
    icon: <LucideScissors className="w-8 h-8" />,
    featureTitle: "Precision Editing",
    featureDescription:
      "Cut, trim, and splice your videos with frame-perfect accuracy using our advanced timeline editor.",
  },
  {
    icon: <LucideShare className="w-8 h-8" />,
    featureTitle: "Easy Sharing",
    featureDescription:
      "Export in any format and share directly to social media platforms with optimized settings.",
  },
  {
    icon: <LucideVideo className="w-8 h-8" />,
    featureTitle: "Video Tools",
    featureDescription:
      "Professional video editing without suffering from quality reduction, confusing mixing, and watermarking.",
  },
  {
    icon: <LucideZap className="w-8 h-8" />,
    featureTitle: "Lightning Fast",
    featureDescription:
      "Render videos in seconds, not hours. Our cloud-powered engine delivers professional results instantly.",
  },
];

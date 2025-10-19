import React from "react";
import { Upload, Edit, Download } from "lucide-react";

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  step: number;
}

const steps: Step[] = [
  {
    icon: <Upload className="w-8 h-8" />,
    title: "Upload Your Videos",
    description:
      "Drag and drop your video files or import from cloud storage. Supports all major formats.",
    step: 1,
  },
  {
    icon: <Edit className="w-8 h-8" />,
    title: "Edit Like a Pro",
    description:
      "Use our intuitive timeline editor to cut, trim, add effects, and perfect your story.",
    step: 2,
  },
  {
    icon: <Download className="w-8 h-8" />,
    title: "Export & Share",
    description:
      "Render in HD quality and share directly to social media or download to your device.",
    step: 3,
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started in minutes with our simple three-step process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-8">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {step.step}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
            Try It Now - Free
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

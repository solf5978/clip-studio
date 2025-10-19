type PricingPlan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonStyle: string;
};

export const plansData: PricingPlan[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Up to 5 projects",
      "720p export quality",
      "Basic editing tools",
      "1GB cloud storage",
      "Community support",
    ],
    buttonText: "Get Started",
    buttonStyle: "border border-gray-300 text-gray-700 hover:bg-gray-50",
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For content creators and professionals",
    features: [
      "Unlimited projects",
      "4K export quality",
      "Advanced editing tools",
      "100GB cloud storage",
      "Premium effects library",
      "Priority support",
      "Collaboration tools",
    ],
    popular: true,
    buttonText: "Start Free Trial",
    buttonStyle: "bg-blue-600 text-white hover:bg-blue-700",
  },
  {
    name: "Team",
    price: "$49",
    period: "per month",
    description: "For teams and agencies",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Brand kit & templates",
      "500GB cloud storage",
      "Advanced analytics",
      "Custom integrations",
      "Dedicated support",
    ],
    buttonText: "Contact Sales",
    buttonStyle: "border border-gray-300 text-gray-700 hover:bg-gray-50",
  },
];

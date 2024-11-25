"use client";

import { Zap, Code, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

type Feature = {
  icon: JSX.Element;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: <Zap className="h-10 w-10 text-cyan-500" />,
    title: "Smart Bookmarking",
    description:
      "Automatically organize and categorize your visited websites and resources.",
  },
  {
    icon: <Code className="h-10 w-10 text-cyan-500" />,
    title: "Open Source",
    description:
      "Fully open-source, allowing community contributions and transparency.",
  },
  {
    icon: <Users className="h-10 w-10 text-cyan-500" />,
    title: "Collaborative",
    description:
      "Share and collaborate on digital trails with your team or community.",
  },
];

const FeatureCard = ({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={cardVariants}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="relative overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800"
    >
      <div className="p-6">
        <div className="mb-4 inline-block rounded-full bg-cyan-100 p-3 dark:bg-cyan-900">
          {feature.icon}
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
          {feature.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          {feature.description}
        </p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
    </motion.div>
  );
};

export const FeatureCards = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature, index) => (
        <FeatureCard key={index} feature={feature} index={index} />
      ))}
    </div>
  );
};

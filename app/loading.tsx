"use client"
import React from "react";
import { motion } from "framer-motion";

interface LoadingProps {
  text?: string; // Optional prop for text message
}

const Loading: React.FC<LoadingProps> = ({ text}) => {
  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated Image */}
      <motion.img
        src={'/assets/logo.svg'}
        alt="Loading"
        className="w-24 h-24"
        initial={{ scale: 1 }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
        }}
      />

      {/* Optional Text */}
      {text && (
        <p className="text-white text-sm mt-4 text-center">{text}</p>
      )}
    </motion.div>
  );
};

export default Loading;

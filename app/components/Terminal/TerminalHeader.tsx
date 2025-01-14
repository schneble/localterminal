import React from 'react';
import { motion } from 'framer-motion';

export const TerminalHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between mb-4 p-3">
      <div className="flex space-x-2">
        {["bg-red-500", "bg-yellow-500", "bg-green-500"].map((color, i) => (
          <motion.div
            key={i}
            className={`w-3 h-3 rounded-full ${color}/90 hover:${color}/100 transition-transform`}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>
      <span className="text-zinc-400 text-sm hidden sm:inline">⌘</span>
    </div>
  );
};

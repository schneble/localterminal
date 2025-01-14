import React from 'react';
// import { motion } from 'framer-motion';

export const TerminalHeader: React.FC = () => {
  return (
    <div className="flex  items-center justify-between mb-4 p-2">
      <div className="flex  space-x-3">
      {/* <div className="w-2.5 h-2.5 rounded-full bg-black/50 ring-1 ring-red-800/90 hover:bg-red-600 transition-colors" />
          <div className="w-2.5 h-2.5 rounded-full bg-black/50 ring-1 ring-yellow-800/90 hover:bg-yellow-600 transition-colors" />
          <div className="w-2.5 h-2.5 rounded-full bg-black/50 hover:bg-green-600 ring-1 ring-green-800/90 transition-colors" /> */}
      </div>
      <span className="text-surf7 text-sm  ">⌘</span>
    </div>
  );
};

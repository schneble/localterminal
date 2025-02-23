import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { EditorState } from './types';

interface EditorProps {
  editor: EditorState;
  setEditor: React.Dispatch<React.SetStateAction<EditorState>>;
  handleCloseEditor: () => void;
  handleSaveFile: () => void;
  editorRef: React.RefObject<HTMLTextAreaElement | null>;
}

export const Editor: React.FC<EditorProps> = ({
  editor,
  setEditor,
  handleCloseEditor,
  handleSaveFile,
  editorRef
}) => {
  return (
    <motion.div
      className="absolute inset-0 bg-zinc-900/95 backdrop-blur-md z-20 p-3 flex flex-col rounded-lg shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-zinc-300 font-medium">
          Editing: <span className="text-emerald-400">{editor.filePath}</span>
        </span>
        <button
          onClick={handleCloseEditor}
          className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-full"
        >
          <X size={12} />
        </button>
      </div>
      <textarea
        ref={editorRef}
        value={editor.content}
        onChange={(e) =>
          setEditor((prev) => ({ ...prev, content: e.target.value }))
        }
        className="flex-1 bg-surface950/40 text-zinc-100 p-4 rounded-lg resize-none outline-none  focus:ring-1 focus:ring-sky-100/20 transition"
        autoFocus
      />
      <div className="flex justify-end mt-3.5 space-x-3">
        <button
          onClick={handleCloseEditor}
          className="px-4 py-2 rounded-md bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveFile}
          className="px-4 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition"
        >
          Save
        </button>
      </div>
    </motion.div>
  );
};

'use client'
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CommandHistory, EditorState } from './types';
import { createCommands } from './commands';
import { Editor } from './Editor';
import { TerminalHeader } from './TerminalHeader';
import { useFileSystem } from './useFileSystem';

const Terminal = () => {
  // State management
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [currentPath, setCurrentPath] = useState('/home/user');
  const [editor, setEditor] = useState<EditorState>({
    isOpen: false,
    filePath: '',
    content: '',
  });

  // Hook for file system
  const [fileSystem, setFileSystem] = useFileSystem();

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Initialize commands
  const commands = createCommands(
    setFileSystem,
    fileSystem,
    currentPath,
    setCurrentPath,
    setEditor
  );

  // Command execution handler
  const executeCommand = async (cmd: string) => {
    const [command, ...args] = cmd.trim().split(' ');
    const timestamp = new Date().toLocaleTimeString();

    if (!commands[command as keyof typeof commands]) {
      return setHistory(prev => [...prev, {
        command: cmd,
        output: `Command not found: ${command}`,
        timestamp
      }]);
    }

    try {
      const output = await commands[command as keyof typeof commands](args);
      if (output !== null) {
        setHistory(prev => [...prev, { command: cmd, output, timestamp }]);
      }
    } catch (error) {
      setHistory(prev => [...prev, {
        command: cmd,
        output: `Error executing command: ${error}`,
        timestamp
      }]);
    }
  };

  // Event handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    executeCommand(input);
    setInput('');
  };

  const handleSaveFile = () => {
    setFileSystem(prev => ({
      ...prev,
      [editor.filePath]: {
        ...prev[editor.filePath],
        content: editor.content,
        size: editor.content.length,
        lastModified: new Date().toISOString()
      }
    }));
    setEditor({ isOpen: false, filePath: '', content: '' });
    inputRef.current?.focus();
  };

  const handleCloseEditor = () => {
    setEditor({ isOpen: false, filePath: '', content: '' });
    inputRef.current?.focus();
  };

  // Effects
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="w-full h-svh bg-black p-o lg:p-6 font-mono text-sm">
      <motion.div
        className="rounded-xl h-full p-1.5 mb-2 overflow-hidden flex flex-col shadow-terminal-shadow discovery a-border"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <TerminalHeader />

        <AnimatePresence>
          {editor.isOpen && (
            <Editor
              editor={editor}
              setEditor={setEditor}
              handleCloseEditor={handleCloseEditor}
              handleSaveFile={handleSaveFile}
              editorRef={editorRef}
            />
          )}
        </AnimatePresence>

        {/* Terminal Content */}
        <div
          ref={terminalRef}
          className="flex-1 overflow-y-auto overscroll-x-none text-zinc-200 px-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800"
        >
          {history.map((entry, i) => (
            <motion.div
              key={i}
              className="space-y-1 group"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-zinc-500 text-xs">{entry.timestamp}</span>
                <span className="text-emerald-400">{currentPath}</span>
                <span className="text-blue-400">$</span>
                <span className="text-white">{entry.command}</span>
              </div>
              <div className="pl-4 text-zinc-500">{entry.output}</div>
            </motion.div>
          ))}
        </div>

        {/* Command Input */}
        <form onSubmit={handleSubmit} className="flex mb-2 items-center space-x-3 mt-4">
          <span className="text-emerald-500 subpixel-antialiased px-1.5 py-1 bg-surface900/20 rounded-full">
            {currentPath}
          </span>
          <span className="text-blue-400">$</span>
          <motion.input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-x400 focus:text-white placeholder:text-zinc-500 transition  "
            placeholder="Type a command..."
            autoFocus
            whileFocus={{ scale: 1.02 }}
          />
        </form>
      </motion.div>
    </div>
  );
};

export default Terminal;

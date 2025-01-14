import { useState, useEffect } from 'react';
import { FileSystem } from './types';

export const useFileSystem = () => {
  const [fileSystem, setFileSystem] = useState<FileSystem>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('terminalFS');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return {
      '/home/user': { type: 'directory' },
      '/home/user/documents': { type: 'directory' },
      '/home/user/documents/notes.txt': {
        type: 'file',
        content: 'Welcome to the terminal!\nUse "edit <filename>" to edit files.',
        size: 21,
        lastModified: new Date().toISOString()
      }
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('terminalFS', JSON.stringify(fileSystem));
    }
  }, [fileSystem]);

  return [fileSystem, setFileSystem] as const;
};

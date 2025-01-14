import React from 'react';
import { FileSystem, EditorState } from './types';

type SetFileSystem = React.Dispatch<React.SetStateAction<FileSystem>>;
type SetEditor = React.Dispatch<React.SetStateAction<EditorState>>;
type CommandResult = React.ReactNode | Promise<React.ReactNode> | null;
type CommandFunction = (args: string[]) => CommandResult;

interface Commands {
  [key: string]: CommandFunction;
}

export const createCommands = (
  setFileSystem: SetFileSystem,
  fileSystem: FileSystem,
  currentPath: string,
  setCurrentPath: (path: string) => void,
  setEditor: SetEditor,
  terminalContent: string[],
  setTerminalContent: React.Dispatch<React.SetStateAction<string[]>>
): Commands => {
  const commands: Commands = {
    help: () => (
      <div className="text-gray-300">
        Available commands:
        <br />
        - help: Show this help message
        <br />
        - clear: Clear terminal
        <br />
        - echo [text]: Display text
        <br />
        - ls: List directory contents
        <br />
        - cd [path]: Change directory
        <br />
        - cat [file]: Display file contents
        <br />
        - touch [file]: Create new file
        <br />
        - mkdir [dir]: Create new directory
        <br />
        - rm [file/dir]: Remove file or directory
        <br />
        - edit [file]: Edit file contents
        <br />
        - weather [city]: Get weather info
        <br />
        - calc [expression]: Calculate expression
      </div>
    ),

    clear: () => {
      setTerminalContent([]); // Clear all terminal output
      return null; // No output for the 'clear' command
    },

    echo: (args: string[]) => args.join(' '),

    ls: () => {
      const currentDirContent = Object.entries(fileSystem)
        .filter(([path]) => {
          const pathParts = path.split('/');
          const currentParts = currentPath.split('/');
          return path.startsWith(currentPath) &&
            path !== currentPath &&
            pathParts.length === currentParts.length + 1;
        })
        .map(([path]) => {
          const name = path.split('/').pop() || '';
          const isDir = fileSystem[path].type === 'directory';
          return (
            <span key={path} className={`${isDir ? 'text-blue-400' : 'text-gray-300'}`}>
              {name}{isDir ? '/' : ''}
            </span>
          );
        });

      return (
        <div className="grid grid-cols-4 gap-4">
          {currentDirContent}
        </div>
      );
    },

    cd: (args: string[]) => {
      const newPath = args[0];
      if (!newPath) return 'Please specify a directory';

      let fullPath = newPath.startsWith('/')
        ? newPath
        : `${currentPath}/${newPath}`;

      // Handle going up one directory
      if (newPath === '..') {
        const parts = currentPath.split('/');
        parts.pop();
        fullPath = parts.join('/') || '/';
      }

      if (fileSystem[fullPath]?.type === 'directory') {
        setCurrentPath(fullPath);
        return `Changed directory to ${fullPath}`;
      }
      return 'Directory not found';
    },

    cat: (args: string[]) => {
      const fileName = args[0];
      if (!fileName) return 'Please specify a file';

      const fullPath = `${currentPath}/${fileName}`;
      if (fileSystem[fullPath]?.type === 'file') {
        return <pre className="whitespace-pre-wrap">{fileSystem[fullPath].content}</pre>;
      }
      return 'File not found';
    },

    touch: (args: string[]) => {
      const fileName = args[0];
      if (!fileName) return 'Please specify a file name';

      const fullPath = `${currentPath}/${fileName}`;
      setFileSystem(prev => ({
        ...prev,
        [fullPath]: {
          type: 'file',
          content: '',
          size: 0,
          lastModified: new Date().toISOString(),
        },
      }));
      return `Created file: ${fileName}`;
    },

    mkdir: (args: string[]) => {
      const dirName = args[0];
      if (!dirName) return 'Please specify a directory name';

      const fullPath = `${currentPath}/${dirName}`;
      if (fileSystem[fullPath]) {
        return `Error: ${dirName} already exists`;
      }

      setFileSystem(prev => ({
        ...prev,
        [fullPath]: {
          type: 'directory',
        },
      }));
      return `Created directory: ${dirName}`;
    },

    rm: (args: string[]) => {
      const name = args[0];
      if (!name) return 'Please specify a file or directory name';

      const fullPath = `${currentPath}/${name}`;
      if (!fileSystem[fullPath]) {
        return `Error: ${name} does not exist`;
      }

      setFileSystem(prev => {
        const newFS = { ...prev };
        delete newFS[fullPath];
        // Remove all contents if directory
        if (prev[fullPath].type === 'directory') {
          Object.keys(newFS).forEach(path => {
            if (path.startsWith(fullPath + '/')) {
              delete newFS[path];
            }
          });
        }
        return newFS;
      });
      return `Removed ${name}`;
    },

    edit: (args: string[]) => {
      const fileName = args[0];
      if (!fileName) return 'Please specify a file name';

      const fullPath = `${currentPath}/${fileName}`;
      const file = fileSystem[fullPath];

      if (!file || file.type !== 'file') {
        return 'File not found';
      }

      setEditor({
        isOpen: true,
        filePath: fullPath,
        content: file.content || '',
      });

      return 'Opening editor...';
    },

    weather: async (args: string[]) => {
      const city = args.join(' ');
      if (!city) return 'Please specify a city';

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return `Weather in ${city}: 22°C, Partly Cloudy`;
    },

    calc: (args: string[]) => {
      const expr = args.join('');
      try {
        const result = Function('"use strict";return (' + expr + ')')();
        return `${expr} = ${result}`;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        return 'Invalid expression';
      }
    },
  };

  return commands;
};

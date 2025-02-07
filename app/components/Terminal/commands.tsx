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
        <strong>Available commands:</strong>
        <br />
        <strong>help</strong>: Show this help message
        <br />
        <strong>clear</strong>: Clear terminal
        <br />
        <strong>echo [text]</strong>: Display text
        <br />
        <strong>ls</strong>: List directory contents
        <br />
        <strong>cd [path]</strong>: Change directory
        <br />
        <strong>cat [file]</strong>: Display file contents
        <br />
        <strong>touch [file]</strong>: Create new file
        <br />
        <strong>mkdir [dir]</strong>: Create new directory
        <br />
        <strong>rm [file/dir]</strong>: Remove file or directory
        <br />
        <strong>edit [file]</strong>: Edit file contents
        <br />
        <strong>weather [city]</strong>: Get weather info
        <br />
        <strong>calc [expression]</strong>: Calculate expression
        <br />
        <strong>mv [source] [destination]</strong>: Move or rename files and directories
        <br />
        <strong>cp [source] [destination]</strong>: Copy files and directories
        <br />
        <strong>grep [pattern] [file]</strong>: Search for a pattern in a file
        <br />
        <br />
        <strong>Examples:</strong>
        <br />
        <em>echo Hello World</em>: Displays &quot;Hello World&quot;
        <br />
        <em>cd /home/user/docs</em>: Changes directory to /home/user/docs
        <br />
        <em>cat file.txt</em>: Displays contents of file.txt
        <br />
        <em>mv oldname.txt newname.txt</em>: Renames oldname.txt to newname.txt
        <br />
        <em>cp file1.txt file2.txt</em>: Copies file1.txt to file2.txt
        <br />
        <em>grep &quot;search&quot; file.txt</em>: Searches for &quot;search&quot; in file.txt
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
            <span key={path} className={`${isDir ? ' flex items-center text-surface600 mt-2' : 'flex items-center text-center text-slate-400'}`}>
              {name}{isDir ? '/' : ''}
            </span>
          );
        });

      return (
        <div className="grid grid-cols-4 justify-center gap-2 items-center text-center">
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

    mv: (args: string[]) => {
      const [source, destination] = args;
      if (!source || !destination) return 'Please specify source and destination';

      const sourcePath = `${currentPath}/${source}`;
      const destinationPath = `${currentPath}/${destination}`;

      if (!fileSystem[sourcePath]) {
        return `Error: ${source} does not exist`;
      }

      setFileSystem(prev => {
        const newFS = { ...prev };
        newFS[destinationPath] = newFS[sourcePath];
        delete newFS[sourcePath];
        return newFS;
      });

      return `Moved ${source} to ${destination}`;
    },

    cp: (args: string[]) => {
      const [source, destination] = args;
      if (!source || !destination) return 'Please specify source and destination';

      const sourcePath = `${currentPath}/${source}`;
      const destinationPath = `${currentPath}/${destination}`;

      if (!fileSystem[sourcePath]) {
        return `Error: ${source} does not exist`;
      }

      setFileSystem(prev => ({
        ...prev,
        [destinationPath]: { ...prev[sourcePath] },
      }));

      return `Copied ${source} to ${destination}`;
    },

    grep: (args: string[]) => {
      const [pattern, fileName] = args;
      if (!pattern || !fileName) return 'Please specify a pattern and a file';

      const fullPath = `${currentPath}/${fileName}`;
      if (fileSystem[fullPath]?.type === 'file') {
        const content = fileSystem[fullPath]?.content;
        if (!content) return 'File is empty';
        const matches = content.split('\n').filter(line => line.includes(pattern));
        return matches.length > 0 ? matches.join('\n') : 'No matches found';
      }
      return 'File not found';
    },
  };

  return commands;
};

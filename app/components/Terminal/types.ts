export type CommandHistory = {
    command: string;
    output: React.ReactNode;
    timestamp: string;
  };

  export type FileSystem = {
    [key: string]: {
      type: 'file' | 'directory';
      content?: string;
      size?: number;
      lastModified?: string;
    };
  };

  export type EditorState = {
    isOpen: boolean;
    filePath: string;
    content: string;
  };

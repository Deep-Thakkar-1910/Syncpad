"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import Terminal from "./TerminalComponent";
import { RoomRole } from "@/generated/prisma/enums";
import { useTerminal } from "@/hooks/useTerminal";

export interface EditorMetadata {
  roomId: string;
  roomName: string;
  userName?: string;
  userAvatar?: string;
  userRole?: RoomRole;
  language?: string;
  defaultCode?: string;
  roomMembers?: Array<{
    id: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
  }>;
}

interface CodeEditorLayoutProps extends EditorMetadata {
  onRun?: () => void;
  onLeaveRoom?: () => void;
}

export function CodeEditorLayout({
  language = "javascript",
  defaultCode = "// Start typing...",
}: CodeEditorLayoutProps) {
  const [code, setCode] = useState(defaultCode);
  const terminalOpen = useTerminal((state) => state.terminalOpen);
  const toggleTerminal = useTerminal((state) => state.toggleTerminal);

  // Handle Ctrl+J keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "j") {
        e.preventDefault();
        toggleTerminal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="bg-background flex h-screen w-screen flex-col overflow-hidden pt-16">
      {/* Main Editor Area */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <ResizablePanelGroup orientation="vertical" className="flex-1">
          {/* Editor Panel */}
          <ResizablePanel defaultSize={terminalOpen ? 60 : 100} minSize={30}>
            <div className="bg-background relative h-full w-full">
              <Editor
                height="100%"
                width="100%"
                language={language}
                value={code}
                onChange={(value) => setCode(value || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: "Fira Code, Monaco, monospace",
                  wordWrap: "on",
                  formatOnPaste: true,
                  formatOnType: true,
                  autoClosingBrackets: "always",
                  autoClosingQuotes: "always",
                  autoClosingDelete: "always",
                  autoIndent: "full",
                  bracketPairColorization: {
                    enabled: true,
                  },
                  padding: {
                    top: 16,
                    bottom: 16,
                  },
                }}
                beforeMount={(monaco) => {
                  monaco.editor.defineTheme("vs-dark-custom", {
                    base: "vs-dark",
                    inherit: true,
                    rules: [],
                    colors: {
                      "editor.background": "#0a0a0a",
                      "editor.foreground": "#e8e8e8",
                      "editor.lineNumbersBackground": "#161616",
                      "editor.lineNumbersForeground": "#525252",
                    },
                  });
                }}
              />
            </div>
          </ResizablePanel>

          {/* Terminal Panel */}
          {terminalOpen && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={40} minSize={15}>
                <Terminal
                  isOpen={terminalOpen}
                  toggleTerminal={toggleTerminal}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

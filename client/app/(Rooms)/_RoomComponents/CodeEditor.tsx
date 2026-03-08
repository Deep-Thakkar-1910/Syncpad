"use client";

import { useEffect, useRef } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import Terminal from "./TerminalComponent";
import { useTerminal } from "@/hooks/useTerminal";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { WebsocketProvider } from "y-websocket";
import { OnMount, Editor } from "@monaco-editor/react";
import RoomLoadingComponent from "./RoomLoadingComponent";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

interface CodeEditorLayoutProps {
  roomId: string;
  roomName: string;
  userName: string;
  language?: string;
  defaultCode?: string;
  token: string;
}

export function CodeEditorLayout({
  language = "javascript",
  roomId,
  userName,
  token,
}: CodeEditorLayoutProps) {
  const terminalOpen = useTerminal((state) => state.terminalOpen);
  const toggleTerminal = useTerminal((state) => state.toggleTerminal);

  const providerRef = useRef<WebsocketProvider | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);

  const handleEditorMount: OnMount = (editor, monaco) => {
    // Creating a shared Yjs document
    const ydoc = new Y.Doc({});

    // Connecting to yjs websocket
    const provider = new WebsocketProvider(
      `${process.env.NEXT_PUBLIC_WS_CONNECTION_URL}/yjs`, //connecting to relay yjs server
      roomId, // unique room name
      ydoc,
      {
        params: {
          token,
        },
      },
    );

    providerRef.current = provider; // assigning provider to ref for cleanup later

    const yText = ydoc.getText("monaco");
    // For setting up awareness (for multi-cursor)
    const awareness = provider.awareness;

    function getUserColor(name: string) {
      // Deterministically generate a color based on the user's name (user with same name gets same color)
      let hash = 0;
      for (const char of name) hash = char.charCodeAt(0) + ((hash << 5) - hash);

      return `hsl(${hash % 360}, 70%, 50%)`;
    }

    awareness.setLocalStateField("user", {
      // setting local user state for awareness (for multi-cursor)
      name: userName,
      color: getUserColor(userName),
    });

    const styledClients = new Set<number>(); // To keep track of clients we've already added styles for

    awareness.on("update", () => {
      awareness.getStates().forEach((state: any, clientId: number) => {
        if (!state.user) return;
        if (styledClients.has(clientId)) return; // If we've already added styles for this client, skip

        styledClients.add(clientId); // Add client to the set of styled clients (Marking as added)

        const color = state.user.color || "#888";
        const name = state.user.name || "Anonymous";

        const style = document.createElement("style");

        style.innerHTML = `
      .yRemoteSelection-${clientId} {
        --yjs-selection-color: ${color}1A;
      }

      .yRemoteSelectionHead-${clientId} {
        --yjs-cursor-color: ${color};
        --yjs-user-name: "${name}";
      }
    `; // Styling the remote cursors and selections based on the user's color and name

        document.head.appendChild(style);
      });
    });

    // Monaco binding with yjs so we don't manually manage yjs updates
    bindingRef.current = new MonacoBinding(
      yText,
      editor.getModel()!,
      new Set([editor]),
      awareness,
    );

    const undoManager = new Y.UndoManager(yText, {
      trackedOrigins: new Set([bindingRef.current]),
    }); // Undo manager to isolate undo/redo commands per user.

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyZ, () => {
      undoManager.undo(); // binding undo command to ctrl + z
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY, () => {
      undoManager.redo(); // binding redo command to ctrl + y
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      toast.success("Your changes have been saved!"); // just show a success message on ctrl+s
    });
  };

  // Handle Ctrl+J keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "j") {
        e.preventDefault();
        toggleTerminal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      // cleanup
      window.removeEventListener("keydown", handleKeyDown);
      bindingRef.current?.destroy();
      providerRef.current?.destroy();
    };
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
                theme="vs-dark-custom"
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
                      "editor.background": "#1c1b1e",
                      "editor.foreground": "#e8e8e8",
                      "editor.lineNumbersBackground": "#161616",
                      "editor.lineNumbersForeground": "#525252",
                    },
                  });
                }}
                onMount={handleEditorMount}
                loading={
                  <RoomLoadingComponent Icon={Sparkles} text="Finishing up" />
                }
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

"use client";

import { useState } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Terminal as TerminalIcon, Play } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface TerminalProps {
  isOpen: boolean;
  toggleTerminal: () => void;
}

export default function Terminal({ isOpen, toggleTerminal }: TerminalProps) {
  const [input, setInput] = useState("");

  const [output, setOutput] = useState(
    "Your console output will appear here...",
  );

  const handleRun = () => {
    try {
      if (!isOpen) toggleTerminal(); // open terminal if it's not already open
      const result = `Provided Input:\n${input}\n\nOutput:\n[Execution result]`;
      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-card border-border flex h-full w-full flex-col border-t">
      {/* Terminal Header */}
      <div className="border-border bg-muted/30 flex h-12 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <TerminalIcon className="text-muted-foreground h-4 w-4" />
          <span className="text-foreground text-sm font-semibold">Console</span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 cursor-pointer px-2"
          onClick={handleRun}
        >
          <Play className="mr-1.5 size-3.5" />
          Run
        </Button>
      </div>

      {/* Terminal Content */}
      <div className="flex flex-1 overflow-hidden">
        <ResizablePanelGroup orientation="horizontal">
          {/* Input Section */}
          <ResizablePanel defaultSize={50} minSize="30%">
            <div className="flex h-full flex-col">
              <div className="border-border bg-muted/20 h-10 border-b px-4 py-2">
                <p className="text-muted-foreground text-xs font-medium">
                  Input
                </p>
              </div>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-background text-foreground placeholder:text-muted-foreground/50 flex-1 resize-none overflow-auto p-3 font-mono text-xs focus:outline-none"
                placeholder="Enter test input here..."
                spellCheck="false"
              />
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Output Section */}
          <ResizablePanel defaultSize={50} minSize="30%">
            <div className="border-border bg-muted/20 flex h-10 w-full justify-between border-b px-4 py-2">
              <p className="text-muted-foreground text-xs font-medium">
                Output
              </p>
              <Button
                variant="ghost"
                size={"xs"}
                onClick={() => setOutput("")}
                className="text-muted-foreground cursor-pointer"
              >
                Clear
              </Button>
            </div>
            <div className="bg-background flex h-full flex-col items-start justify-start p-4">
              <pre className="text-muted-foreground wrap-break-words max-w-[90%] text-sm whitespace-pre-wrap">
                {output}
              </pre>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

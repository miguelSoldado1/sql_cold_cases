import React, { useRef, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import Editor from "@monaco-editor/react";
import { PlayIcon, RotateCcwIcon } from "lucide-react";
import { ResultsTable } from "./results-table";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import type { OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import type { Database, QueryExecResult } from "sql.js";

interface SqlQueryProps {
  db: Database | null;
  defaultValue?: string;
  placeholder?: string;
  children: React.ReactNode;
}

export function SqlQuery({ children, db, defaultValue }: SqlQueryProps) {
  const [isPending, startTransition] = useTransition();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [results, setResults] = useState<QueryExecResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Add Ctrl/Cmd + Enter to execute query
    editor.addAction({
      id: "execute-query",
      label: "Execute Query",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => {
        formRef.current?.requestSubmit();
      },
    });

    // Add Ctrl/Cmd + K to clear editor
    editor.addAction({
      id: "clear-editor",
      label: "Clear Editor",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK],
      run: (editor) => {
        editor.setValue("");
        setResults(null);
        setError(null);
      },
    });
  };

  function resetQuery() {
    startTransition(() => {
      editorRef.current?.setValue(defaultValue ?? "");
      setResults(null);
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = editorRef.current?.getValue();
    if (!db || !query) return;

    startTransition(() => {
      try {
        const result = db.exec(query);
        setResults(result);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
        setResults([]);
      }
    });
  }

  return (
    <div className="space-y-4">
      <form ref={formRef} onSubmit={handleSubmit} onReset={resetQuery}>
        {children}
        <Editor
          className="mb-4 rounded-md border border-input"
          height="200px"
          language="sql"
          defaultValue={defaultValue}
          onMount={handleEditorDidMount}
          options={{
            scrollbar: { alwaysConsumeMouseWheel: false },
            minimap: { enabled: false },
            lineNumbers: "off",
            folding: false,
            lineNumbersMinChars: 0,
          }}
        />
        <TooltipProvider>
          <div className="flex max-w-md gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="submit" className="flex-1 gap-2" disabled={isPending}>
                  <PlayIcon className="size-4" />
                  Run Query
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ctrl/Cmd + Enter</p>
              </TooltipContent>
            </Tooltip>
            <Button type="reset" variant="outline" className="flex-1 gap-2" disabled={isPending}>
              <RotateCcwIcon className="size-4" />
              Reset
            </Button>
          </div>
        </TooltipProvider>
      </form>
      {error && (
        <div className="border-l-4 border-destructive bg-destructive/10 p-4 text-destructive" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      <ResultsTable results={results} />
    </div>
  );
}

export function SqlQueryHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-2", className)} {...props} />;
}

export function SqlQueryTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />;
}

export function SqlQueryDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

"use client";

import React, { useRef } from "react";
import { Bold, Italic, List, Heading2, Heading3, Code, Quote, ListOrdered } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  error?: string;
}

const ToolbarButton = ({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className="p-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 text-slate-500 transition-colors"
  >
    {children}
  </button>
);

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Write your blog content here...",
  minHeight = "350px",
  error,
}: RichTextEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wrapSelection = (before: string, after: string = before) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const replacement = `${before}${selected || "text"}${after}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + (selected || "text").length
      );
    }, 0);
  };

  const insertAtNewLine = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const beforeCursor = value.substring(0, start);
    const afterCursor = value.substring(start);
    const lineStart = beforeCursor.lastIndexOf("\n") + 1;
    const lineContent = beforeCursor.substring(lineStart);
    
    // If already at the right prefix, remove it; otherwise add it
    if (lineContent.startsWith(prefix)) {
      const newValue = value.substring(0, lineStart) + lineContent.substring(prefix.length) + afterCursor;
      onChange(newValue);
    } else {
      const newValue = value.substring(0, lineStart) + prefix + lineContent + afterCursor;
      onChange(newValue);
    }
    setTimeout(() => textarea.focus(), 0);
  };

  return (
    <div className={`border rounded-xl overflow-hidden ${error ? "border-red-400 ring-1 ring-red-400" : "border-slate-200"} focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 bg-slate-50 border-b border-slate-200">
        <ToolbarButton onClick={() => wrapSelection("**")} title="Bold">
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => wrapSelection("*")} title="Italic">
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => wrapSelection("`")} title="Inline Code">
          <Code size={16} />
        </ToolbarButton>
        <div className="w-px h-5 bg-slate-200 mx-1" />
        <ToolbarButton onClick={() => insertAtNewLine("## ")} title="Heading 2">
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => insertAtNewLine("### ")} title="Heading 3">
          <Heading3 size={16} />
        </ToolbarButton>
        <div className="w-px h-5 bg-slate-200 mx-1" />
        <ToolbarButton onClick={() => insertAtNewLine("- ")} title="Bullet List">
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => insertAtNewLine("1. ")} title="Numbered List">
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => insertAtNewLine("> ")} title="Blockquote">
          <Quote size={16} />
        </ToolbarButton>
        <div className="ml-auto flex items-center">
          <span className="text-xs text-slate-400">
            {value.split(/\s+/).filter(w => w).length} words
          </span>
        </div>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ minHeight, resize: "vertical" }}
        className="w-full px-4 py-3 text-slate-800 text-sm leading-7 focus:outline-none bg-white placeholder-slate-400 font-mono"
      />
    </div>
  );
};

export default RichTextEditor;

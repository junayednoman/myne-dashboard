"use client";

import { useRef, useMemo } from "react";
import dynamic from "next/dynamic";

// Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-background border border-border rounded-lg flex items-center justify-center">
      <div className="text-muted-foreground">Loading editor...</div>
    </div>
  ),
});

interface JoditTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const JoditTextEditor = ({
  content,
  onChange,
  placeholder = "Start writing...",
}: JoditTextEditorProps) => {
  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder,
      height: 600,
      theme: "dark",
      style: {
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      },
      toolbarButtonSize: "small",
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "brush",
        "|",
        "align",
        "|",
        "undo",
        "redo",
        "|",
        "table",
        "link",
        "image",
        "|",
        "hr",
        "copyformat",
        "fullsize",
        "print",
        "about",
      ],
      removeButtons: ["source"],
      showCharsCounter: true,
      showWordsCounter: true,
      showXPathInStatusbar: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: "insert_clear_html",
      beautyHTML: true,
      toolbarAdaptive: true,
      toolbarSticky: false,
      uploader: {
        insertImageAsBase64URI: true,
      },
      controls: {
        font: {
          list: {
            "": "Default",
            "'Helvetica Neue', Helvetica, Arial, sans-serif": "Helvetica",
            "Arial, sans-serif": "Arial",
            "'Times New Roman', Times, serif": "Times New Roman",
            "Georgia, serif": "Georgia",
            "'Courier New', Courier, monospace": "Courier New",
          },
        },
      },
    }),
    [placeholder]
  );

  return (
    <div className="h-fit">
      <JoditEditor
        ref={editor}
        value={content}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        config={config}
        onBlur={(newContent) => onChange(newContent)}
      />
    </div>
  );
};

export default JoditTextEditor;

"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import FileHandler from "@tiptap/extension-file-handler";
import { useCallback, useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  ImagePlus,
  Youtube as YoutubeIcon,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import { uploadBlogImage } from "@/app/admin/blog/upload-actions";

type RichTextEditorProps = {
  content: string;
  onChange: (html: string) => void;
};

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/shorts\/([^&\s?]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const result = await uploadBlogImage(formData);
  if (result.error) throw new Error(result.error);
  if (!result.url) throw new Error("Upload failed");
  return result.url;
}

function Toolbar({ editor }: { editor: Editor | null }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    e.target.value = "";
    try {
      const url = await uploadImage(file);
      editor?.commands.setImage({ src: url });
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Image upload failed. Ensure GCP Storage is configured.");
    }
  };

  const handleYoutubeClick = () => {
    const url = window.prompt("Paste YouTube video URL:");
    if (!url) return;
    const videoId = extractYoutubeId(url);
    if (!videoId) {
      alert("Invalid YouTube URL");
      return;
    }
    editor?.commands.setYoutubeVideo({
      src: `https://www.youtube.com/watch?v=${videoId}`,
      width: 640,
      height: 360,
    });
  };

  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-[var(--border)] bg-[#0d0d0d] p-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleImageChange}
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Bold"
      >
        <Bold size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Italic"
      >
        <Italic size={16} />
      </ToolbarButton>
      <span className="mx-1 h-4 w-px bg-[var(--border)]" />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
        title="Heading 2"
      >
        <Heading2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
        title="Heading 3"
      >
        <Heading3 size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="Bullet list"
      >
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="Numbered list"
      >
        <ListOrdered size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        title="Quote"
      >
        <Quote size={16} />
      </ToolbarButton>
      <span className="mx-1 h-4 w-px bg-[var(--border)]" />
      <ToolbarButton onClick={handleImageClick} title="Insert image">
        <ImagePlus size={16} />
      </ToolbarButton>
      <ToolbarButton onClick={handleYoutubeClick} title="Insert YouTube video">
        <YoutubeIcon size={16} />
      </ToolbarButton>
    </div>
  );
}

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded p-1.5 transition ${
        active
          ? "bg-[var(--accent-gold)]/20 text-[var(--accent-gold)]"
          : "text-[var(--muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)]"
      }`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const handleUpload = useCallback(
    async (file: File) => {
      try {
        const url = await uploadImage(file);
        return url;
      } catch {
        return null;
      }
    },
    []
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Youtube.configure({
        width: 640,
        height: 360,
        nocookie: true,
      }),
      FileHandler.configure({
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
        onDrop: (editor, files, pos) => {
          files.forEach(async (file) => {
            const url = await handleUpload(file);
            if (url) {
              editor.commands.insertContentAt(pos, { type: "image", attrs: { src: url } });
            }
          });
        },
        onPaste: (editor, files) => {
          files.forEach(async (file) => {
            const url = await handleUpload(file);
            if (url) editor.commands.setImage({ src: url });
          });
        },
      }),
    ],
    content: content || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[200px] px-4 py-3 focus:outline-none [&_img]:max-w-full [&_img]:rounded [&_iframe]:rounded",
      },
      handleDrop: () => false,
      handlePaste: () => false,
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (content !== editor.getHTML()) {
      editor.commands.setContent(content || "", { emitUpdate: false });
    }
  }, [content, editor]);

  useEffect(() => {
    if (!editor) return;
    const handler = () => onChange(editor.getHTML());
    editor.on("update", handler);
    return () => {
      editor.off("update", handler);
    };
  }, [editor, onChange]);

  return (
    <div className="overflow-hidden rounded-md border border-[var(--border)] bg-[#121212]">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

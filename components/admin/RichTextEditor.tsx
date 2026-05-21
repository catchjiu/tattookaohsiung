"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import FileHandler from "@tiptap/extension-file-handler";
import {
  useCallback,
  useEffect,
  useInsertionEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Area } from "react-easy-crop";
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
import { ImageCropStage } from "@/components/admin/ImageCropStage";
import { getCroppedImageBlob } from "@/lib/image-crop-canvas";

type RichTextEditorProps = {
  content: string;
  onChange: (html: string) => void;
};

const INLINE_ASPECT = 16 / 9;
const INLINE_OUT_W = 1600;
const INLINE_OUT_H = 900;

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

function Toolbar({
  editor,
  imagePipelineBusy,
  runImagePipeline,
}: {
  editor: Editor | null;
  imagePipelineBusy: boolean;
  runImagePipeline: (file: File) => Promise<string | null>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    e.target.value = "";
    try {
      const url = await runImagePipeline(file);
      if (url) editor?.commands.setImage({ src: url });
      else console.warn("Image insert cancelled or failed.");
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
        disabled={imagePipelineBusy}
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
      <ToolbarButton
        onClick={handleImageClick}
        title={
          imagePipelineBusy
            ? "Finish cropping the current image first"
            : "Insert image"
        }
      >
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
  title?: string;
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
  const uploadViaRef = useRef<(file: File) => Promise<string | null>>(
    async () => null
  );
  const cropFinishRef = useRef<((b: Blob | null) => void) | null>(null);
  const overlayUrlRef = useRef<string | null>(null);
  const [cropOverlaySrc, setCropOverlaySrc] = useState<string | null>(null);
  const [overlayCropPixels, setOverlayCropPixels] = useState<Area | null>(null);
  const [uploadBusy, setUploadBusy] = useState(false);

  const handleOverlayCropPixels = useCallback((pixels: Area | null) => {
    setOverlayCropPixels(pixels);
  }, []);

  const settleCropOverlay = useCallback((blob: Blob | null) => {
    const finish = cropFinishRef.current;
    cropFinishRef.current = null;

    const u = overlayUrlRef.current;
    if (u) URL.revokeObjectURL(u);
    overlayUrlRef.current = null;
    setCropOverlaySrc(null);
    setOverlayCropPixels(null);

    finish?.(blob);
  }, []);

  const rasterImageToUrl = useCallback(
    async (file: File): Promise<string | null> => {
      setUploadBusy(true);
      try {
        if (file.type === "image/gif") {
          const formData = new FormData();
          formData.append("file", file);
          const result = await uploadBlogImage(formData);
          if (result.error) throw new Error(result.error);
          return result.url ?? null;
        }

        if (cropFinishRef.current) {
          settleCropOverlay(null);
        }

        const url = URL.createObjectURL(file);
        overlayUrlRef.current = url;
        setOverlayCropPixels(null);
        setCropOverlaySrc(url);

        const croppedBlob = await new Promise<Blob | null>((resolve) => {
          cropFinishRef.current = resolve;
        });

        if (!croppedBlob) return null;

        const formData = new FormData();
        formData.append("file", croppedBlob, "inline.jpg");
        const result = await uploadBlogImage(formData);
        if (result.error) throw new Error(result.error);
        return result.url ?? null;
      } catch {
        settleCropOverlay(null);
        return null;
      } finally {
        setUploadBusy(false);
      }
    },
    [settleCropOverlay]
  );

  useInsertionEffect(() => {
    uploadViaRef.current = rasterImageToUrl;
  }, [rasterImageToUrl]);

  /* Plugins are stable on purpose; uploads resolve through uploadViaRef at drop/paste time. */
  /* eslint-disable react-hooks/refs -- ref only read inside async paste/drop handlers */
  const extensions = useMemo(
    () => [
      StarterKit,
      Image.configure({ inline: false }),
      Youtube.configure({
        width: 640,
        height: 360,
        nocookie: true,
      }),
      FileHandler.configure({
        allowedMimeTypes: [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
        ],
        onDrop: async (ed, files, pos) => {
          for (const file of files) {
            const url = await uploadViaRef.current(file);
            if (url)
              ed.commands.insertContentAt(pos, {
                type: "image",
                attrs: { src: url },
              });
          }
        },
        onPaste: async (ed, files) => {
          for (const file of files) {
            const url = await uploadViaRef.current(file);
            if (url) ed.commands.setImage({ src: url });
          }
        },
      }),
    ],
    []
  );
  /* eslint-enable react-hooks/refs */

  const editor = useEditor({
    extensions,
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

  async function confirmInlineCropOverlay() {
    if (!cropOverlaySrc || !overlayCropPixels) return;
    try {
      const b = await getCroppedImageBlob(
        cropOverlaySrc,
        overlayCropPixels,
        INLINE_OUT_W,
        INLINE_OUT_H
      );
      settleCropOverlay(b);
    } catch {
      settleCropOverlay(null);
    }
  }

  function cancelInlineCropOverlay() {
    settleCropOverlay(null);
  }

  const imagePipelineBusy = Boolean(cropOverlaySrc) || uploadBusy;

  return (
    <div className="relative overflow-hidden rounded-md border border-[var(--border)] bg-[#121212]">
      <Toolbar
        editor={editor}
        imagePipelineBusy={imagePipelineBusy}
        runImagePipeline={rasterImageToUrl}
      />
      <EditorContent editor={editor} />

      {cropOverlaySrc ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-2xl space-y-4 rounded-lg border border-[var(--border)] bg-[#121212] p-4 shadow-2xl"
          >
            <p className="text-sm font-medium text-[var(--muted)]">
              Crop & zoom — 16:9 inline blog image (animated GIF skips this step).
            </p>
            <ImageCropStage
              imageSrc={cropOverlaySrc}
              aspect={INLINE_ASPECT}
              showGrid
              className="relative h-64 w-full overflow-hidden rounded-md border border-[var(--border)] bg-[#0d0d0d]"
              onCropPixelsReady={handleOverlayCropPixels}
              caption={
                <p className="text-xs text-[var(--muted)]">
                  Drag to reposition, use the slider to zoom
                </p>
              }
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={cancelInlineCropOverlay}
                className="rounded-md border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmInlineCropOverlay()}
                disabled={!overlayCropPixels}
                className="rounded-md bg-[var(--accent-gold)] px-3 py-1.5 text-sm font-medium text-[#121212] hover:bg-[#d4af37] disabled:opacity-50"
              >
                Crop & upload
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

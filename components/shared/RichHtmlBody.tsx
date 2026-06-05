type Props = {
  content: string;
  className?: string;
};

export function RichHtmlBody({ content, className = "" }: Props) {
  if (!content.trim()) return null;

  const isHtml = /<[a-z][\s\S]*>/i.test(content);
  const html = isHtml
    ? content
    : content
        .replace(/\n/g, "<br />")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(
          /^### (.*$)/gm,
          "<h3 class='font-display text-xl font-semibold mt-8 mb-3 text-foreground'>$1</h3>"
        )
        .replace(
          /^## (.*$)/gm,
          "<h2 class='font-display text-2xl font-semibold mt-10 mb-3 text-foreground'>$1</h2>"
        )
        .replace(
          /^# (.*$)/gm,
          "<h1 class='font-display text-3xl font-semibold mt-10 mb-3 text-foreground'>$1</h1>"
        );

  return (
    <div
      className={`prose prose-invert max-w-none text-foreground [&_img]:rounded [&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:max-w-2xl [&_p]:text-[17px] [&_p]:leading-relaxed [&_p]:text-foreground-muted ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

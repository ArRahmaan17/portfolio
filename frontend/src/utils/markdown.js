export const BLOG_CONTENT_MAX_LENGTH = 50000;

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const sanitizeUrl = (url) => {
  const trimmed = String(url || "").trim();
  if (!trimmed) {
    return "";
  }

  if (/^(https?:|mailto:|tel:|\/|#)/i.test(trimmed)) {
    return trimmed;
  }

  return "";
};

const formatInlineMarkdown = (value) => {
  let text = escapeHtml(value);

  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, href) => {
    const safeHref = sanitizeUrl(href);
    if (!safeHref) {
      return escapeHtml(label);
    }

    return `<a href="${escapeHtml(safeHref)}" target="_blank" rel="noreferrer">${label}</a>`;
  });
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  text = text.replace(/(^|[^*])[*]([^*\n]+)[*](?![*])/g, "$1<em>$2</em>");
  text = text.replace(/(^|[^_])_([^_\n]+)_(?!_)/g, "$1<em>$2</em>");

  return text;
};

const closeList = (state) => {
  if (!state.listType) {
    return "";
  }

  const closingTag = state.listType === "ol" ? "</ol>" : "</ul>";
  state.listType = null;
  return closingTag;
};

export const markdownToHtml = (markdown) => {
  const input = String(markdown || "").slice(0, BLOG_CONTENT_MAX_LENGTH);

  let i = 0;
  let buffer = "";
  const html = [];

  const state = {
    inCodeBlock: false,
    listType: null,
  };

  const flushLine = (line) => {
    const trimmed = line.trim();

    if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
      html.push(closeList(state));
      html.push("<hr />");
      return;
    }
    if (trimmed.startsWith("```")) {
      html.push(closeList(state));
      if (state.inCodeBlock) {
        html.push("</code></pre>");
      } else {
        html.push("<pre><code>");
      }
      state.inCodeBlock = !state.inCodeBlock;
      return;
    }

    if (state.inCodeBlock) {
      html.push(`${escapeHtml(line)}\n`);
      return;
    }

    if (!trimmed) {
      html.push(closeList(state));
      html.push('<div class="md-blank-line"></div>');
      return;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      html.push(closeList(state));
      html.push(
        `<h${heading[1].length}>${formatInlineMarkdown(heading[2])}</h${heading[1].length}>`
      );
      return;
    }

    const unordered = line.match(/^\s*[-*]\s+(.*)$/);
    if (unordered) {
      if (state.listType !== "ul") {
        html.push(closeList(state));
        html.push("<ul>");
        state.listType = "ul";
      }
      html.push(`<li>${formatInlineMarkdown(unordered[1])}</li>`);
      return;
    }

    const ordered = line.match(/^\s*\d+\.\s+(.*)$/);
    if (ordered) {
      if (state.listType !== "ol") {
        html.push(closeList(state));
        html.push("<ol>");
        state.listType = "ol";
      }
      html.push(`<li>${formatInlineMarkdown(ordered[1])}</li>`);
      return;
    }

    html.push(closeList(state));
    html.push(`<p>${formatInlineMarkdown(trimmed)}</p>`);
  };

  while (i < input.length) {
    const char = input[i];

    if (char === "\n") {
      flushLine(buffer);
      buffer = "";
    } else {
      buffer += char;
    }

    i++;
  }

  // flush last line
  if (buffer) {
    flushLine(buffer);
  }

  html.push(closeList(state));

  if (state.inCodeBlock) {
    html.push("</code></pre>");
  }

  return html.join("");
};

export const markdownToPlainText = (markdown) =>
  String(markdown || "")
    .replace(/\r\n/g, "\n")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1")
    .replace(/^\s{0,3}(#{1,6}|>|[-]|[*]|\d+\.)\s?/gm, "")
    .replace(/[*_~]/g, "")
    .replace(/\n{2,}/g, " ")
    .replace(/\s+/g, " ")
    .trim();

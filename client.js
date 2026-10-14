/**
 * Official Persian & Arabic RTL/BiDi Plugin for DeepSeek Harness Web
 * Client Module: Typography, Bidirectional Flow & Robust Input Isolation
 */
window.__ModuleLoader__.load({
  id: "dsh-plugin-rtl",
  factory(require, exports, module) {
    const RTL_CSS = `
/* ==========================================================================
   Typography & Font Engine
   ========================================================================== */

@font-face {
  font-family: "Vazirmatn";
  src: local("Vazirmatn"), local("Vazirmatn UI"),
       url("https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Variable.woff2") format("woff2");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF;
}

:root {
  --dsh-rtl-font: "Vazirmatn", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* Persian glyph typography fallback across host & all themes (Claude, official, etc.) */
body,
button,
input,
select,
textarea,
[contenteditable="true"],
.markdown,
[class*="markdown"],
p,
div,
span,
li,
h1, h2, h3, h4, h5, h6 {
  font-family: "Vazirmatn", var(--dsw-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
}

/* ==========================================================================
   Directional Flow & Text Alignment
   ========================================================================== */

[dir="rtl"],
.dsh-rtl {
  direction: rtl !important;
  text-align: right !important;
  unicode-bidi: isolate !important;
}

[dir="ltr"] {
  direction: ltr !important;
  text-align: left !important;
}

/* Lists and markers in RTL mode */
[dir="rtl"] ul,
[dir="rtl"] ol,
ul[dir="rtl"],
ol[dir="rtl"],
.dsh-rtl ul,
.dsh-rtl ol {
  direction: rtl !important;
  text-align: right !important;
  padding-right: 28px !important;
  padding-left: 0 !important;
  margin-right: 0 !important;
  list-style-position: outside !important;
}

[dir="rtl"] li,
li[dir="rtl"],
.dsh-rtl li {
  direction: rtl !important;
  text-align: right !important;
  unicode-bidi: isolate !important;
}

[dir="rtl"] li::marker,
li[dir="rtl"]::marker {
  direction: rtl !important;
  text-align: right !important;
}

/* Inline code & links inside RTL blocks */
.dsh-rtl code,
[dir="rtl"] code:not(pre code) {
  direction: ltr !important;
  display: inline-block;
  unicode-bidi: isolate !important;
  font-family: var(--dsw-font-code, "JetBrains Mono", Consolas, Menlo, monospace) !important;
  vertical-align: baseline;
}

.dsh-rtl a,
[dir="rtl"] a {
  unicode-bidi: isolate !important;
}

/* ==========================================================================
   Input, Composer & Lexical Editor Protection
   ========================================================================== */

[contenteditable="true"],
[contenteditable="true"] p,
[contenteditable="true"] span,
[contenteditable="true"] div,
textarea,
input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="file"]) {
  unicode-bidi: plaintext !important;
  text-align: start !important;
}

[contenteditable="true"] [dir="rtl"],
[contenteditable="true"] p[dir="rtl"],
[contenteditable="true"] span[dir="rtl"] {
  unicode-bidi: plaintext !important;
  text-align: start !important;
}

[contenteditable="true"] [dir="ltr"],
[contenteditable="true"] p[dir="ltr"],
[contenteditable="true"] span[dir="ltr"] {
  unicode-bidi: plaintext !important;
  text-align: start !important;
}

/* ==========================================================================
   Strict LTR Preservation for Code Blocks, Tables, Terminals & Diffs
   ========================================================================== */

pre,
pre code,
table,
.code,
[class*="code"],
[class*="CodeBlock"],
[class*="terminal"],
[class*="diff"],
[class*="json"],
[class*="syntax"],
[data-lexical-code] {
  direction: ltr !important;
  text-align: left !important;
  unicode-bidi: isolate !important;
  font-family: var(--dsw-font-code, "JetBrains Mono", Consolas, Menlo, monospace) !important;
}

table th,
table td {
  text-align: left !important;
}
`;

    // Persian and Arabic unicode ranges
    const RTL_CHARS =
      /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

    function hasRTL(text) {
      if (!text) return false;
      return RTL_CHARS.test(text);
    }

    /**
     * Determines direction of the first strong character (ignoring leading neutrals/digits).
     */
    function getFirstStrongDirection(text) {
      if (!text) return null;
      for (let i = 0; i < text.length; i++) {
        const code = text.charCodeAt(i);
        // Arabic, Persian, Hebrew ranges
        if (
          (code >= 0x0590 && code <= 0x08ff) ||
          (code >= 0xfb1d && code <= 0xfdff) ||
          (code >= 0xfe70 && code <= 0xfeff)
        ) {
          return "rtl";
        }
        // Latin and other LTR strong ranges
        if (
          (code >= 0x0041 && code <= 0x005a) ||
          (code >= 0x0061 && code <= 0x007a) ||
          (code >= 0x00c0 && code <= 0x02af)
        ) {
          return "ltr";
        }
      }
      return null;
    }

    function syncEditor(editor) {
      if (!editor) return;
      if (editor.getAttribute("dir") !== "auto") {
        editor.setAttribute("dir", "auto");
      }
      editor.classList.remove("dsh-rtl");

      const paragraphs = editor.querySelectorAll("p");
      if (paragraphs.length > 0) {
        for (const p of paragraphs) {
          const text = p.textContent || "";
          const dir = getFirstStrongDirection(text);
          if (dir === "rtl") {
            if (p.getAttribute("dir") !== "rtl") p.setAttribute("dir", "rtl");
          } else if (dir === "ltr") {
            if (p.getAttribute("dir") !== "ltr") p.setAttribute("dir", "ltr");
          } else {
            if (p.getAttribute("dir") !== "auto") p.setAttribute("dir", "auto");
          }
          p.classList.remove("dsh-rtl");
        }
      }
    }

    function syncInput(input) {
      if (!input) return;
      if (input.getAttribute("dir") !== "auto") {
        input.setAttribute("dir", "auto");
      }
      input.classList.remove("dsh-rtl");
    }

    function processElement(el) {
      if (!el || el.nodeType !== Node.ELEMENT_NODE) return;

      const tagName = el.tagName.toLowerCase();

      // Skip code, terminal, diff, scripts
      if (
        ["pre", "code", "table", "script", "style", "svg", "path", "canvas"].includes(
          tagName
        )
      ) {
        return;
      }
      if (
        el.closest("pre") ||
        el.closest("table") ||
        el.closest('[class*="terminal"]') ||
        el.closest('[class*="diff"]')
      ) {
        return;
      }

      // Handle user inputs & editors
      if (el.getAttribute("contenteditable") === "true") {
        syncEditor(el);
        return;
      }
      if (el.closest?.('[contenteditable="true"]')) {
        return;
      }
      if (tagName === "textarea" || tagName === "input") {
        syncInput(el);
        return;
      }

      // Handle rendered blocks
      const isBlock =
        [
          "p",
          "li",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "blockquote",
        ].includes(tagName) ||
        el.classList.contains("markdown") ||
        el.className?.includes?.("markdown");

      if (isBlock) {
        const text = el.textContent || "";
        if (hasRTL(text)) {
          if (el.getAttribute("dir") !== "rtl") {
            el.setAttribute("dir", "rtl");
          }
          el.classList.add("dsh-rtl");
        }
      }
    }

    function scanDom(root) {
      if (!root) return;
      processElement(root);
      const candidates = root.querySelectorAll?.(
        'p, li, h1, h2, h3, h4, h5, h6, blockquote, [contenteditable="true"], textarea, input:not([type="checkbox"]):not([type="radio"])'
      );
      if (candidates) {
        for (let i = 0; i < candidates.length; i++) {
          processElement(candidates[i]);
        }
      }
    }

    return {
      apply(ctx) {
        ctx.logger?.info("Initializing Official RTL & Persian BiDi plugin");

        // 1. Inject Stylesheet
        const styleEl = document.createElement("style");
        styleEl.id = "dsh-plugin-rtl-styles";
        styleEl.textContent = RTL_CSS;
        document.head.appendChild(styleEl);

        // 2. Initial DOM Scan
        scanDom(document.body);

        // 3. Delegated input listener for real-time responsiveness
        function handleInputEvent(e) {
          const target = e.target;
          if (!target || !(target instanceof HTMLElement)) return;

          const editor = target.closest('[contenteditable="true"]');
          if (editor) {
            syncEditor(editor);
            return;
          }

          if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") {
            syncInput(target);
          }
        }

        document.addEventListener("input", handleInputEvent, true);
        document.addEventListener("keyup", handleInputEvent, true);
        document.addEventListener("paste", handleInputEvent, true);
        document.addEventListener("compositionend", handleInputEvent, true);
        document.addEventListener("focusin", handleInputEvent, true);

        // 4. MutationObserver for async streamed messages and dynamic UI
        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if (mutation.type === "childList") {
              for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  scanDom(node);
                }
              }
            } else if (mutation.type === "characterData") {
              const parent = mutation.target.parentElement;
              if (parent) processElement(parent);
            }
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true,
        });

        // 5. Cleanup on plugin teardown / reload
        const teardown = () => {
          styleEl.remove();
          observer.disconnect();
          document.removeEventListener("input", handleInputEvent, true);
          document.removeEventListener("keyup", handleInputEvent, true);
          document.removeEventListener("paste", handleInputEvent, true);
          document.removeEventListener("compositionend", handleInputEvent, true);
          document.removeEventListener("focusin", handleInputEvent, true);
          ctx.logger?.info("Cleaned up RTL & Persian BiDi plugin");
        };

        if (typeof ctx.effect === "function") {
          ctx.effect(() => teardown, "dsh-plugin-rtl-effect");
        }

        return teardown;
      },
    };
  },
});

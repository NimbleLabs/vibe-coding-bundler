import { useState, useCallback } from "react";
import {
  EditorRoot,
  EditorContent,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorBubble,
  EditorBubbleItem,
  handleCommandNavigation,
  type EditorInstance,
} from "novel";
import { StarterKit, Placeholder, Color, TextStyle, TiptapUnderline, TiptapLink } from "novel";

// Default content for the editor
const defaultContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Welcome to Novel" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "This is a ",
        },
        {
          type: "text",
          marks: [{ type: "bold" }],
          text: "Notion-style",
        },
        {
          type: "text",
          text: " WYSIWYG editor built with ",
        },
        {
          type: "text",
          marks: [{ type: "link", attrs: { href: "https://tiptap.dev" } }],
          text: "Tiptap",
        },
        {
          type: "text",
          text: " and compiled at runtime with vibe-coding-bundler.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Try these features:",
        },
      ],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", text: "Type " },
                { type: "text", marks: [{ type: "code" }], text: "/" },
                { type: "text", text: " to open the command menu" },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", text: "Select text to see the formatting toolbar" },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", text: "Use " },
                { type: "text", marks: [{ type: "bold" }], text: "Markdown" },
                { type: "text", text: " shortcuts like " },
                { type: "text", marks: [{ type: "code" }], text: "**bold**" },
                { type: "text", text: " or " },
                { type: "text", marks: [{ type: "code" }], text: "# heading" },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      content: [],
    },
  ],
};

// Slash command items
const suggestionItems = [
  {
    title: "Heading 1",
    description: "Large section heading",
    icon: "H1",
    command: ({ editor, range }: { editor: EditorInstance; range: any }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    icon: "H2",
    command: ({ editor, range }: { editor: EditorInstance; range: any }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    icon: "H3",
    command: ({ editor, range }: { editor: EditorInstance; range: any }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
    },
  },
  {
    title: "Bullet List",
    description: "Create a bullet list",
    icon: "•",
    command: ({ editor, range }: { editor: EditorInstance; range: any }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Numbered List",
    description: "Create a numbered list",
    icon: "1.",
    command: ({ editor, range }: { editor: EditorInstance; range: any }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "Quote",
    description: "Add a quote block",
    icon: "❝",
    command: ({ editor, range }: { editor: EditorInstance; range: any }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    title: "Code Block",
    description: "Add a code block",
    icon: "</>",
    command: ({ editor, range }: { editor: EditorInstance; range: any }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
  },
  {
    title: "Divider",
    description: "Add a horizontal divider",
    icon: "—",
    command: ({ editor, range }: { editor: EditorInstance; range: any }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
];

// Extensions
const extensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
  }),
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "heading") {
        return `Heading ${node.attrs.level}`;
      }
      return "Press '/' for commands...";
    },
    includeChildren: true,
  }),
  Color,
  TextStyle,
  TiptapUnderline,
  TiptapLink.configure({
    openOnClick: false,
  }),
];

export default function App() {
  const [saveStatus, setSaveStatus] = useState("Ready");
  const [wordCount, setWordCount] = useState(0);

  const handleUpdate = useCallback(({ editor }: { editor: EditorInstance }) => {
    setSaveStatus("Editing...");
    const text = editor.getText();
    const words = text.split(/\s+/).filter((word) => word.length > 0).length;
    setWordCount(words);

    // Simulate auto-save
    setTimeout(() => setSaveStatus("Saved"), 500);
  }, []);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <h1>Novel Editor</h1>
          <span className="badge">Runtime Bundled</span>
        </div>
        <div className="header-right">
          <span className="status">{saveStatus}</span>
          <span className="word-count">{wordCount} words</span>
        </div>
      </header>

      {/* Editor */}
      <main className="editor-container">
        <EditorRoot>
          <EditorContent
            initialContent={defaultContent}
            extensions={extensions}
            className="editor-content"
            editorProps={{
              handleDOMEvents: {
                keydown: (_view, event) => handleCommandNavigation(event),
              },
              attributes: {
                class: "prose prose-lg dark:prose-invert prose-headings:font-bold focus:outline-none max-w-full",
              },
            }}
            onUpdate={handleUpdate}
          >
            {/* Slash Command Menu */}
            <EditorCommand className="command-menu">
              <EditorCommandEmpty className="command-empty">
                No results found
              </EditorCommandEmpty>
              <EditorCommandList>
                {suggestionItems.map((item) => (
                  <EditorCommandItem
                    key={item.title}
                    value={item.title}
                    onCommand={(val) => item.command(val)}
                    className="command-item"
                  >
                    <div className="command-icon">{item.icon}</div>
                    <div className="command-text">
                      <p className="command-title">{item.title}</p>
                      <p className="command-description">{item.description}</p>
                    </div>
                  </EditorCommandItem>
                ))}
              </EditorCommandList>
            </EditorCommand>

            {/* Bubble Menu (appears on text selection) */}
            <EditorBubble className="bubble-menu">
              <EditorBubbleItem
                onSelect={(editor) => editor.chain().focus().toggleBold().run()}
                className="bubble-item"
              >
                <strong>B</strong>
              </EditorBubbleItem>
              <EditorBubbleItem
                onSelect={(editor) => editor.chain().focus().toggleItalic().run()}
                className="bubble-item"
              >
                <em>I</em>
              </EditorBubbleItem>
              <EditorBubbleItem
                onSelect={(editor) => editor.chain().focus().toggleUnderline().run()}
                className="bubble-item"
              >
                <u>U</u>
              </EditorBubbleItem>
              <EditorBubbleItem
                onSelect={(editor) => editor.chain().focus().toggleStrike().run()}
                className="bubble-item"
              >
                <s>S</s>
              </EditorBubbleItem>
              <EditorBubbleItem
                onSelect={(editor) => editor.chain().focus().toggleCode().run()}
                className="bubble-item"
              >
                {"</>"}
              </EditorBubbleItem>
            </EditorBubble>
          </EditorContent>
        </EditorRoot>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <span>
          Built with{" "}
          <a href="https://novel.sh" target="_blank" rel="noopener noreferrer">
            Novel
          </a>
          {" + "}
          <a href="https://tiptap.dev" target="_blank" rel="noopener noreferrer">
            Tiptap
          </a>
          {" | Compiled by "}
          <a href="https://github.com/NimbleLabs/vibe-coding-bundler" target="_blank" rel="noopener noreferrer">
            vibe-coding-bundler
          </a>
        </span>
      </footer>
    </div>
  );
}

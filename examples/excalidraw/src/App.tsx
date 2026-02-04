import { useState, useCallback } from "react";
import { Excalidraw, exportToBlob, exportToSvg } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI, AppState, BinaryFiles } from "@excalidraw/excalidraw/types/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";

export default function App() {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [viewModeEnabled, setViewModeEnabled] = useState(false);
  const [zenModeEnabled, setZenModeEnabled] = useState(false);
  const [gridModeEnabled, setGridModeEnabled] = useState(false);

  const handleExport = useCallback(async (format: "png" | "svg") => {
    if (!excalidrawAPI) return;

    const elements = excalidrawAPI.getSceneElements();
    const appState = excalidrawAPI.getAppState();
    const files = excalidrawAPI.getFiles();

    if (elements.length === 0) {
      alert("Nothing to export! Draw something first.");
      return;
    }

    try {
      if (format === "png") {
        const blob = await exportToBlob({
          elements,
          appState: {
            ...appState,
            exportWithDarkMode: theme === "dark",
          },
          files,
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "excalidraw-drawing.png";
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const svg = await exportToSvg({
          elements,
          appState: {
            ...appState,
            exportWithDarkMode: theme === "dark",
          },
          files,
        });
        const svgString = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgString], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "excalidraw-drawing.svg";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. See console for details.");
    }
  }, [excalidrawAPI, theme]);

  const handleClear = useCallback(() => {
    if (!excalidrawAPI) return;
    if (confirm("Are you sure you want to clear the canvas?")) {
      excalidrawAPI.resetScene();
    }
  }, [excalidrawAPI]);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <h1>Excalidraw</h1>
          <span className="badge">Runtime Bundled</span>
        </div>
        <div className="header-controls">
          <div className="control-group">
            <label>
              <input
                type="checkbox"
                checked={viewModeEnabled}
                onChange={(e) => setViewModeEnabled(e.target.checked)}
              />
              View Mode
            </label>
            <label>
              <input
                type="checkbox"
                checked={zenModeEnabled}
                onChange={(e) => setZenModeEnabled(e.target.checked)}
              />
              Zen Mode
            </label>
            <label>
              <input
                type="checkbox"
                checked={gridModeEnabled}
                onChange={(e) => setGridModeEnabled(e.target.checked)}
              />
              Grid
            </label>
          </div>
          <div className="button-group">
            <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
            <button onClick={() => handleExport("png")}>Export PNG</button>
            <button onClick={() => handleExport("svg")}>Export SVG</button>
            <button onClick={handleClear} className="danger">Clear</button>
          </div>
        </div>
      </header>

      {/* Excalidraw Canvas */}
      <div className="excalidraw-wrapper">
        <Excalidraw
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          theme={theme}
          viewModeEnabled={viewModeEnabled}
          zenModeEnabled={zenModeEnabled}
          gridModeEnabled={gridModeEnabled}
          initialData={{
            appState: {
              viewBackgroundColor: theme === "light" ? "#ffffff" : "#1e1e1e",
            },
          }}
          UIOptions={{
            canvasActions: {
              loadScene: true,
              export: { saveFileToDisk: true },
              toggleTheme: true,
            },
          }}
        />
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <span>
          Powered by{" "}
          <a href="https://excalidraw.com" target="_blank" rel="noopener noreferrer">
            Excalidraw
          </a>
          {" | "}
          Compiled at runtime by{" "}
          <a href="https://github.com/NimbleLabs/vibe-coding-bundler" target="_blank" rel="noopener noreferrer">
            vibe-coding-bundler
          </a>
        </span>
      </footer>
    </div>
  );
}

import { useState } from "react";
import Editor from "@monaco-editor/react";
import html2canvas from "html2canvas";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

import './App.css';

const initialHtml = `
<div class="card">
    <h1>This is a card</h1>
    <h2>Testing editor</h2>
</div>
`;

const initalCss = `
.card {
    width: 400px;
    height: 300px;
    background-color: #fece2f;
    border-radius: 10px;
    padding: 10px;
}

h1, h2 {
    text-align: center;
}
`;

export default function LiveCodeEditor() {
  const inititalWidth = window.innerWidth / 2;
  const [isResizing, setIsResizing] = useState(false);
  const [html, setHtml] = useState(initialHtml);
  const [css, setCss] = useState(initalCss);

  const generatePreview = () => {
    return `
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;
  };

  const handleExportAsPng = async () => {
    const iframe = document.getElementById("preview");
    
    if (iframe && iframe.contentDocument) {
      // Create a temporary container to render the preview outside the iframe
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px"; // Hide it off-screen
      tempContainer.innerHTML = iframe.contentDocument.documentElement.innerHTML;
      document.body.appendChild(tempContainer);
  
      // Capture the content
      const canvas = await html2canvas(tempContainer, { useCORS: true });
      document.body.removeChild(tempContainer); // Cleanup
  
      // Download the captured image
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "preview.png";
      link.click();
    }
  };

  const handleExportAsSVG = () => {
    const iframe = document.getElementById("preview");
  
    if (iframe && iframe.contentDocument) {
      const htmlContent = iframe.contentDocument.body.innerHTML;
      const cssContent = Array.from(iframe.contentDocument.styleSheets)
        .map((sheet) => {
          try {
            return Array.from(sheet.cssRules)
              .map((rule) => rule.cssText)
              .join("\n");
          } catch (e) {
            return "";
          }
        })
        .join("\n");
  
      // Create an SVG template
      const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml">
              <style>${cssContent}</style>
              ${htmlContent}
            </div>
          </foreignObject>
        </svg>`;
  
      // Convert to Blob and trigger download
      const blob = new Blob([svgContent], { type: "image/svg+xml" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "preview.svg";
      link.click();
    }
  };

  return (
    <div className="app">
      {/* Code Editors */}
      <div className="header">
        <button onClick={handleExportAsPng}>Export as PNG</button>
        <button onClick={handleExportAsSVG}>Export as SVG</button>
      </div>
      <div className="editdors-container">
        <ResizableBox
          width={inititalWidth} // Initial width
          height={Infinity}
          axis="x"
          resizeHandles={["e"]}
          minConstraints={[200, Infinity]} // Minimum width
          maxConstraints={[800, Infinity]} // Maximum width
          onResizeStart={() => setIsResizing(true)}
          onResizeStop={() => setIsResizing(false)}
          handle={
            <div className="custom-handle">
              <div className="handle-line" />
            </div>
          }
          className="resizable-editor"
        >
          <div className="editor">
            <Editor
              width="100%"
              theme="vs-dark"
              defaultLanguage="html"
              value={html}
              onChange={(value) => setHtml(value || "")}
            />
          </div> 
        </ResizableBox>
        <div className={`editor ${isResizing ? 'resizing' : ''}`}>
          <Editor
            width="100%"
            theme="vs-dark"
            defaultLanguage="css"
            value={css}
            onChange={(value) => setCss(value || "")}
          />
        </div>
      </div>

      {/* Live Preview */}
      <div className="preview-container">
        <iframe
          id="preview"
          className="preview-frame"
          srcDoc={generatePreview()}
        />
      </div>
    </div>
  );
}

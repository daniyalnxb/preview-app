import { useState } from "react";
import Editor from "@monaco-editor/react";
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

  return (
    <div className="app">
      {/* Code Editors */}
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
          className="preview-frame"
          srcDoc={generatePreview()}
        />
      </div>
    </div>
  );
}

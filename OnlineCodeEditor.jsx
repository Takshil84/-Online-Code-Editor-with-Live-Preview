// OnlineCodeEditor.jsx
import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Tabs, Tab } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const defaultHtml = `<!DOCTYPE html>
<html>
<head>
  <title>Live Preview</title>
</head>
<body>
  <h1>Hello, world!</h1>
</body>
</html>`;

const defaultCss = `body { font-family: sans-serif; background-color: #f0f0f0; }`;
const defaultJs = `console.log('Hello from JS');`;

export default function OnlineCodeEditor() {
  const [html, setHtml] = useState(defaultHtml);
  const [css, setCss] = useState(defaultCss);
  const [js, setJs] = useState(defaultJs);
  const [activeTab, setActiveTab] = useState('HTML');
  const iframeRef = useRef(null);

  const generateSrcDoc = () => {
    return \`
      <!DOCTYPE html>
      <html>
        <head>
          <style>\${css}</style>
        </head>
        <body>
          \${html}
          <script>\${js}</script>
        </body>
      </html>
    \`;
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.srcdoc = generateSrcDoc();
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [html, css, js]);

  const renderEditor = () => {
    switch (activeTab) {
      case 'HTML': return <Editor language="html" value={html} onChange={setHtml} height="40vh" theme="vs-dark" />;
      case 'CSS': return <Editor language="css" value={css} onChange={setCss} height="40vh" theme="vs-dark" />;
      case 'JS': return <Editor language="javascript" value={js} onChange={setJs} height="40vh" theme="vs-dark" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="md:w-1/2 p-2">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <Tab value="HTML">HTML</Tab>
          <Tab value="CSS">CSS</Tab>
          <Tab value="JS">JS</Tab>
        </Tabs>
        {renderEditor()}
      </div>
      <div className="md:w-1/2 p-2 bg-white">
        <iframe
          ref={iframeRef}
          title="Live Preview"
          sandbox="allow-scripts"
          frameBorder="0"
          className="w-full h-full border rounded"
        />
      </div>
    </div>
  );
}

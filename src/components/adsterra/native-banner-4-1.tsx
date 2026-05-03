"use client";

import { useEffect, useRef } from "react";

export function NativeBanner4_1() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument;

    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { width: 100%; height: 100%; overflow: hidden; }
          </style>
        </head>
        <body>
          <div id="container-473459f8617fe6bb8f7ce967e319baed"></div>
          <script async="async" data-cfasync="false" src="https://gravelsemesterflourish.com/473459f8617fe6bb8f7ce967e319baed/invoke.js"></script>
      </html>
    `);
    doc.close();
    doc.close();
  }, []);

  return <iframe ref={iframeRef} style={{ width: "100%", border: 0, display: "block" }} sandbox="allow-scripts allow-same-origin" title="Advertisement" />;
}

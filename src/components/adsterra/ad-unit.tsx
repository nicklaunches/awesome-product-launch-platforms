"use client";

import { useEffect, useRef } from "react";

interface AdUnitProps {
  atKey: string;
  format: string;
  height: number;
  width: number;
}

export function AdUnit({ atKey, format, height, width }: AdUnitProps) {
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
          <script type="text/javascript">
            var atOptions = {
              'key' : '${atKey}',
              'format' : '${format}',
              'height' : ${height},
              'width' : ${width},
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://gravelsemesterflourish.com/${atKey}/invoke.js"></script>
        </body>
      </html>
    `);
    doc.close();
  }, [atKey, format, height, width]);

  return (
    <iframe
      className="border-0"
      ref={iframeRef}
      sandbox="allow-scripts allow-same-origin"
      style={{ width: `${width}px`, height: `${height}px` }}
      title="Advertisement"
    />
  );
}

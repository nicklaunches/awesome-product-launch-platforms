"use client";

import { useEffect, useRef, useState } from "react";

export function NativeBanner1_4() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPC, setIsPC] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPC = () => {
      setIsPC(window.innerWidth > 1024);
    };

    checkPC();
    window.addEventListener("resize", checkPC);
    return () => window.removeEventListener("resize", checkPC);
  }, []);

  useEffect(() => {
    if (!isPC || !iframeRef.current) return;

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
          <div id="container-14742d37d934c24f066317392b6b759c"></div>
          <script type="text/javascript">
            var atOptions = {
              'key' : '14742d37d934c24f066317392b6b759c',
              'format' : 'iframe',
              'height' : 600,
              'width' : 160,
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="https://gravelsemesterflourish.com/14742d37d934c24f066317392b6b759c/invoke.js"></script>
        </body>
      </html>
    `);
    doc.close();
  }, [isPC]);

  if (!isPC) return null;

  return <iframe className="fixed left-0 top-14 z-100 hidden xl:block border-0 h-full" ref={iframeRef} sandbox="allow-scripts allow-same-origin" style={{ width: "160px" }} title="Advertisement" />;
}

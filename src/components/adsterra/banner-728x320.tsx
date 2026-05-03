"use client";

import { useEffect, useState } from "react";
import { AdUnit } from "./ad-unit";

export function Banner728x320() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 728);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile === null) return <div className="min-h-[50px] md:min-h-[90px]" />;

  return (
    <div className="flex justify-center pt-4">
      {isMobile ? (
        <AdUnit atKey="0519d0146ca279c20a5437cbec7af657" format="iframe" height={50} width={320} />
      ) : (
        <AdUnit atKey="3924288ae40922a5d9f9c837f1afc21e" format="iframe" height={90} width={728} />
      )}
    </div>
  );
}

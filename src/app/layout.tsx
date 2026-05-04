import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const siteMetadata = {
  title: "Product Launch Channels for Indie Hackers",
  description: "A curated and growing list of platforms where you can launch, submit, and promote your product as an indie hacker or startup founder.",
} as const;

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={`${geist.variable}`} lang="en">
      <body>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}

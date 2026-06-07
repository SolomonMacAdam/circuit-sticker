import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Circuit Sticker",
  description: "A Base Mini App for simple onchain circuit actions."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0b6b45"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content="6a252f5530286f927ea9b491" />
        <meta
          name="talentapp:project_verification"
          content="974b16472e10a5a8e3eb8b7464429d5ad28c002f1ecdbe1426a50d7580786659b7812ae40e22ce71983b18004fe229e44eaab4fdac88323ed5c2af5d25f00cba"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

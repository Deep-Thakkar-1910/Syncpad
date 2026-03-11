import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Providers from "./providers";

const JetBrainsMono = localFont({
  src: "../public/fonts/JetBrainsMono.ttf",
});

export const metadata: Metadata = {
  title: {
    default: "Syncpad",
    template: "%s | Syncpad",
  },
  description:
    "Syncpad is a collaborative IDE made for teams to have fun with pair programming",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${JetBrainsMono.className} dark antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Toaster
            richColors={false}
            duration={5000}
            position="bottom-right"
            closeButton
            swipeDirections={["left", "right"]}
            visibleToasts={3}
          />
        </Providers>
      </body>
    </html>
  );
}

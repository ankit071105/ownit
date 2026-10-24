import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/public-sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "OwnIt — is your GitHub project yours, or the tutorial's?",
  description:
    "OwnIt reads your GitHub repos, finds the ones that look like tutorial copies, and gives you a plan to make each one clearly your own.",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#161a3a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

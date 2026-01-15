import type { Metadata } from "next";
import NavBar from "./components/NavBar";
import LightRays from "./components/LightRays";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk ",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeGeeks Meet-Up",
  description: "Event that brings togther all devloper enthusiast",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${schibstedGrotesk.variable} ${martianMono.variable} antialiased min-h-screen`}
      >
        <NavBar />
        <div className="absolute inset-0 t0p-0 min-h-screen">
          <LightRays
            raysOrigin="top-center-offset"
            raysColor="#5dfeda"
            raysSpeed={0.5}
            lightSpread={0.9}
            rayLength={1.5}
            followMouse={true}
            mouseInfluence={0.03}
            noiseAmount={0}
            distortion={0.05}
          />
        </div>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}

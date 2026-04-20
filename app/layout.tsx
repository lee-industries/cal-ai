import type { Metadata } from "next";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Calorie Tracker",
  description: "A simple calorie tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-50 text-zinc-950">
        <ClerkProvider>
          <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 py-6 sm:px-6">
            <header className="mb-8 flex flex-col gap-4 border-b border-zinc-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-6">
                <Link
                  href="/today"
                  className="text-lg font-semibold tracking-tight"
                >
                  Calorie Tracker
                </Link>

                <nav className="flex items-center gap-4 text-sm">
                  <Link
                    href="/today"
                    className="text-zinc-700 hover:text-zinc-950"
                  >
                    Today
                  </Link>
                  <Link
                    href="/foods"
                    className="text-zinc-700 hover:text-zinc-950"
                  >
                    Foods
                  </Link>
                </nav>
              </div>

              <div className="flex items-center gap-3">
                <Show when="signed-out">
                  <SignInButton>
                    <button className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-50">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="rounded-lg bg-zinc-950 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800">
                      Sign Up
                    </button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <UserButton />
                </Show>
              </div>
            </header>

            <main className="flex-1">{children}</main>
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}

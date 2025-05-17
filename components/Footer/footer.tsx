"use client";

import { FadeIn } from "@/components/animations/fade-in"; // Assuming correct path
import Link from "next/link";
// Assuming ThemeToggle is for dark/light mode and you might want it here
// import { ThemeToggle } from "@/components/theme-toggle"; // Assuming correct path

export function Footer() {
  return (
    <footer className="relative py-12 px-4 border-t border-border">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <FadeIn direction="up" delay={0.1}>
            <div>
              <h3 className="font-bold mb-4">Explore</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/english"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    English
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <div>
              <h3 className="font-bold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="https://github.com/yuno0205"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    GitHub
                  </Link>
                </li>

                <li>
                  <Link
                    href="https://www.linkedin.com/in/nhathao25/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.3}>
            <div>
              <h3 className="font-bold mb-4">Settings</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  {/* You would typically place the ThemeToggle component here if desired */}
                  {/* <ThemeToggle /> */}
                  <span className="text-muted-foreground">Theme (Dark/Light)</span>
                </li>
                <li>
                  <Link
                    href="#" // Replace # if you have a language settings page
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Language
                  </Link>
                </li>
              </ul>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.4}>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/terms" // Example link, replace #
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy" // Example link, replace #
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies" // Example link, replace #
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>

        <div>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Yuno&#39;s Space. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="https://www.linkedin.com/in/nhathao25"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Linked
              </Link>
              <Link
                href="https://github.com/yuno0205" // Replace # with your actual GitHub link
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

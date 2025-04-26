"use client";

import { FadeIn } from "@/components/animations/fade-in";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative py-12 px-4 border-t border-border">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <FadeIn direction="up" delay={0.1}>
            <div>
              <h3 className="font-bold mb-4">Khám phá</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/english"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Tiếng Anh
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
              <h3 className="font-bold mb-4">Liên kết</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
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
              <h3 className="font-bold mb-4">Cài đặt</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-muted-foreground">Chế độ tối/sáng</span>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Ngôn ngữ
                  </Link>
                </li>
              </ul>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.4}>
            <div>
              <h3 className="font-bold mb-4">Pháp lý</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Điều khoản
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Bảo mật
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cookie
                  </Link>
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.5}>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">
              © 2024 Workspace. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Twitter
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}

import Image from "next/image";
import Link from "next/link";
import CPUComponent from "./components/CPU";
import Hero from "./components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center w-full">
              <Link
                href="/"
                className="flex items-center space-x-2 relative w-1/3 h-full"
              >
                <Image
                  src="/assets/images/logo.png"
                  alt="Next.js Logo"
                  width={200}
                  height={150}
                />
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/docs"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Docs
              </Link>
              <Link
                href="/learn"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Learn
              </Link>
              <Link
                href="/showcase"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Showcase
              </Link>
              <Link
                href="/blog"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Blog
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative isolate overflow-hidden pt-24">
        <Hero />
      </div>

      {/* Advanced Features Section */}
      <div className="w-full min-h-[264px] overflow-hidden flex justify-center items-center relative z-1">
        <CPUComponent />
        <div className="relative px-6 py-5 cpu z-1">
          <div className="shine absolute w-full h-full"></div>
          <div className="connector absolute flex flex-col gap-4">
            <span className="item"></span>
            <span className="item"></span>
          </div>
          <div className="connector right-side absolute flex flex-col gap-4">
            <span className="item"></span>
            <span className="item"></span>
          </div>
          <div className="connector top-side absolute flex gap-4 justify-center">
            <span className="item"></span>
            <span className="item"></span>
            <span className="item"></span>
            <span className="item"></span>
            <span className="item"></span>
            <span className="item"></span>
          </div>
          <div className="connector bottom-side absolute flex gap-4 justify-center">
            <span className="item"></span>
            <span className="item"></span>
            <span className="item"></span>
            <span className="item"></span>
            <span className="item"></span>
            <span className="item"></span>
          </div>
          <span className="data-text text-white text-2xl font-bold">
            Powered By
          </span>
        </div>
      </div>

      {/* Getting Started Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Getting Started
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Start building with Next.js in seconds
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Create a new Next.js project with the latest features and best
            practices.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24">
          <div className="bg-gray-900 rounded-lg p-8">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <pre className="text-sm text-gray-100 overflow-x-auto">
                  <code>npx create-next-app@latest my-app</code>
                </pre>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              <p>
                This will create a new Next.js project with the following
                features:
              </p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>App Router</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>ESLint</li>
                <li>Fast Refresh</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="bg-gray-50 dark:bg-gray-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Community
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Join the Next.js community
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
              Connect with other developers, share your projects, and learn from
              the community.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {community.map((item) => (
                <div key={item.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                    {item.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                    <p className="flex-auto">{item.description}</p>
                    <p className="mt-6">
                      <Link
                        href={item.link}
                        className="text-sm font-semibold leading-6 text-indigo-600"
                      >
                        Learn more <span aria-hidden="true">→</span>
                      </Link>
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link
              href="https://github.com/vercel/next.js"
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.91-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <Link
              href="https://twitter.com/nextjs"
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </Link>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-500">
              &copy; 2024 Next.js. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
const community = [
  {
    name: "Discord",
    description:
      "Join our Discord community to chat with other developers and get help.",
    link: "https://discord.gg/nextjs",
  },
  {
    name: "GitHub Discussions",
    description:
      "Ask questions and share your projects with the Next.js community on GitHub.",
    link: "https://github.com/vercel/next.js/discussions",
  },
  {
    name: "Next.js Conf",
    description:
      "Watch talks from the Next.js conference and learn from the experts.",
    link: "https://nextjs.org/conf",
  },
];

// const tooling = [
//   {
//     name: "React",
//     description:
//       "The library for web and native user interfaces. Next.js is built on the latest React features, including Server Components and Actions.",
//     icon: "/react.svg",
//   },
//   {
//     name: "Turbopack",
//     description:
//       "An incremental bundler optimized for JavaScript and TypeScript, written in Rust, and built into Next.js. Up to 700x faster than Webpack.",
//     icon: "/turbopack.svg",
//   },
//   {
//     name: "SWC",
//     description:
//       "Speedy Web Compiler - An extensible Rust-based platform for the next generation of fast developer tools. Up to 20x faster than Babel.",
//     icon: "/swc.svg",
//   },
//   {
//     name: "Server Components",
//     description:
//       "Run components on the server to reduce client-side JavaScript. Up to 70% reduction in JavaScript bundle size.",
//     icon: "/server.svg",
//   },
//   {
//     name: "Edge Runtime",
//     description:
//       "Deploy your application to the Edge for faster response times and lower latency. Global distribution with Vercel Edge Network.",
//     icon: "/edge.svg",
//   },
//   {
//     name: "Static Generation",
//     description:
//       "Pre-render pages at build time for instant page loads. Incremental Static Regeneration for dynamic content.",
//     icon: "/static.svg",
//   },
// ];

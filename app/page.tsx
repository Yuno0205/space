import Image from "next/image";
import Link from "next/link";
import CPUComponent from "./components/CPU";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/next.svg"
                  alt="Next.js Logo"
                  width={32}
                  height={32}
                />
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Next.js
                </span>
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
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <a href="#" className="inline-flex space-x-6">
                <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                  What&apos;s new
                </span>
                <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600 dark:text-gray-400">
                  <span>Next.js 14 is now available</span>
                  <svg
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </div>
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              The React Framework for the Web
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
              Used by some of the world&apos;s largest companies, Next.js
              enables you to create{" "}
              <strong>high-quality web applications</strong> with the power of
              React components.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="/docs"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get Started
              </Link>
              <Link
                href="/learn"
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
              >
                Learn Next.js <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <Image
                src="/next.svg"
                alt="Next.js Logo"
                width={2432}
                height={1442}
                className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            What&apos;s in Next.js?
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Everything you need to build great products on the web.
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Next.js provides a comprehensive set of features to help you build
            modern web applications with React.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Tooling Section */}
      <div className="bg-black py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl pb-4">
              Built on a foundation of fast, production-grade tooling
            </h2>
          </div>

          <div className="relative">
            {/* Powered By Text */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="bg-zinc-800 rounded-xl px-6 py-3">
                <p className="text-xl text-gray-400">Powered By</p>
              </div>
            </div>

            {/* Connection Lines */}
            <div className="absolute inset-0">
              <svg className="w-full h-full" viewBox="0 0 1000 400">
                {/* Horizontal line */}
                <path d="M200 200 L800 200" stroke="#1a1a1a" strokeWidth="2" />
                {/* Vertical lines */}
                <path d="M500 100 L500 200" stroke="#1a1a1a" strokeWidth="2" />
                {/* Lines to cards */}
                <path d="M500 200 L200 300" stroke="#0ea5e9" strokeWidth="2" />
                <path d="M500 200 L500 300" stroke="#dc2626" strokeWidth="2" />
                <path d="M500 200 L800 300" stroke="#eab308" strokeWidth="2" />
              </svg>
            </div>

            {/* Tool Cards */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 pt-20">
              {/* React */}
              <div className="rounded-2xl bg-zinc-900 p-8 ring-1 ring-white/10">
                <div className="flex items-center gap-3">
                  <Image
                    src="/react.svg"
                    alt="React"
                    width={32}
                    height={32}
                    className="h-8 w-8 text-[#61DAFB]"
                  />
                  <h3 className="text-lg font-semibold text-white">React</h3>
                </div>
                <p className="mt-4 text-sm text-gray-400">
                  The library for web and native user interfaces. Next.js is
                  built on the latest React features, including Server
                  Components and Actions.
                </p>
              </div>

              {/* Turbopack */}
              <div className="rounded-2xl bg-zinc-900 p-8 ring-1 ring-white/10">
                <div className="flex items-center gap-3">
                  <Image
                    src="/turbopack.svg"
                    alt="Turbopack"
                    width={32}
                    height={32}
                    className="h-8 w-8"
                  />
                  <h3 className="text-lg font-semibold text-white">
                    Turbopack
                  </h3>
                </div>
                <p className="mt-4 text-sm text-gray-400">
                  An incremental bundler optimized for JavaScript and
                  TypeScript, written in Rust, and built into Next.js.
                </p>
              </div>

              {/* SWC */}
              <div className="rounded-2xl bg-zinc-900 p-8 ring-1 ring-white/10">
                <div className="flex items-center gap-3">
                  <Image
                    src="/swc.svg"
                    alt="SWC"
                    width={32}
                    height={32}
                    className="h-8 w-8"
                  />
                  <h3 className="text-lg font-semibold text-white">
                    Speedy Web Compiler
                  </h3>
                </div>
                <p className="mt-4 text-sm text-gray-400">
                  An extensible Rust based platform for the next generation of
                  fast developer tools, and can be used for both compilation and
                  minification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Features Section */}
      <div className="w-full flex justify-center items-center relative">
        <CPUComponent />
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

const features = [
  {
    name: "Built-in Optimizations",
    description:
      "Automatic Image, Font, and Script Optimizations for improved UX and Core Web Vitals.",
  },
  {
    name: "Data Fetching",
    description:
      "Make your React component async and await your data. Next.js supports both server and client data fetching.",
  },
  {
    name: "Server Actions",
    description:
      "Run server code by calling a function. Skip the API. Then, easily revalidate cached data and update your UI in one network roundtrip.",
  },
];

// const advancedFeatures = [
//   {
//     name: "Server Components",
//     description:
//       "Write components that run on the server, reducing client-side JavaScript and improving performance.",
//     example: `// app/page.tsx
// export default async function Page() {
//   const data = await fetchData();
//   return <div>{data}</div>;
// }`,
//   },
//   {
//     name: "App Router",
//     description:
//       "A new file-system based router with support for layouts, nested routes, and server components.",
//     example: `// app/blog/[slug]/page.tsx
// export default function BlogPost({ params }) {
//   return <div>Post: {params.slug}</div>;
// }`,
//   },
//   {
//     name: "Server Actions",
//     description:
//       "Write server-side functions that can be called directly from your components.",
//     example: `// app/actions.ts
// 'use server'
// export async function submitForm(data) {
//   // Handle form submission
// }`,
//   },
//   {
//     name: "Image Optimization",
//     description:
//       "Automatic image optimization with next/image, including lazy loading and responsive sizes.",
//     example: `// app/components/Image.tsx
// import Image from 'next/image'
// export default function OptimizedImage() {
//   return <Image src="/photo.jpg" alt="Photo" width={500} height={300} />;
// }`,
//   },
// ];

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

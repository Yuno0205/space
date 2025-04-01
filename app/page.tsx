import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        Welcome to Your Personal Workspace
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Blog Section */}
        <Link
          href="/blog"
          className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Blog
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Share your thoughts, experiences, and knowledge through your
            personal blog.
          </p>
        </Link>

        {/* English Learning Section */}
        <Link
          href="/english"
          className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            English Learning
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Practice your English skills with AI-powered exercises in listening,
            speaking, reading, and writing.
          </p>
        </Link>
      </div>
    </div>
  );
}

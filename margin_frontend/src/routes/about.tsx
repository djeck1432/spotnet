import { Link } from "@tanstack/react-router";

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-semibold">About Page</h2>
      <p className="text-gray-600 text-center">
        This page provides information about the application, its features, and
        the purpose it serves.
      </p>
      <Link to="/">
        <button className="px-4 py-2 bg-blue-500 text-black rounded">
          Back to Home Page
        </button>
      </Link>
    </div>
  );
}

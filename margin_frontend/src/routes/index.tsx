import { Link } from "@tanstack/react-router";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-semibold">Home Page</h2>
      <p className="text-gray-600 text-center">
        This is the home page where you can find an overview and navigate to
        other sections.
      </p>
      <Link to="/about">
        <button className="px-4 py-2 bg-green-500 text-black rounded">
          Go to About Page
        </button>
      </Link>
    </div>
  );
}

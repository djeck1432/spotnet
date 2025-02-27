import { Link } from "@tanstack/react-router";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-900">
      <h1 className="text-4xl font-bold mb-6">Home Page</h1>
      <Link
        to="/about"
        className="px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all"
      >
        Go to About
      </Link>
    </div>
  );
}

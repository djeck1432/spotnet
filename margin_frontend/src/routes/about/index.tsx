import { Link } from '@tanstack/react-router'

export default function About() {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-900'>
      <h1 className="text-4xl font-bold mb-6">About Page</h1>
      <Link to="/"  className="px-6 py-3 text-lg font-medium text-white bg-green-900 rounded-lg shadow-md hover:bg-green-700 transition-all">Go to Home</Link>
    </div>
  )
}


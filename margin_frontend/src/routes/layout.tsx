import { Outlet } from '@tanstack/react-router'

export default function Layout() {
  return (
    <div className="p-6">
      <nav className="mb-4 flex gap-4">
        <a href="/" className="text-blue-600 hover:underline">Home</a>
        <a href="/about" className="text-blue-600 hover:underline">About</a>
      </nav>
      <Outlet />
    </div>
  )
}

import { Outlet } from '@tanstack/react-router'

export default function Layout() {
  return (
    <div>
      <nav>
        <a href="/">Home</a> | <a href="/about">About</a>
      </nav>
      <Outlet />
    </div>
  )
}

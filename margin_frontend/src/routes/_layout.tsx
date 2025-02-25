import { Outlet } from "@tanstack/react-router";

export default function RootLayout() {
  return (
    <div className="p-4">
      <Outlet />
    </div>
  );
}

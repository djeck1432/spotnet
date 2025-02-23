import { Outlet } from '@tanstack/react-router';

const Layout = () => {
  return (
    <main className="min-h-screen">
      <Outlet /> 
    </main>
  );
};

export default Layout;

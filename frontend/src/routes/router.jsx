import { RouterProvider, createRouter, Route } from '@tanstack/react-router';
import Home from './home';
import About from './about';


const router = createRouter({
  routeTree: (
    <>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />

    </>
  ),
});

const AppRouter = ({ children }) => (
  <>
    {children}
    <RouterProvider router={router} />
  </>
);

export default AppRouter;

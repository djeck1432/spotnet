import "./index.css";
import {  RouterProvider } from "@tanstack/react-router";
import router from "./routes/Routes";
import { TanStackRouterDevtools } from '@tanstack/router-devtools'


function App() {
  return (
    <>
      <RouterProvider router={router} />
      <TanStackRouterDevtools router={router} />
    </>
  );
}

export default App;

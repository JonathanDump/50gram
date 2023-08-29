import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import SignUp from "./pages/SignUp/SignUp";
import LogIn from "./pages/LogIn/LogIn";

export const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        { path: "/sign-up", element: <SignUp /> },
        { path: "/log-in", element: <LogIn /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

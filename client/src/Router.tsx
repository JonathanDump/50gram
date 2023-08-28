import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import SignUp from "./pages/SignUp/SignUp";

export const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [{ path: "/sign-up", element: <SignUp /> }],
    },
  ]);

  return <RouterProvider router={router} />;
};

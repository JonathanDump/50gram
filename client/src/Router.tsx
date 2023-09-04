import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import SignUp from "./pages/SignUp/SignUp";
import LogIn from "./pages/LogIn/LogIn";
import FiftyGram, { loader as appLoader } from "./pages/FiftyGram/FiftyGram";
import Error from "./pages/Error/Error";
import Chat from "./components/Chat/Chat";

export const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <Error />,
      children: [
        {
          path: "/",
          element: <FiftyGram />,

          children: [{ path: "/:userId", element: <Chat /> }],
        },
        { path: "/sign-up", element: <SignUp /> },
        { path: "/log-in", element: <LogIn /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

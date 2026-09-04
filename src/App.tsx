import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import MainLayout from "./Layouts/MainLayout/MainLayout.tsx";
import Error from "../src/Pages/Error/Error.tsx";
import Home from "./Pages/Home/Home.tsx";
import Profile from "./Pages/Profile/Profile.tsx";
import AuthLayout from "./Layouts/AuthLayout/AuthLayout.tsx";
import SignUp from "./Pages/SignUp/SignUp.tsx";
import LogIn from "./Pages/LogIn/LogIn.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainGard from "./gaurd/mainGard/MainGard.tsx";
import AuthGaurd from "./gaurd/authGaurd/AuthGaurd.tsx";
import PostDetails from "./Pages/PostDetials/PostDetails.tsx";
import { Offline } from "react-detect-offline";

function App() {
  const routes = createBrowserRouter([
    {
      path: "",
      element: (
        <MainGard>
          <MainLayout />
        </MainGard>
      ),
      errorElement: <Error />,
      children: [
        { path: "/Home", element: <Home /> },
        { path: "/Profile", element: <Profile /> },
        { path: "/postDetails/:postId", element: <PostDetails /> },
      ],
    },
    {
      path: "",
      element: (
        <AuthGaurd>
          <AuthLayout />
        </AuthGaurd>
      ),
      errorElement: <Error />,
      children: [
        { index: true, element: <SignUp /> },
        { path: "/LogIn", element: <LogIn /> },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={routes} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
      <Offline>
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg">
          You are offline
        </div>
      </Offline>
    </>
  );
}

export default App;

import {
  BrowserRouter,
  RouterProvider,
  Routes, Route,
  createBrowserRouter,
  redirect,
  Outlet
} from 'react-router-dom';

import './App.css';
import Home from './pages/components/home/Home';
import Navbar from './pages/components/navbar/Navbar';
import Login from './pages/userpage/login/Login';
import Register from './pages/userpage/register/Register';
import Profile from './pages/userpage/profile/Profile';
import Connections from './pages/userpage/connections/Connections';
import DataProvider from './context/userContext';
import ChatProvider from './context/chatContext';
import ProtectedRoute from './auth/private_route';
import PageNotFound from './pages/components/404page/PageNotFound';
import EmailVerify from './pages/reset-passowrd/emailverify/EmailVerify';
import OTPVerify from './pages/reset-passowrd/otpverify/OTPVerify';
import Password from './pages/reset-passowrd/newpassword/Password';
import Chat from './pages/chat/Chat.jsx';
import Request from './pages/request/Request.jsx';
import Pending from './pages/pending/Pending.jsx';
import OTPValidate from './pages/userpage/otpValidate/OTPValidate.jsx';
import { EmailSent } from './pages/userpage/register/EmailSent.jsx';
import RestrictedRoute from './auth/restricted_route.js';

const Layout = () => {
  return <>
    <Navbar />
    <Outlet />
  </>
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <ProtectedRoute ></ProtectedRoute>,
        children: [
          {
            index: true,
            element: <Home />
          },
          {
            path: "home",
            element: <Home />
          },
          {
            path: "/pending_request",
            element: <Pending />
          },
          {
            path: "/received_request",
            element: <Request />
          },
          {
            path: "/profile",
            element: <Profile />
          },
          {
            path: "/chats",
            element: <ChatProvider />,
            children: [
              <Chat />
            ]
          },
        ]
      },

      {
        path: "/",
        element: <RestrictedRoute />,
        children: [
          {
            path: "/login",
            element: <Login />
          },
          {
            path: "/register",
            element: <Register />
          },
          {
            path: "/email_sent",
            element: <EmailSent />
          },
          {
            path: "/email-verify",
            element: <EmailVerify />
          },
          {
            path: "/otp-verify",
            element: <OTPVerify />
          },
          {
            path: "/otp-validate",
            element: <OTPValidate />
          },
          {
            path: "/reset-password",
            element: <Password />
          },
        ]
      },
      {
        path: "/*",
        element: <PageNotFound />
      },
    ]
  }
])


function App() {

  return (
    <div className='App'>
      <DataProvider>
        <RouterProvider router={router} >
        </RouterProvider>
      </DataProvider>
    </div>
  );
}

export default App;

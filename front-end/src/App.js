import { BrowserRouter, RouterProvider, Routes, Route, createBrowserRouter, redirect } from 'react-router-dom';
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
import OTPVlidate from './pages/userpage/otpValidate/OTPValidate.jsx';
import { EmailSent } from './pages/userpage/register/EmailSent.jsx';
import RestrictedRoute from './auth/restricted_route.js';

function App() {

  return (
    <div className='App'>
      <DataProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            
            <Route element={<ProtectedRoute />}>
              {["/home", "/"].map((route, index) => <Route key={index} path={route} element={<Home />} />)}
              <Route path="/pending_request" element={<Pending />} />
              <Route path="/received_request" element={<Request />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/chats" element={
                <ChatProvider >
                  <Chat />
                </ChatProvider>
              } />
            </Route>

            <Route element={<RestrictedRoute/>}>
              <Route path="/login" element={<Login />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/email_sent" element={<EmailSent />} />
              <Route path="/register" element={<Register />} />
              <Route path="/email-verify" element={<EmailVerify />} />
              <Route path="/otp-verify" element={<OTPVerify />} />
              <Route path="/otp-validate" element={<OTPVlidate />} />
              <Route path="/reset-password" element={<Password />} />
              <Route path='/*' element={<PageNotFound />} />
            </Route>

          </Routes>
        </BrowserRouter>
      </DataProvider>
    </div>
  );
}

export default App;

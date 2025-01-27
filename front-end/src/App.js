import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  
  return (
    <div className='App'>
      <DataProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/email-verify" element={<EmailVerify />} />
          <Route path="/otp-verify" element={<OTPVerify />} />
          <Route path="/reset-password" element={<Password />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
              <Route path="/chats" element={
                <ChatProvider >
                <Chat />
                </ChatProvider>
              } />

            <Route path="/connections" element={<Connections />} />
           
          </Route>
          <Route path='/*' element={<PageNotFound/>} />
        </Routes>
      </BrowserRouter>
      </DataProvider>
    </div>
  );
}

export default App;

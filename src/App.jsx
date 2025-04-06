import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterPage from './pages/RegisterPage';
import UserProfile from './pages/UserProfile';
import PreviewComponent from "./components/PreviewComponent"
import AdminDashboard from "./pages/AdminDashboard"
import CreateUserPage from "./pages/CreateUserPage"


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/preview" element={<PreviewComponent />} />
      <Route path="/admin" element={<AdminDashboard/>} />
      <Route path="/create-user" element={<CreateUserPage />} /> 
    </Routes>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Gangertabell from './pages/Gangertabell';
import Test from './pages/Test';
import Profile from './pages/Profile'
import { Login, Signup } from './components/UserCredentials';

function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/gangertabell" element={<Gangertabell />} />
          <Route path="/test" element={<Test />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Signup />} />
        </Routes>
      </Router>
    );
  }

export default App;

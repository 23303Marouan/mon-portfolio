import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Taches from './pages/Taches';
import Settings from './pages/Settings';
import LogIn from './pages/LogIn';

import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Settings />
        <header className="header">
          <nav className="nav">
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/">Blog</NavLink>
            <NavLink to="/taches">Taches</NavLink>
          </nav>
        </header>

        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Blog />} />
          <Route path="/taches" element={<Taches />} />
          <Route path="/login" element={<LogIn />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
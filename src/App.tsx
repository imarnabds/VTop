import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import DynamicModule from './pages/DynamicModule';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/module/:category/:submenu" element={<Layout><DynamicModule /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;

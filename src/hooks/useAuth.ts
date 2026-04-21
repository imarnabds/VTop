import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState<{ id: string; name: string; regNum?: string; sessionId?: string; } | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('vtop_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(100%)';
      toast.style.transition = 'all 0.3s ease-in';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  return { user, setUser, showToast };
};

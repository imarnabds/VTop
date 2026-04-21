import { Menu, Home, Bell, Star, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const { user } = useAuth();

  return (
    <header className="navbar" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '60px',
      backgroundColor: '#2f5fa7',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 1rem',
      color: 'white',
      zIndex: 1000,
      boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
    }}>
      {/* Left Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={toggleSidebar} 
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0.25rem' }}
        >
          <Menu size={24} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Mock Logo Box */}
          <div style={{ width: '32px', height: '32px', backgroundColor: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2f5fa7', fontWeight: 'bold' }}>
            V
          </div>
          <span style={{ fontWeight: 600, fontSize: '1.125rem', letterSpacing: '0.5px' }}>
            VIT-AP UNIVERSITY
          </span>
        </div>
      </div>

      {/* Center Section */}
      <div className="nav-center-icons" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, justifyContent: 'flex-start', paddingLeft: '2.5rem' }}>
        <Home size={20} className="nav-icon" style={{ cursor: 'pointer', opacity: 0.8 }} />
        <Bell size={20} className="nav-icon" style={{ cursor: 'pointer', opacity: 0.8 }} />
        <Star size={20} className="nav-icon" style={{ cursor: 'pointer', opacity: 0.8 }} />
        <button style={{ 
          background: 'rgba(255,255,255,0.1)', 
          border: '1px solid rgba(255,255,255,0.2)', 
          color: 'white', 
          padding: '6px 12px', 
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.875rem'
        }}>
          Quick Links <ChevronDown size={14} />
        </button>
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
        <div style={{ 
          width: '36px', height: '36px', 
          borderRadius: '50%', 
          backgroundColor: '#e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#2f5fa7', fontWeight: 'bold', fontSize: '1rem'
        }}>
          {user?.name?.charAt(0) || 'S'}
        </div>
        <div className="nav-profile-text" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {user?.regNum || '23BCE7782'} (STUDENT)
          </span>
          <ChevronDown size={14} />
        </div>
      </div>
    </header>
  );
}

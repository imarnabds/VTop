import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div style={{ display: 'flex', flex: 1, marginTop: '60px' }}>
        <Sidebar isOpen={isSidebarOpen} />
        
        <main 
          className="layout-main"
          style={{ 
            flex: 1, 
            marginLeft: isSidebarOpen ? '200px' : '60px',
            transition: 'margin-left 0.3s ease',
            padding: '2rem 2rem 2rem 1.5rem',
            backgroundColor: 'var(--bg-light)'
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

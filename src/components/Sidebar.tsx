import { 
  Phone, 
  Briefcase, 
  Info, 
  PawPrint, 
  Book, 
  GraduationCap, 
  Landmark, 
  BookMarked,
  Building,
  Plane,
  Award,
  Banknote,
  Home,
  Target,
  BookOpen,
  Shield,
  Trophy,
  Lock,
  LogOut,
  CircleDot,
  ChevronDown,
  Hourglass,
  FileText
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { logoutUser } from '../services/api';

interface SubItem {
  icon: React.ElementType;
  label: string;
  hasDropdown?: boolean;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  subItems?: SubItem[];
}

export default function Sidebar({ isOpen }: { isOpen?: boolean }) {
  const { setUser, showToast } = useAuth();
  const navigate = useNavigate();
  
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [hoverTop, setHoverTop] = useState<number>(0);

  const handleLogout = async () => {
    const storedUser = localStorage.getItem('vtop_user');
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        if (u.regNum && u.sessionId) {
          await logoutUser({ regNum: u.regNum, sessionId: u.sessionId });
        }
      } catch (err) {
        console.error('Logout API Error:', err);
      }
    }
    localStorage.removeItem('vtop_user');
    setUser(null);
    showToast('Logged out successfully.', 'success');
    navigate('/login');
  };

  const navItems: NavItem[] = [
    { 
      icon: Phone, 
      label: 'Contact Us',
      subItems: [
        { icon: Phone, label: 'Contact Us' }
      ]
    },
    { 
      icon: Briefcase, 
      label: 'My Info', 
      subItems: [
        { icon: CircleDot, label: 'Profile' },
        { icon: CircleDot, label: 'Anti-Ragging Affidavit' },
        { icon: CircleDot, label: 'Credentials' },
        { icon: Landmark, label: 'Virtual Account Number' },
        { icon: CircleDot, label: 'Acknowledgement View' },
        { icon: CircleDot, label: 'Student Bank Info' },
        { icon: CircleDot, label: 'My Scholarships' }
      ]
    },
    { 
      icon: Info, 
      label: 'Info Corner', 
      subItems: [
        { icon: CircleDot, label: 'FAQ' },
        { icon: Info, label: 'Biometric Log' },
        { icon: CircleDot, label: 'General' }
      ]
    },
    { 
      icon: PawPrint, 
      label: 'Mentor',
      subItems: [
        { icon: CircleDot, label: 'Mentor Details' },
        { icon: CircleDot, label: 'Mentor Message' }
      ]
    },
    { 
      icon: Book, 
      label: 'Course Enrollment',
      subItems: [
        { icon: Info, label: 'EXC Registration' },
        { icon: CircleDot, label: 'WishList' },
        { icon: CircleDot, label: 'WishList Registration Std' },
        { icon: CircleDot, label: 'Course Withdraw' },
        { icon: CircleDot, label: 'DYOD Registration' }
      ]
    },
    { 
      icon: GraduationCap, 
      label: 'Academics',
      active: true,
      subItems: [
        { icon: CircleDot, label: 'HOD and Dean Info' },
        { icon: CircleDot, label: 'Faculty Info' },
        { icon: CircleDot, label: 'Course Feedback 24x7' },
        { icon: CircleDot, label: 'Biometric Info' },
        { icon: CircleDot, label: 'Class Messages' },
        { icon: CircleDot, label: 'Regulation' },
        { icon: CircleDot, label: 'My Curriculum' },
        { icon: CircleDot, label: 'My Credits Distribution' },
        { icon: CircleDot, label: 'Credit Adjustment' },
        { icon: CircleDot, label: 'Minor/ Honour' },
        { icon: CircleDot, label: 'Time Table' },
        { icon: CircleDot, label: 'Course Option Change' },
        { icon: CircleDot, label: 'Class Attendance' },
        { icon: CircleDot, label: 'Course Page' },
        { icon: CircleDot, label: 'Industrial Internship' },
        { icon: CircleDot, label: 'Project' },
        { icon: CircleDot, label: 'Digital Assignment Upload' },
        { icon: CircleDot, label: 'QCM View' },
        { icon: CircleDot, label: 'Co-Extra Curricular' },
        { icon: CircleDot, label: 'Academics Calendar' },
        { icon: CircleDot, label: 'Registration Schedule & Allocation' },
        { icon: CircleDot, label: 'Apply NOC' },
        { icon: Info, label: 'ECS', hasDropdown: true }
      ]
    },
    { 
      icon: Landmark, 
      label: 'Research',
      subItems: [
        { icon: CircleDot, label: 'Major Equipment Details' },
        { icon: Info, label: 'Invigilation Duty Selection & View' },
        { icon: CircleDot, label: 'My Research Profile' },
        { icon: Banknote, label: 'Raman Research Award' },
        { icon: CircleDot, label: 'SEM Request' },
        { icon: CircleDot, label: 'Course Work Registration' },
        { icon: CircleDot, label: 'Registration Status' },
        { icon: CircleDot, label: 'Meeting info' },
        { icon: Hourglass, label: 'Biometric Attendance Info' },
        { icon: CircleDot, label: 'Research Std Leave Request' },
        { icon: FileText, label: 'Research Letters' },
        { icon: CircleDot, label: 'Electronic Thesis Submission' },
        { icon: CircleDot, label: 'Research Document Upload' },
        { icon: CircleDot, label: 'Under Graduate Research Reg' }
      ]
    },
    { 
      icon: BookMarked, 
      label: 'Examination',
      subItems: [
        { icon: CircleDot, label: 'Exam Schedule' },
        { icon: CircleDot, label: 'Marks' },
        { icon: CircleDot, label: 'Grades' },
        { icon: CircleDot, label: 'Paper See/Rev' },
        { icon: CircleDot, label: 'Grade History' },
        { icon: CircleDot, label: 'Project File Upload' },
        { icon: CircleDot, label: 'ECA File Upload' },
        { icon: CircleDot, label: 'EPT schedule' },
        { icon: CircleDot, label: 'Comprehensive', hasDropdown: true },
        { icon: CircleDot, label: 'Arrear/ReFAT Details', hasDropdown: true },
        { icon: CircleDot, label: 'Re-Exam Application' }
      ]
    },
    { 
      icon: Building, 
      label: 'Library',
      subItems: [
        { icon: CircleDot, label: 'Online Book Recommendation' }
      ]
    },
    { 
      icon: Plane, 
      label: 'Services',
      subItems: [
        { icon: CircleDot, label: 'Photo & 12th Marksheet Upload' },
        { icon: CircleDot, label: 'Facility Registration' },
        { icon: CircleDot, label: 'Transport Registration' },
        { icon: CircleDot, label: 'PAT Registration' },
        { icon: CircleDot, label: 'Upload Offer Letter' },
        { icon: CircleDot, label: 'Transcript Request' },
        { icon: CircleDot, label: 'Attendance Relaxation Form' },
        { icon: CircleDot, label: 'Financial Assistance Scholarship' },
        { icon: CircleDot, label: 'Achievements' },
        { icon: CircleDot, label: 'Programme Migration' },
        { icon: CircleDot, label: 'Late Hour Request' },
        { icon: CircleDot, label: 'Final Year Registration' },
        { icon: CircleDot, label: 'SAP Application', hasDropdown: true },
        { icon: CircleDot, label: 'Certificate Upload' },
        { icon: CircleDot, label: 'eSanad Request' }
      ]
    },
    { 
      icon: Award, 
      label: 'Bonafide & Demand Letter',
      subItems: [
        { icon: CircleDot, label: 'Apply No Due' },
        { icon: CircleDot, label: 'Apply Bonafide' },
        { icon: CircleDot, label: 'Apply Demand Letter' }
      ]
    },
    { 
      icon: Banknote, 
      label: 'Online Payments',
      subItems: [
        { icon: CircleDot, label: 'Payments' },
        { icon: CircleDot, label: 'Wallet Amount Add' },
        { icon: CircleDot, label: 'Payment Receipts' },
        { icon: CircleDot, label: 'Fees Intimation' },
        { icon: CircleDot, label: 'Online Transfer' }
      ]
    },
    { 
      icon: Home, 
      label: 'Hostels',
      subItems: [
        { icon: CircleDot, label: 'Hostel Wishlist Registration' },
        { icon: CircleDot, label: 'General Room Upgradation' },
        { icon: CircleDot, label: 'Weekend Outing' },
        { icon: CircleDot, label: 'General Outing' },
        { icon: CircleDot, label: 'Hostel Room Info 2024-25' },
        { icon: CircleDot, label: 'NCGPA RANK View 2025-26' },
        { icon: CircleDot, label: 'NCGPA Hostel Booking 2025-26' },
        { icon: CircleDot, label: 'NCGPA 2024-25 Consent Request' },
        { icon: CircleDot, label: 'Online Booking' }
      ]
    },
    { 
      icon: Target, 
      label: 'Feedback',
      subItems: [
        { icon: Info, label: 'Feedback Form' },
        { icon: CircleDot, label: 'Apply Complaint' },
        { icon: CircleDot, label: 'Mentor Feedback' },
        { icon: CircleDot, label: 'Staff Department Feedback' },
        { icon: CircleDot, label: 'General Feedback on VIT-AP' },
        { icon: Info, label: 'Student Satisfaction Survey (NAAC)' }
      ]
    },
    { 
      icon: BookOpen, 
      label: 'ASC FDP',
      subItems: [
        { icon: CircleDot, label: 'FDP Registration' },
        { icon: CircleDot, label: 'Participant Certificate' }
      ]
    },
    { 
      icon: Shield, 
      label: 'Events',
      subItems: [
        { icon: CircleDot, label: 'SixSigma Certificate' },
        { icon: CircleDot, label: 'University Day', hasDropdown: true },
        { icon: GraduationCap, label: 'Convocation', hasDropdown: true }
      ]
    },
    { 
      icon: Trophy, 
      label: 'SW Events',
      subItems: [
        { icon: CircleDot, label: 'Club/Chapter Enrollment' },
        { icon: CircleDot, label: 'Event Requisition' },
        { icon: CircleDot, label: 'Event Attendance' },
        { icon: CircleDot, label: 'Event Registration' }
      ]
    },
    { 
      icon: Lock, 
      label: 'My Account',
      subItems: [
        { icon: Lock, label: 'Change Password' },
        { icon: Lock, label: 'Update LoginID' }
      ]
    }
  ];

  return (
    <div 
      className="sidebar" 
      onMouseLeave={() => setHoveredIdx(null)}
      style={{
        position: 'fixed',
        top: '60px',
        left: 0,
        bottom: 0,
        width: '60px',
        backgroundColor: 'var(--bg-card-light)',
        borderRight: '1px solid var(--border-color)',
        zIndex: 900,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 5px rgba(0,0,0,0.05)'
      }}
    >
      <div style={{ flex: 1, padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto', overflowX: 'hidden' }}>
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isHovered = hoveredIdx === idx;

          return (
            <div 
              key={idx} 
              onMouseEnter={(e) => {
                setHoveredIdx(idx);
                
                const rect = e.currentTarget.getBoundingClientRect();
                const estimatedHeight = item.subItems ? (item.subItems.length * 40 + 50) : 0;
                const safeTop = Math.min(rect.top, window.innerHeight - Math.min(estimatedHeight, window.innerHeight - 80) - 20);
                setHoverTop(Math.max(70, safeTop));
              }}
              title={item.label}
              className={`sidebar-item ${item.active ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.6rem 1rem',
                gap: '0.75rem',
                cursor: 'pointer',
                color: item.active || isHovered ? 'var(--primary)' : 'var(--text-main)',
                backgroundColor: item.active || isHovered ? 'rgba(15, 98, 254, 0.05)' : 'transparent',
                borderLeft: item.active ? '3px solid var(--primary)' : '3px solid transparent',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} style={{ minWidth: '16px' }} />
            </div>
          );
        })}
      </div>

      <div style={{ padding: '1rem 0', borderTop: '1px solid var(--border-color)' }}>
        <div 
          onClick={handleLogout}
          title="Logout"
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.6rem 1rem',
            gap: '0.75rem',
            cursor: 'pointer',
            color: 'var(--error)',
            borderLeft: '3px solid transparent',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
        >
          <LogOut size={16} style={{ minWidth: '16px' }} />
        </div>
      </div>

      {hoveredIdx !== null && navItems[hoveredIdx].subItems && (
        <div 
          style={{
            position: 'fixed',
            top: hoverTop,
            left: '60px',
            width: '280px',
            maxHeight: 'calc(100vh - 80px)',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--bg-card-light)',
            borderTop: '1px solid var(--border-color)',
            borderRight: '1px solid var(--border-color)',
            borderBottom: '1px solid var(--border-color)',
            boxShadow: '4px 4px 15px rgba(0, 0, 0, 0.08)',
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px',
            zIndex: 1000,
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div style={{ 
            padding: '0.75rem 1rem', 
            borderBottom: '1px solid var(--border-color)', 
            fontWeight: 600, 
            color: 'var(--text-main)', 
            textAlign: 'center',
            backgroundColor: 'var(--bg-light)',
            fontSize: '0.9375rem',
            flexShrink: 0
          }}>
            {navItems[hoveredIdx].label}
          </div>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            padding: '0.5rem 0',
            overflowY: 'auto' 
          }}>
            {navItems[hoveredIdx].subItems?.map((sub, sIdx) => {
              const SubIcon = sub.icon;
              return (
                <div 
                  key={sIdx}
                  className="sidebar-item"
                  onClick={() => {
                    const categorySlug = navItems[hoveredIdx].label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    const sumbmenuSlug = sub.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    navigate(`/module/${categorySlug}/${sumbmenuSlug}`);
                    setHoveredIdx(null); // Close sidebar on click
                  }}
                  style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '0.6rem 1rem', 
                    gap: '1rem',
                    cursor: 'pointer', 
                    color: 'var(--text-main)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <SubIcon size={14} style={{ minWidth: '14px', opacity: 0.8 }} />
                    <span style={{ fontSize: '0.8125rem' }}>{sub.label}</span>
                  </div>
                  {sub.hasDropdown && (
                    <ChevronDown size={14} style={{ opacity: 0.5 }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

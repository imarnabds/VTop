import { Zap } from 'lucide-react';

interface SpotlightCardProps {
  badgeLabel: string;
  badgeCount?: number;
  message: string;
}

export default function SpotlightCard({ badgeLabel, badgeCount, message }: SpotlightCardProps) {
  return (
    <div className="spotlight-card fade-in" style={{
      backgroundColor: 'var(--bg-card-light)',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1rem',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer'
    }}>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{ 
          backgroundColor: 'var(--primary)', 
          color: 'white', 
          padding: '4px 8px', 
          borderRadius: '4px', 
          fontSize: '0.75rem', 
          fontWeight: 600,
          whiteSpace: 'nowrap'
        }}>
          {badgeLabel}
        </span>
        {badgeCount !== undefined && badgeCount > 0 && (
          <span style={{
            backgroundColor: 'var(--error)',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}>
            {badgeCount}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
        <Zap size={18} color="#f59e0b" style={{ fill: '#f59e0b' }} />
        <span style={{ fontSize: '0.9375rem', fontWeight: 500 }}>
          {message}
        </span>
      </div>
    </div>
  );
}

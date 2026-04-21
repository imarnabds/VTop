import SpotlightCard from './SpotlightCard';

export default function Dashboard() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0', width: '100%', animation: 'fadeIn 0.3s ease-in-out' }}>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--text-main)' }}>
        Spotlight
      </h1>

      <div>
        <SpotlightCard 
          badgeLabel="COE" 
          badgeCount={1} 
          message="Student Online Quiz URL 1 / Online Assessment Link 1" 
        />
        <SpotlightCard 
          badgeLabel="EVENT" 
          message="Registrations open for Annual Tech Fest 2026! Click here to register." 
        />
        <SpotlightCard 
          badgeLabel="EXAM" 
          badgeCount={3} 
          message="End Semester Examination schedule has been published." 
        />
        <SpotlightCard 
          badgeLabel="ADMIN" 
          message="Hostel fee payment deadline extended by one week." 
        />
      </div>
    </div>
  );
}

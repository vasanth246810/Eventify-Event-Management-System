import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  
  const navItems = [
    { id: 'dashboard', icon: '◈', label: 'Dashboard', path: '/admin/dashboard' },
    { id: 'users', icon: '◉', label: 'Users', path: '/admin/users' },
    { id: 'events', icon: '◆', label: 'Events', path: '/admin/events' },
    { id: 'bookings', icon: '◐', label: 'Bookings', path: '/admin/bookings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside style={{
      width: '250px',
      background: '#141619',
      borderRight: '1px solid #252830',
      position: 'fixed',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100
    }}>
      <div style={{ padding: '24px', borderBottom: '1px solid #252830' }}>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '18px',
          fontWeight: 700,
          color: '#ff2c55',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ animation: 'pulse 2s ease-in-out infinite' }}>◆</span>
          EventPro
        </div>
      </div>
      
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #252830' }}>
        <div style={{ fontWeight: 600, marginBottom: '4px' }}>Admin User</div>
        <div style={{
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          display: 'inline-block',
          padding: '2px 8px',
          background: '#ff2c55',
          borderRadius: '4px'
        }}>
          Superadmin
        </div>
      </div>
      
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {navItems.map(item => (
          <Link
            key={item.id}
            to={item.path}
            style={{
              padding: '12px 24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: isActive(item.path) ? '#ff2c55' : '#9ca3af',
              fontSize: '14px',
              fontWeight: 500,
              borderLeft: `3px solid ${isActive(item.path) ? '#ff2c55' : 'transparent'}`,
              background: isActive(item.path) ? '#1a1d21' : 'transparent',
              transition: 'all 0.2s',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.background = '#1a1d21';
                e.currentTarget.style.color = '#e8eaed';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#9ca3af';
              }
            }}
          >
            <span style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
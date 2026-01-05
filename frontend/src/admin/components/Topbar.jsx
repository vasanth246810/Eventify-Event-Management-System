export default function Topbar({ pageTitle, searchQuery, setSearchQuery, showAutocomplete, setShowAutocomplete, filteredData, showNotifications, setShowNotifications }) {
  return (
    <div style={{
      height: '72px',
      background: '#141619',
      borderBottom: '1px solid #252830',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 90
    }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px', margin: 0 }}>{pageTitle}</h1>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowAutocomplete(e.target.value.length > 0);
            }}
            placeholder="Search..."
            style={{
              width: '280px',
              padding: '10px 16px 10px 40px',
              background: '#0a0b0d',
              border: '1px solid #252830',
              borderRadius: '8px',
              color: '#e8eaed',
              fontSize: '14px',
              outline: 'none'
            }}
            onFocus={() => searchQuery && setShowAutocomplete(true)}
          />
          
          {showAutocomplete && filteredData.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#141619',
              border: '1px solid #252830',
              borderTop: 'none',
              borderRadius: '0 0 8px 8px',
              maxHeight: '300px',
              overflowY: 'auto',
              zIndex: 1000,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)'
            }}>
              {filteredData.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderBottom: idx < filteredData.length - 1 ? '1px solid #252830' : 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#1a1d21'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#9ca3af', letterSpacing: '0.5px' }}>
                    {item.category}
                  </div>
                  <div style={{ fontWeight: 600, marginTop: '4px' }}>{item.title}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          style={{
            position: 'relative',
            width: '40px',
            height: '40px',
            background: '#0a0b0d',
            border: '1px solid #252830',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <span>🔔</span>
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            width: '18px',
            height: '18px',
            background: '#ff3366',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700
          }}>
            5
          </span>
        </button>
      </div>
    </div>
  );
}

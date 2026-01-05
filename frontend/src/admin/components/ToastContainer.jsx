export default function ToastContainer({ toasts, setToasts }) {
  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };

  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      right: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      zIndex: 2000
    }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          style={{
            background: '#141619',
            border: '1px solid #252830',
            borderLeft: `4px solid ${toast.type === 'success' ? '#ff2c55' : toast.type === 'error' ? '#ff3366' : toast.type === 'warning' ? '#ffb800' : '#00d9ff'}`,
            borderRadius: '8px',
            padding: '16px 20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
            animation: 'slideInRight 0.3s',
            minWidth: '300px',
            maxWidth: '400px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}
        >
          <div style={{ fontSize: '20px' }}>{icons[toast.type] || icons.success}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>
              {toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}
            </div>
            <div style={{ fontSize: '13px', color: '#9ca3af' }}>{toast.message}</div>
          </div>
          <div
            onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            style={{ cursor: 'pointer', color: '#9ca3af', fontSize: '18px', lineHeight: 1 }}
          >
            ×
          </div>
        </div>
      ))}
    </div>
  );
}

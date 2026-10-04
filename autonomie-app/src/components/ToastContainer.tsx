import React from 'react';
import type { Toast } from '@/hooks/useToast';

interface Props {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<Props> = ({ toasts, onRemove }) => {
  const colors = {
    success: { bg: '#2d5016', border: '#4caf50', icon: '✓' },
    error: { bg: '#5a1f1f', border: '#f44336', icon: '✕' },
    warning: { bg: '#5a4a1f', border: '#ff9800', icon: '⚠' },
    info: { bg: '#1f3a5a', border: '#2196f3', icon: 'ℹ' },
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '400px',
    }}>
      {toasts.map((toast) => {
        const color = colors[toast.type];
        return (
          <div
            key={toast.id}
            style={{
              background: color.bg,
              border: `2px solid ${color.border}`,
              borderRadius: '6px',
              padding: '12px 16px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              animation: 'slideIn 0.3s ease-out',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{color.icon}</span>
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => onRemove(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '0',
                opacity: 0.7,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
            >
              ×
            </button>
          </div>
        );
      })}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          background: '#2a2a3e',
          borderRadius: '8px',
          margin: '20px',
          border: '1px solid #ff4444',
        }}>
          <h2 style={{ color: '#ff4444', margin: '0 0 10px 0' }}>⚠️ Fehler aufgetreten</h2>
          <p style={{ color: '#aaa', margin: '0 0 15px 0' }}>
            Ein unerwarteter Fehler ist aufgetreten. Bitte laden Sie die Seite neu.
          </p>
          <details style={{ color: '#888', fontSize: '0.85rem' }}>
            <summary>Fehlerdetails</summary>
            <pre style={{ marginTop: '10px', overflow: 'auto' }}>
              {this.state.error?.message}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              background: '#ffa500',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Seite neu laden
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

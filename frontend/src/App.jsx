import { useState } from 'react'
import LoanForm from './components/LoanForm'
import Dashboard from './components/Dashboard'
import './index.css'

const tabs = [
  { label: 'Loan Application', icon: '📋' },
  { label: 'Dashboard', icon: '📊' },
]

function App() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg)' }}>
      {/* Header */}
      <header style={{
        background: 'var(--c-surface)',
        borderBottom: '1px solid var(--c-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42,
              height: 42,
              background: 'var(--c-primary)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: '0.5px',
            }}>CW</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--c-text)', lineHeight: 1.2 }}>CreditWise</div>
              <div style={{ fontSize: 11, color: 'var(--c-text-muted)', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Loan Approval System</div>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: 4, background: 'var(--c-surface-alt)', borderRadius: 12, padding: 4 }}>
            {tabs.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 18px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: activeTab === i ? 'var(--c-surface)' : 'transparent',
                  color: activeTab === i ? 'var(--c-primary)' : 'var(--c-text-secondary)',
                  boxShadow: activeTab === i ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {activeTab === 0 ? <LoanForm /> : <Dashboard />}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '24px 16px', fontSize: 12, color: 'var(--c-text-muted)' }}>
        <span style={{ fontWeight: 600 }}>CreditWise</span> · ML Powered Loan Intelligence
      </footer>
    </div>
  )
}

export default App

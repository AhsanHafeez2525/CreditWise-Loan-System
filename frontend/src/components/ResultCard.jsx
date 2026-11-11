import { useEffect, useState } from 'react'

export default function ResultCard({ result }) {
  const [show, setShow] = useState(false)
  const [counted, setCounted] = useState(0)

  const approved = result.approved
  const confidence = (result.confidence * 100).toFixed(1)
  const probApproved = ((result.probability_approved || 0) * 100).toFixed(1)
  const probRejected = ((result.probability_rejected || 0) * 100).toFixed(1)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!show) return
    const target = parseFloat(confidence)
    let current = 0
    const interval = setInterval(() => {
      current += target / 30
      if (current >= target) {
        setCounted(target)
        clearInterval(interval)
      } else {
        setCounted(Math.round(current * 10) / 10)
      }
    }, 30)
    return () => clearInterval(interval)
  }, [show, confidence])

  const color = approved ? 'var(--c-green)' : 'var(--c-red)'
  const bgColor = approved ? 'var(--c-green-light)' : 'var(--c-red-light)'
  const borderColor = approved ? 'var(--c-green-border)' : 'var(--c-red-border)'

  return (
    <div style={{
      borderRadius: 16,
      border: `2px solid ${borderColor}`,
      background: bgColor,
      overflow: 'hidden',
      opacity: show ? 1 : 0,
      transform: show ? 'translateY(0)' : 'translateY(16px)',
      transition: 'all 0.5s ease-out',
    }}>
      {/* Top accent bar */}
      <div style={{ height: 4, background: color }} />

      <div style={{ padding: 28, textAlign: 'center' }}>
        {/* Icon */}
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: color, color: '#fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 12,
          transform: show ? 'scale(1)' : 'scale(0)',
          transition: 'transform 0.5s ease-out 0.2s',
        }}>
          {approved ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        {/* Status Label */}
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color, marginBottom: 2 }}>
          Prediction
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color }}>
          Loan {approved ? 'Approved' : 'Rejected'}
        </div>

        {/* Confidence */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--c-text-muted)', marginBottom: 4 }}>
            Confidence Score
          </div>
          <div style={{ fontSize: 42, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
            {counted.toFixed(1)}<span style={{ fontSize: 22 }}>%</span>
          </div>

          {/* Progress bar */}
          <div style={{
            width: '100%', height: 8, background: '#e2e8f0',
            borderRadius: 4, marginTop: 12, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              borderRadius: 4,
              background: color,
              width: show ? `${confidence}%` : '0%',
              transition: 'width 1s ease-out 0.3s',
            }} />
          </div>
        </div>

        {/* Probability Split */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
          marginTop: 20,
        }}>
          <div style={{
            padding: '12px 8px', background: 'rgba(255,255,255,0.7)',
            borderRadius: 10, textAlign: 'center',
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--c-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Approval
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--c-green)', marginTop: 2 }}>
              {probApproved}%
            </div>
          </div>
          <div style={{
            padding: '12px 8px', background: 'rgba(255,255,255,0.7)',
            borderRadius: 10, textAlign: 'center',
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--c-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Rejection
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--c-red)', marginTop: 2 }}>
              {probRejected}%
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, fontSize: 12, color: 'var(--c-text-secondary)', lineHeight: 1.5 }}>
          {approved
            ? 'This application meets the approval criteria based on ML model analysis.'
            : 'This application does not meet the criteria. Consider improving credit score or reducing debt.'}
        </div>
      </div>
    </div>
  )
}

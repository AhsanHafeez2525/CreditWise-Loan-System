import { useState } from 'react'
import axios from 'axios'
import ResultCard from './ResultCard'

const initialForm = {
  Applicant_Income: '',
  Coapplicant_Income: '',
  Employment_Status: 'Salaried',
  Age: '',
  Marital_Status: 'Single',
  Dependents: '0',
  Credit_Score: '',
  Existing_Loans: '0',
  DTI_Ratio: '',
  Savings: '',
  Collateral_Value: '',
  Loan_Amount: '',
  Loan_Term: '',
  Loan_Purpose: 'Personal',
  Property_Area: 'Urban',
  Education_Level: 'Graduate',
  Gender: 'Male',
  Employer_Category: 'Private',
}

const fieldGroups = [
  {
    title: 'Personal Information',
    icon: '👤',
    fields: [
      { name: 'Age', label: 'Age', type: 'number', placeholder: '32', suffix: 'yrs' },
      { name: 'Gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] },
      { name: 'Marital_Status', label: 'Marital Status', type: 'select', options: ['Married', 'Single'] },
      { name: 'Dependents', label: 'Dependents', type: 'number', placeholder: '0' },
      { name: 'Education_Level', label: 'Education', type: 'select', options: ['Graduate', 'Postgraduate', 'Not Graduate'] },
    ],
  },
  {
    title: 'Employment & Income',
    icon: '💼',
    fields: [
      { name: 'Employment_Status', label: 'Employment', type: 'select', options: ['Salaried', 'Self-Employed', 'Business'] },
      { name: 'Employer_Category', label: 'Employer Type', type: 'select', options: ['Government', 'Private', 'Self'] },
      { name: 'Applicant_Income', label: 'Monthly Income', type: 'number', placeholder: '45000', prefix: '₹' },
      { name: 'Coapplicant_Income', label: 'Co-applicant Income', type: 'number', placeholder: '15000', prefix: '₹' },
    ],
  },
  {
    title: 'Financial Health',
    icon: '📈',
    fields: [
      { name: 'Credit_Score', label: 'Credit Score', type: 'number', placeholder: '720' },
      { name: 'Existing_Loans', label: 'Existing Loans', type: 'number', placeholder: '0' },
      { name: 'DTI_Ratio', label: 'DTI Ratio', type: 'number', step: '0.01', placeholder: '0.35' },
      { name: 'Savings', label: 'Savings Balance', type: 'number', placeholder: '50000', prefix: '₹' },
    ],
  },
  {
    title: 'Loan Details',
    icon: '🏦',
    fields: [
      { name: 'Loan_Amount', label: 'Loan Amount', type: 'number', placeholder: '500000', prefix: '₹' },
      { name: 'Loan_Term', label: 'Loan Term', type: 'number', placeholder: '60', suffix: 'months' },
      { name: 'Loan_Purpose', label: 'Purpose', type: 'select', options: ['Home', 'Education', 'Personal', 'Business', 'Car'] },
      { name: 'Property_Area', label: 'Property Area', type: 'select', options: ['Urban', 'Semiurban', 'Rural'] },
      { name: 'Collateral_Value', label: 'Collateral Value', type: 'number', placeholder: '800000', prefix: '₹' },
    ],
  },
]

const allFields = fieldGroups.flatMap(g => g.fields)

const styles = {
  card: {
    background: 'var(--c-surface)',
    borderRadius: 16,
    border: '1px solid var(--c-border)',
    overflow: 'hidden',
    animation: 'fadeUp 0.4s ease-out both',
  },
  cardHeader: {
    padding: '14px 20px',
    background: 'var(--c-surface-alt)',
    borderBottom: '1px solid var(--c-border-light)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  cardHeaderText: {
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--c-text)',
  },
  cardBody: {
    padding: 20,
  },
  fieldGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 16,
  },
  label: {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--c-text-secondary)',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1.5px solid var(--c-border)',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--c-text)',
    background: 'var(--c-surface)',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1.5px solid var(--c-border)',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--c-text)',
    background: 'var(--c-surface)',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M2 4l4 4 4-4'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    paddingRight: 32,
  },
  submitBtn: {
    flex: 1,
    padding: '14px 24px',
    background: 'var(--c-primary)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  },
  resetBtn: {
    padding: '14px 20px',
    background: 'transparent',
    color: 'var(--c-text-secondary)',
    border: '1.5px solid var(--c-border)',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
}

export default function LoanForm() {
  const [form, setForm] = useState(initialForm)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [focusField, setFocusField] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const payload = {}
      for (const key of Object.keys(form)) {
        const field = allFields.find(f => f.name === key)
        payload[key] = field && field.type === 'number' ? parseFloat(form[key]) : form[key]
      }
      const res = await axios.post('http://localhost:8000/predict', payload)
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to connect to server. Make sure the backend is running on port 8000.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setForm(initialForm)
    setResult(null)
    setError(null)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28, alignItems: 'start' }}>
      {/* Left: Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {fieldGroups.map((group, gi) => (
            <div key={group.title} style={{ ...styles.card, animationDelay: `${gi * 0.08}s` }}>
              <div style={styles.cardHeader}>
                <span style={{ fontSize: 16 }}>{group.icon}</span>
                <span style={styles.cardHeaderText}>{group.title}</span>
              </div>
              <div style={styles.cardBody}>
                <div style={styles.fieldGrid}>
                  {group.fields.map(field => (
                    <div key={field.name}>
                      <label style={styles.label}>{field.label}</label>
                      {field.type === 'select' ? (
                        <select
                          name={field.name}
                          value={form[field.name]}
                          onChange={handleChange}
                          style={{
                            ...styles.select,
                            borderColor: focusField === field.name ? 'var(--c-primary)' : 'var(--c-border)',
                            boxShadow: focusField === field.name ? '0 0 0 3px var(--c-primary-light)' : 'none',
                          }}
                          onFocus={() => setFocusField(field.name)}
                          onBlur={() => setFocusField(null)}
                        >
                          {field.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <div style={{ position: 'relative' }}>
                          {field.prefix && (
                            <span style={{
                              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                              color: 'var(--c-text-muted)', fontSize: 14, fontWeight: 600, pointerEvents: 'none',
                            }}>{field.prefix}</span>
                          )}
                          <input
                            type="number"
                            name={field.name}
                            value={form[field.name]}
                            onChange={handleChange}
                            step={field.step || '1'}
                            required
                            placeholder={field.placeholder}
                            style={{
                              ...styles.input,
                              paddingLeft: field.prefix ? 28 : 12,
                              paddingRight: field.suffix ? 50 : 12,
                              borderColor: focusField === field.name ? 'var(--c-primary)' : 'var(--c-border)',
                              boxShadow: focusField === field.name ? '0 0 0 3px var(--c-primary-light)' : 'none',
                            }}
                            onFocus={() => setFocusField(field.name)}
                            onBlur={() => setFocusField(null)}
                          />
                          {field.suffix && (
                            <span style={{
                              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                              color: 'var(--c-text-muted)', fontSize: 11, fontWeight: 600, pointerEvents: 'none',
                            }}>{field.suffix}</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={e => { if (!loading) e.target.style.background = 'var(--c-primary-hover)' }}
            onMouseLeave={e => e.target.style.background = 'var(--c-primary)'}
          >
            {loading ? '⏳ Analyzing...' : '🔍 Check Loan Eligibility'}
          </button>
          <button type="button" onClick={handleReset} style={styles.resetBtn}>
            Reset
          </button>
        </div>
      </form>

      {/* Right: Result Panel */}
      <div style={{ position: 'sticky', top: 90 }}>
        {result ? (
          <ResultCard result={result} />
        ) : (
          <div style={{
            ...styles.card,
            padding: 32,
            textAlign: 'center',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'var(--c-primary-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: 24,
            }}>📋</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--c-text)', marginBottom: 6 }}>
              Prediction Result
            </div>
            <div style={{ fontSize: 13, color: 'var(--c-text-muted)', lineHeight: 1.5 }}>
              Fill the form and submit to see the ML model's prediction here.
            </div>

            <div style={{ marginTop: 24, textAlign: 'left' }}>
              {['Credit Score', 'Monthly Income', 'DTI Ratio', 'Collateral'].map(f => (
                <div key={f} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: '1px dashed var(--c-border-light)',
                  fontSize: 12, color: 'var(--c-text-muted)',
                }}>
                  <span>{f}</span>
                  <span style={{ color: 'var(--c-border)' }}>---</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div style={{
            marginTop: 16, padding: 16,
            background: 'var(--c-red-light)',
            border: '1px solid var(--c-red-border)',
            borderRadius: 12,
            color: 'var(--c-red)',
            fontSize: 13, fontWeight: 500,
            display: 'flex', alignItems: 'flex-start', gap: 8,
          }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* How it works */}
        <div style={{
          marginTop: 16,
          padding: 20,
          background: 'var(--c-primary-light)',
          borderRadius: 14,
          border: '1px solid var(--c-primary-subtle)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--c-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 14 }}>
            How it works
          </div>
          {[
            'Enter applicant details',
            'AI analyzes 28+ features',
            'Random Forest model predicts',
            'Get instant decision',
          ].map((text, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < 3 ? 10 : 0 }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: 'var(--c-primary)', color: '#fff',
                fontSize: 11, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>{i + 1}</div>
              <span style={{ fontSize: 12, color: 'var(--c-primary)', fontWeight: 500 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

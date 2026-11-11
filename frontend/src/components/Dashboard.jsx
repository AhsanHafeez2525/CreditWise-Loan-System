import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'

const COLORS = {
  green: '#059669',
  red: '#dc2626',
  blue: '#2563eb',
  purple: '#7c3aed',
  gray: '#94a3b8',
}

const approvalData = [
  { name: 'Rejected', value: 652, color: COLORS.red },
  { name: 'Approved', value: 298, color: COLORS.green },
]

const incomeByApproval = [
  { range: '0-5K', Approved: 45, Rejected: 120 },
  { range: '5K-10K', Approved: 68, Rejected: 145 },
  { range: '10K-15K', Approved: 72, Rejected: 130 },
  { range: '15K-20K', Approved: 58, Rejected: 125 },
  { range: '20K+', Approved: 55, Rejected: 132 },
]

const creditScoreData = [
  { range: '< 500', Approved: 12, Rejected: 83 },
  { range: '500-600', Approved: 38, Rejected: 172 },
  { range: '600-700', Approved: 105, Rejected: 245 },
  { range: '700-800', Approved: 98, Rejected: 112 },
  { range: '800+', Approved: 45, Rejected: 40 },
]

const loanPurposeData = [
  { purpose: 'Personal', Approved: 85, Rejected: 180 },
  { purpose: 'Home', Approved: 72, Rejected: 150 },
  { purpose: 'Business', Approved: 58, Rejected: 130 },
  { purpose: 'Education', Approved: 45, Rejected: 102 },
  { purpose: 'Car', Approved: 38, Rejected: 90 },
]

const modelPerformance = [
  { metric: 'Accuracy', 'Logistic Reg.': 0.78, 'Random Forest': 0.85, SVM: 0.80 },
  { metric: 'Precision', 'Logistic Reg.': 0.72, 'Random Forest': 0.82, SVM: 0.76 },
  { metric: 'Recall', 'Logistic Reg.': 0.65, 'Random Forest': 0.79, SVM: 0.71 },
  { metric: 'F1 Score', 'Logistic Reg.': 0.68, 'Random Forest': 0.80, SVM: 0.73 },
  { metric: 'ROC AUC', 'Logistic Reg.': 0.81, 'Random Forest': 0.88, SVM: 0.83 },
]

const featureImportance = [
  { feature: 'Credit Score', importance: 0.18 },
  { feature: 'DTI Ratio', importance: 0.14 },
  { feature: 'Income/Loan', importance: 0.12 },
  { feature: 'Collateral', importance: 0.10 },
  { feature: 'Total Income', importance: 0.09 },
  { feature: 'Savings/Loan', importance: 0.08 },
  { feature: 'EMI/Income', importance: 0.07 },
  { feature: 'Existing Loans', importance: 0.06 },
].reverse()

const radarData = [
  { metric: 'Accuracy', score: 85 },
  { metric: 'Precision', score: 82 },
  { metric: 'Recall', score: 79 },
  { metric: 'F1', score: 80 },
  { metric: 'AUC', score: 88 },
]

const stats = [
  { label: 'Total Applications', value: '950', sub: 'After cleaning', accent: COLORS.blue },
  { label: 'Approval Rate', value: '31.4%', sub: '298 approved', accent: COLORS.green },
  { label: 'Best Model', value: 'Random Forest', sub: 'F1: 0.80', accent: COLORS.purple },
  { label: 'Features Used', value: '28+', sub: 'After engineering', accent: COLORS.blue },
]

const cardStyle = {
  background: 'var(--c-surface)',
  borderRadius: 14,
  border: '1px solid var(--c-border)',
  overflow: 'hidden',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--c-surface)',
      borderRadius: 10,
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      border: '1px solid var(--c-border)',
      padding: '10px 14px',
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--c-text)', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 11, color: p.color, display: 'flex', gap: 6, alignItems: 'center' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ fontWeight: 600 }}>{p.name}:</span>
          <span>{typeof p.value === 'number' && p.value < 1 ? (p.value * 100).toFixed(0) + '%' : p.value}</span>
        </div>
      ))}
    </div>
  )
}

function ChartCard({ title, subtitle, children, span = 1 }) {
  return (
    <div style={{ ...cardStyle, gridColumn: span > 1 ? `span ${span}` : undefined }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--c-border-light)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-text)' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: 'var(--c-text-muted)', marginTop: 2 }}>{subtitle}</div>}
      </div>
      <div style={{ padding: 16 }}>
        {children}
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--c-text)' }}>Analytics Dashboard</h2>
        <p style={{ fontSize: 13, color: 'var(--c-text-muted)', marginTop: 4 }}>Exploratory Data Analysis & Model Performance</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {stats.map(stat => (
          <div key={stat.label} style={{
            ...cardStyle,
            padding: '18px 20px',
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--c-text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
              {stat.label}
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: stat.accent, marginTop: 6, lineHeight: 1 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--c-text-muted)', marginTop: 6 }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Row 1: Pie + Credit Score */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <ChartCard title="Loan Approval Distribution" subtitle="Target variable breakdown">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={approvalData} cx="50%" cy="50%" innerRadius={65} outerRadius={100}
                paddingAngle={3} dataKey="value" stroke="none"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {approvalData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Credit Score vs Approval" subtitle="Higher scores correlate with approval">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={creditScoreData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Approved" fill={COLORS.green} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Rejected" fill={COLORS.red} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2: Income Area + Loan Purpose */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <ChartCard title="Income Distribution" subtitle="Monthly income ranges by approval">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={incomeByApproval}>
              <defs>
                <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.green} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={COLORS.green} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.red} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={COLORS.red} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="Approved" stroke={COLORS.green} fill="url(#gA)" strokeWidth={2} />
              <Area type="monotone" dataKey="Rejected" stroke={COLORS.red} fill="url(#gR)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Loan Purpose vs Approval" subtitle="Approval rate by loan type">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={loanPurposeData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="purpose" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Approved" fill={COLORS.green} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Rejected" fill={COLORS.red} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 3: Feature Importance + Radar */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <ChartCard title="Feature Importance" subtitle="Random Forest — top contributing features">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={featureImportance} layout="vertical" barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
              <YAxis type="category" dataKey="feature" tick={{ fontSize: 11, fill: '#64748b' }} width={100} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="importance" fill={COLORS.blue} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Model Radar" subtitle="Random Forest scores">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="65%">
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#64748b' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: '#94a3b8' }} />
              <Radar name="Score" dataKey="score" stroke={COLORS.blue} fill={COLORS.blue} fillOpacity={0.2} strokeWidth={2} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 4: Model Comparison */}
      <ChartCard title="Model Comparison" subtitle="Performance metrics across all trained models">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={modelPerformance} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="metric" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
              domain={[0.5, 1]} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Logistic Reg." fill={COLORS.gray} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Random Forest" fill={COLORS.blue} radius={[4, 4, 0, 0]} />
            <Bar dataKey="SVM" fill={COLORS.purple} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}

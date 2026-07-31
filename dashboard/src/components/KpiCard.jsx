export default function KpiCard({ label, value, unit, sub, rate }) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">
        <span className="num">{value}</span>
        {unit ? <span className="unit">{unit}</span> : null}
      </div>
      {sub ? <div className="kpi-sub" dangerouslySetInnerHTML={{ __html: sub }} /> : null}
      {typeof rate === 'number' ? (
        <div className="kpi-bar">
          <span style={{ width: `${Math.min(100, Math.max(0, rate))}%` }} />
        </div>
      ) : null}
    </div>
  )
}

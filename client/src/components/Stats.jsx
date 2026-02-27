import './Stats.css'

function Stats({ stats }) {
  if (!stats) return null

  return (
    <div className="stats">
      <h3 className="stats-title">📊 Conversion Statistics</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalConversions}</div>
          <div className="stat-label">Total Conversions</div>
        </div>
        <div className="stat-card success">
          <div className="stat-value">{stats.successfulConversions}</div>
          <div className="stat-label">Successful</div>
        </div>
        <div className="stat-card pdf">
          <div className="stat-value">{stats.pdfToDocx}</div>
          <div className="stat-label">PDF → Word</div>
        </div>
        <div className="stat-card docx">
          <div className="stat-value">{stats.docxToPdf}</div>
          <div className="stat-label">Word → PDF</div>
        </div>
      </div>
      {stats.lastConversionTime && (
        <p className="last-conversion">
          Last conversion: {new Date(stats.lastConversionTime).toLocaleString()}
        </p>
      )}
    </div>
  )
}

export default Stats

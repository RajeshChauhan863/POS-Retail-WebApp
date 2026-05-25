import { useState, useMemo } from 'react'

const reportTypes = [
  { id: 'sales', label: 'Sales Report', icon: '📊' },
  { id: 'inventory', label: 'Inventory Report', icon: '📦' },
  { id: 'customers', label: 'Customer Report', icon: '👥' },
  { id: 'products', label: 'Product Performance', icon: '⭐' },
]

const sampleSalesData = [
  {
    id: 1,
    date: '2024-05-10',
    transactions: 24,
    totalSales: 8650,
    avgTransaction: 360,
    topProduct: 'Premium Coffee Beans',
  },
  {
    id: 2,
    date: '2024-05-09',
    transactions: 18,
    totalSales: 6240,
    avgTransaction: 346,
    topProduct: 'Whole Wheat Bread',
  },
  {
    id: 3,
    date: '2024-05-08',
    transactions: 31,
    totalSales: 10890,
    avgTransaction: 351,
    topProduct: 'Organic Almonds',
  },
  {
    id: 4,
    date: '2024-05-07',
    transactions: 22,
    totalSales: 7560,
    avgTransaction: 343,
    topProduct: 'Premium Coffee Beans',
  },
  {
    id: 5,
    date: '2024-05-06',
    transactions: 28,
    totalSales: 9450,
    avgTransaction: 337,
    topProduct: 'Soft Drink',
  },
]

const sampleInventoryData = [
  { id: 1, sku: 'CF-1001', product: 'Premium Coffee Beans 1kg', stock: 58, value: 28942, movement: '+12' },
  { id: 2, sku: 'BR-2030', product: 'Whole Wheat Bread Loaf', stock: 14, value: 1120, movement: '-8' },
  { id: 3, sku: 'AL-3090', product: 'Organic Almonds 500g', stock: 9, value: 6291, movement: '-15' },
  { id: 4, sku: 'SD-1040', product: 'Soft Drink 750ml', stock: 0, value: 0, movement: 'OUT' },
]

const sampleProductData = [
  { id: 1, product: 'Premium Coffee Beans', sales: 156, revenue: 77844, rating: '4.8' },
  { id: 2, product: 'Whole Wheat Bread', sales: 243, revenue: 19440, rating: '4.6' },
  { id: 3, product: 'Organic Almonds', sales: 89, revenue: 62211, rating: '4.9' },
  { id: 4, product: 'Soft Drink', sales: 67, revenue: 3685, rating: '4.2' },
]

function formatINR(value) {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value)
  } catch {
    return `₹${value}`
  }
}

function StatCard({ label, value, trend, icon }) {
  const isPositive = trend && !trend.startsWith('-')
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {trend && (
          <div className={`stat-trend ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '↑' : '↓'} {trend}
          </div>
        )}
      </div>
    </div>
  )
}

function Chart({ title, bars, height = 200 }) {
  const maxValue = Math.max(...bars.map((b) => b.value))
  return (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <div className="chart" style={{ minHeight: `${height}px` }}>
        {bars.map((bar, idx) => (
          <div key={idx} className="bar-group">
            <div
              className="bar"
              style={{
                height: `${(bar.value / maxValue) * (height - 40)}px`,
              }}
              title={`${bar.label}: ${bar.value}`}
            >
              <span className="bar-value">{bar.value}</span>
            </div>
            <span className="bar-label">{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Reports() {
  const [activeReport, setActiveReport] = useState('sales')
  const [dateRange, setDateRange] = useState('week')
  const [exportFormat, setExportFormat] = useState('pdf')

  const metrics = useMemo(() => {
    const total = sampleSalesData.reduce((sum, d) => sum + d.totalSales, 0)
    const transactions = sampleSalesData.reduce((sum, d) => sum + d.transactions, 0)
    const avg = Math.round(total / transactions)
    const prevTotal = total * 0.92 // Simulated previous period

    return {
      totalSales: total,
      totalTransactions: transactions,
      avgTransaction: avg,
      salesTrend: `+${Math.round(((total - prevTotal) / prevTotal) * 100)}%`,
      transactionTrend: '+8%',
    }
  }, [])

  const chartData = useMemo(() => {
    return sampleSalesData
      .slice()
      .reverse()
      .map((d) => ({
        label: d.date.split('-')[2],
        value: d.totalSales,
      }))
  }, [])

  function handleExport() {
    alert(
      `Exporting ${activeReport} report as ${exportFormat.toUpperCase()}...`,
    )
  }

  return (
    <div className="reports-container">
      {/* Report Type Selector */}
      <div className="reports-selector">
        <div className="selector-scroll">
          {reportTypes.map((type) => (
            <button
              key={type.id}
              className={`selector-btn${activeReport === type.id ? ' is-active' : ''}`}
              onClick={() => setActiveReport(type.id)}
            >
              <span className="selector-icon">{type.icon}</span>
              <span className="selector-label">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="reports-controls">
        <div className="control-group">
          <label htmlFor="date-range">Date Range:</label>
          <select
            id="date-range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="control-select"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="export-format">Export As:</label>
          <select
            id="export-format"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="control-select"
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="csv">CSV</option>
          </select>
        </div>

        <button className="btn-primary" onClick={handleExport}>
          📥 Export Report
        </button>
      </div>

      {/* Sales Report */}
      {activeReport === 'sales' && (
        <div className="report-section">
          {/* Metrics Cards */}
          <div className="metrics-grid">
            <StatCard
              label="Total Sales"
              value={formatINR(metrics.totalSales)}
              trend={metrics.salesTrend}
              icon="💰"
            />
            <StatCard
              label="Transactions"
              value={metrics.totalTransactions}
              trend={metrics.transactionTrend}
              icon="🧾"
            />
            <StatCard
              label="Avg. Transaction"
              value={formatINR(metrics.avgTransaction)}
              trend="+2%"
              icon="📈"
            />
            <StatCard
              label="Customers"
              value={metrics.totalTransactions}
              trend="+12%"
              icon="👤"
            />
          </div>

          {/* Charts */}
          <div className="charts-row">
            <div className="chart-card">
              <Chart
                title="Daily Sales"
                bars={chartData}
                height={250}
              />
            </div>
            <div className="chart-card">
              <Chart
                title="Sales by Category"
                bars={[
                  { label: 'Grocery', value: 3200 },
                  { label: 'Bakery', value: 2100 },
                  { label: 'Beverages', value: 1800 },
                  { label: 'Dry Fruits', value: 2550 },
                ]}
                height={250}
              />
            </div>
          </div>

          {/* Data Table */}
          <div className="table-card">
            <h3 className="table-title">Sales by Day</h3>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Transactions</th>
                    <th>Total Sales</th>
                    <th>Avg. Transaction</th>
                    <th>Top Product</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleSalesData.map((row) => (
                    <tr key={row.id}>
                      <td className="date-cell">{row.date}</td>
                      <td className="number-cell">{row.transactions}</td>
                      <td className="currency-cell">
                        {formatINR(row.totalSales)}
                      </td>
                      <td className="currency-cell">
                        {formatINR(row.avgTransaction)}
                      </td>
                      <td>{row.topProduct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Report */}
      {activeReport === 'inventory' && (
        <div className="report-section">
          <div className="metrics-grid">
            <StatCard
              label="Total Items"
              value="81"
              trend="-5"
              icon="📦"
            />
            <StatCard
              label="Inventory Value"
              value={formatINR(36353)}
              trend="-8%"
              icon="💵"
            />
            <StatCard
              label="Out of Stock"
              value="1"
              trend="0"
              icon="⚠️"
            />
            <StatCard
              label="Low Stock Items"
              value="2"
              trend="+1"
              icon="📉"
            />
          </div>

          <div className="table-card">
            <h3 className="table-title">Inventory Status</h3>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Product</th>
                    <th>Stock</th>
                    <th>Inventory Value</th>
                    <th>Movement</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleInventoryData.map((row) => (
                    <tr key={row.id}>
                      <td className="code-cell">{row.sku}</td>
                      <td>{row.product}</td>
                      <td className="number-cell">
                        <span
                          className={`stock-badge${row.stock === 0 ? ' out-of-stock' : row.stock <= 10 ? ' low-stock' : ''}`}
                        >
                          {row.stock}
                        </span>
                      </td>
                      <td className="currency-cell">
                        {formatINR(row.value)}
                      </td>
                      <td
                        className={`movement-cell${row.movement === 'OUT' ? ' out-of-stock' : row.movement.startsWith('-') ? ' negative' : ' positive'}`}
                      >
                        {row.movement}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Product Performance Report */}
      {activeReport === 'products' && (
        <div className="report-section">
          <div className="metrics-grid">
            <StatCard
              label="Total Product Sales"
              value="555"
              trend="+18%"
              icon="🛍️"
            />
            <StatCard
              label="Revenue"
              value={formatINR(163590)}
              trend="+24%"
              icon="💰"
            />
            <StatCard
              label="Avg. Rating"
              value="4.6"
              trend="+0.2"
              icon="⭐"
            />
            <StatCard
              label="Product Categories"
              value="4"
              trend="0"
              icon="🏷️"
            />
          </div>

          <div className="table-card">
            <h3 className="table-title">Top Performing Products</h3>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Sales Units</th>
                    <th>Revenue</th>
                    <th>Rating</th>
                    <th>Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleProductData.map((row) => (
                    <tr key={row.id}>
                      <td>{row.product}</td>
                      <td className="number-cell">{row.sales}</td>
                      <td className="currency-cell">
                        {formatINR(row.revenue)}
                      </td>
                      <td className="rating-cell">
                        <span className="rating-badge">
                          {row.rating} ⭐
                        </span>
                      </td>
                      <td className="progress-cell">
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${Math.random() * 100}%`,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Customer Report */}
      {activeReport === 'customers' && (
        <div className="report-section">
          <div className="metrics-grid">
            <StatCard
              label="Total Customers"
              value={metrics.totalTransactions}
              trend="+22%"
              icon="👥"
            />
            <StatCard
              label="Repeat Customers"
              value={Math.round(metrics.totalTransactions * 0.35)}
              trend="+8%"
              icon="🔄"
            />
            <StatCard
              label="New Customers"
              value={Math.round(metrics.totalTransactions * 0.65)}
              trend="+35%"
              icon="🆕"
            />
            <StatCard
              label="Avg. Customer Value"
              value={formatINR(Math.round(metrics.totalSales / metrics.totalTransactions))}
              trend="+5%"
              icon="💎"
            />
          </div>

          <div className="charts-row">
            <div className="chart-card">
              <Chart
                title="Customer Growth"
                bars={[
                  { label: 'Week 1', value: 28 },
                  { label: 'Week 2', value: 35 },
                  { label: 'Week 3', value: 31 },
                  { label: 'Week 4', value: 38 },
                ]}
                height={250}
              />
            </div>
            <div className="chart-card">
              <Chart
                title="Customer Segment"
                bars={[
                  { label: 'Premium', value: 24 },
                  { label: 'Regular', value: 58 },
                  { label: 'Casual', value: 50 },
                ]}
                height={250}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'

const initialCustomers = [
  {
    id: 'c1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    address: '123 Main St, Mumbai, Maharashtra',
    status: 'Active',
  },
  {
    id: 'c2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+91 9876543211',
    address: '456 Elm St, Delhi, NCR',
    status: 'Active',
  },
  {
    id: 'c3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    phone: '+91 9876543212',
    address: '789 Oak St, Bangalore, Karnataka',
    status: 'Inactive',
  },
  {
    id: 'c4',
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    phone: '+91 9876543213',
    address: '321 Pine St, Chennai, Tamil Nadu',
    status: 'Active',
  },
]

function Dialog({ title, open, onClose, children }) {
  if (!open) return null
  return (
    <div className="dialog-backdrop" role="presentation" onClick={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dialog-header">
          <div className="dialog-title">{title}</div>
          <button type="button" className="icon-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="dialog-body">{children}</div>
      </div>
    </div>
  )
}

export default function Customers() {
  const [customers, setCustomers] = useState(initialCustomers)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [draft, setDraft] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'Active',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    try {
      const response = await fetch('https://localhost:7240/api/customer')
      if (!response.ok) {
        throw new Error('Failed to load customers')
      }
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      console.error('Error loading customers:', error)
      // Keep initial data as fallback
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return customers.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [customers, query, statusFilter])

  const totals = useMemo(() => {
    const total = customers.length
    const active = customers.filter((c) => c.status === 'Active').length
    const inactive = customers.filter((c) => c.status === 'Inactive').length
    return { total, active, inactive }
  }, [customers])

  function openAdd() {
    setDraft({
      name: '',
      email: '',
      phone: '',
      address: '',
      status: 'Active',
    })
    setIsAddOpen(true)
  }

  async function saveDraft() {
    const name = draft.name.trim()
    const email = draft.email.trim()
    const phone = draft.phone.trim()
    const address = draft.address.trim()

    if (!name || !email || !phone || !address) {
      setSaveError('Please fill in all required fields.')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setSaveError('Please enter a valid email address.')
      return
    }

    const newCustomer = {
      name,
      email,
      phone,
      address,
      status: draft.status,
    }

    setIsSaving(true)
    setSaveError('')

    try {
      const response = await fetch('https://localhost:7240/api/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to save customer')
      }

      const createdCustomer = await response.json()
      setCustomers((prev) => [
        {
          id: createdCustomer.id ?? `${Date.now()}`,
          ...newCustomer,
        },
        ...prev,
      ])
      setIsAddOpen(false)
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : 'Unable to save customer. Please try again.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  async function toggleStatus(id) {
    const customer = customers.find((c) => c.id === id)
    if (!customer) return

    const newStatus = customer.status === 'Active' ? 'Inactive' : 'Active'

    try {
      const response = await fetch(`https://localhost:7240/api/customer/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...customer, status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update customer status')
      }

      setCustomers((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: newStatus } : c,
        ),
      )
    } catch (error) {
      console.error('Error updating customer status:', error)
      // Optionally show error to user
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Customers</h2>
          <p className="page-subtitle">Manage customer information and contacts.</p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn-primary" onClick={openAdd}>
            Add customer
          </button>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-label">Total customers</div>
          <div className="stat-value">{totals.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active</div>
          <div className="stat-value">{totals.active}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Inactive</div>
          <div className="stat-value">{totals.inactive}</div>
        </div>
      </div>

      <div className="panel panel-tight">
        <div className="toolbar">
          <div className="toolbar-left">
            <input
              className="text-input"
              type="search"
              placeholder="Search by name or email…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search customers"
            />
            <select
              className="select-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="All">All status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="toolbar-right">
            <span className="muted">{filtered.length} results</span>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Status</th>
                <th className="numeric">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td className="strong">{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.address}</td>
                  <td>
                    <span
                      className={`badge ${
                        c.status === 'Active' ? 'badge-success' : 'badge-muted'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="numeric">
                    <button
                      type="button"
                      className="btn-outline btn-small"
                      onClick={() => toggleStatus(c.id)}
                    >
                      Toggle
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty">
                    No customers match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog title="Add customer" open={isAddOpen} onClose={() => setIsAddOpen(false)}>
        <div className="form-grid">
          <label className="field">
            <span className="field-label">Name</span>
            <input
              className="text-input"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="Customer name"
            />
          </label>
          <label className="field">
            <span className="field-label">Email</span>
            <input
              className="text-input"
              type="email"
              value={draft.email}
              onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
              placeholder="customer@example.com"
            />
          </label>
          <label className="field">
            <span className="field-label">Phone</span>
            <input
              className="text-input"
              value={draft.phone}
              onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
              placeholder="+91 9876543210"
            />
          </label>
          <label className="field">
            <span className="field-label">Address</span>
            <input
              className="text-input"
              value={draft.address}
              onChange={(e) => setDraft((d) => ({ ...d, address: e.target.value }))}
              placeholder="Full address"
            />
          </label>
          <label className="field">
            <span className="field-label">Status</span>
            <select
              className="select-input"
              value={draft.status}
              onChange={(e) =>
                setDraft((d) => ({ ...d, status: e.target.value }))
              }
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </label>
        </div>

        {saveError && <div className="form-error">{saveError}</div>}

        <div className="dialog-footer">
          <button type="button" className="btn-outline" onClick={() => setIsAddOpen(false)}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={saveDraft}
            disabled={isSaving}
          >
            {isSaving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </Dialog>
    </div>
  )
}
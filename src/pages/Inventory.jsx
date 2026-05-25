import { useEffect, useMemo, useState } from 'react'

const initialInventory = [
  {
    id: 'i1',
    name: 'Premium Coffee Beans 1kg',
    sku: 'CF-1001',
    category: 'Grocery',
    location: 'Warehouse A',
    stock: 58,
    reorderLevel: 20,
    status: 'Available',
  },
  {
    id: 'i2',
    name: 'Whole Wheat Bread Loaf',
    sku: 'BR-2030',
    category: 'Bakery',
    location: 'Store Front',
    stock: 14,
    reorderLevel: 10,
    status: 'Available',
  },
  {
    id: 'i3',
    name: 'Organic Almonds 500g',
    sku: 'AL-3090',
    category: 'Dry Fruits',
    location: 'Warehouse B',
    stock: 9,
    reorderLevel: 12,
    status: 'Low stock',
  },
  {
    id: 'i4',
    name: 'Soft Drink 750ml',
    sku: 'SD-1040',
    category: 'Beverages',
    location: 'Store Front',
    stock: 0,
    reorderLevel: 8,
    status: 'Out of stock',
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

function formatNumber(value) {
  return new Intl.NumberFormat('en-IN').format(value)
}

export default function Inventory() {
  const [items, setItems] = useState(initialInventory)
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [draft, setDraft] = useState({
    name: '',
    sku: '',
    category: 'Grocery',
    location: 'Warehouse A',
    stock: '',
    reorderLevel: '',
    status: 'Available',
  })
  const [saveError, setSaveError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadInventory()
  }, [])

  async function loadInventory() {
    try {
      const response = await fetch('https://localhost:7240/api/inventory')
      if (!response.ok) {
        throw new Error('Failed to load inventory')
      }
      const data = await response.json()
      if (Array.isArray(data)) {
        setItems(data)
      }
    } catch (error) {
      console.error('Error loading inventory:', error)
      // Keep initial inventory as fallback
    }
  }

  const categories = useMemo(() => {
    const set = new Set(items.map((item) => item.category))
    return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
  }, [items])

  const statuses = ['All', 'Available', 'Low stock', 'Out of stock']

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((item) => {
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q)
      const matchesCategory =
        categoryFilter === 'All' || item.category === categoryFilter
      const matchesStatus =
        statusFilter === 'All' || item.status === statusFilter
      return matchesQuery && matchesCategory && matchesStatus
    })
  }, [items, query, categoryFilter, statusFilter])

  const totals = useMemo(() => {
    const total = items.length
    const available = items.filter((item) => item.status === 'Available').length
    const lowStock = items.filter((item) => item.stock > 0 && item.stock <= item.reorderLevel).length
    const outOfStock = items.filter((item) => item.stock === 0).length
    return { total, available, lowStock, outOfStock }
  }, [items])

  function openAdd() {
    setDraft({
      name: '',
      sku: '',
      category: 'Grocery',
      location: 'Warehouse A',
      stock: '',
      reorderLevel: '',
      status: 'Available',
    })
    setSaveError('')
    setIsAddOpen(true)
  }

  async function saveDraft() {
    const name = draft.name.trim()
    const sku = draft.sku.trim()
    const stock = Number(draft.stock)
    const reorderLevel = Number(draft.reorderLevel)

    if (!name || !sku || Number.isNaN(stock) || Number.isNaN(reorderLevel)) {
      setSaveError('Please complete all required fields.')
      return
    }

    const nextStatus =
      stock === 0 ? 'Out of stock' : stock <= reorderLevel ? 'Low stock' : 'Available'

    const newItem = {
      name,
      sku,
      category: draft.category,
      location: draft.location,
      stock,
      reorderLevel,
      status: nextStatus,
    }

    setIsSaving(true)
    setSaveError('')

    try {
      const response = await fetch('https://localhost:7240/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      })

      if (!response.ok) {
        debugger;
        const errorText =  await response.text()
        throw new Error(errorText || 'Failed to save inventory item')
      }

      const createdItem =  await response.json()
      setItems((prev) => [
        {
          id: createdItem.id ?? `i-${Date.now()}`,
          ...newItem,
        },
        ...prev,
      ])
      setIsAddOpen(false)
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : 'Unable to save inventory item. Please try again.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="page" aria-label="Inventory">
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory</h1>
          <p className="page-subtitle">
            Manage stock levels, reorder thresholds, and warehouse location details.
          </p>
        </div>
        <div className="page-actions">
          <button type="button" className="counter" onClick={openAdd}>
            + Add inventory item
          </button>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-label">Total items</div>
          <div className="stat-value">{totals.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Available</div>
          <div className="stat-value">{totals.available}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Low stock</div>
          <div className="stat-value">{totals.lowStock}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Out of stock</div>
          <div className="stat-value">{totals.outOfStock}</div>
        </div>
      </div>

      <div className="toolbar">
        <div className="toolbar-left">
          <label className="field">
            <span className="field-label">Search</span>
            <input
              className="text-input"
              type="search"
              value={query}
              placeholder="Search by item or SKU"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="field">
            <span className="field-label">Category</span>
            <select
              className="select-input"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field-label">Status</span>
            <select
              className="select-input"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="empty">No inventory items match the filter.</div>
      ) : (
        <div className="panel-tight">
          <table className="data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Location</th>
                <th>Stock</th>
                <th>Reorder level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="strong">{item.name}</div>
                  </td>
                  <td>{item.sku}</td>
                  <td>{item.category}</td>
                  <td>{item.location}</td>
                  <td>{formatNumber(item.stock)}</td>
                  <td>{formatNumber(item.reorderLevel)}</td>
                  <td>
                    <span
                      className={
                        item.status === 'Available'
                          ? 'badge-success btn-small'
                          : item.status === 'Out of stock'
                          ? 'badge-danger btn-small'
                          : 'badge-muted btn-small'
                      }
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog title="Add inventory item" open={isAddOpen} onClose={() => setIsAddOpen(false)}>
        <div className="form-grid">
          <label className="field">
            <span className="field-label">Item name</span>
            <input
              className="text-input"
              value={draft.name}
              onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
            />
          </label>
          <label className="field">
            <span className="field-label">SKU</span>
            <input
              className="text-input"
              value={draft.sku}
              onChange={(event) => setDraft((prev) => ({ ...prev, sku: event.target.value }))}
            />
          </label>
          <label className="field">
            <span className="field-label">Category</span>
            <input
              className="text-input"
              value={draft.category}
              onChange={(event) => setDraft((prev) => ({ ...prev, category: event.target.value }))}
            />
          </label>
          <label className="field">
            <span className="field-label">Location</span>
            <input
              className="text-input"
              value={draft.location}
              onChange={(event) => setDraft((prev) => ({ ...prev, location: event.target.value }))}
            />
          </label>
          <label className="field">
            <span className="field-label">Stock</span>
            <input
              className="text-input"
              type="number"
              value={draft.stock}
              onChange={(event) => setDraft((prev) => ({ ...prev, stock: event.target.value }))}
            />
          </label>
          <label className="field">
            <span className="field-label">Reorder level</span>
            <input
              className="text-input"
              type="number"
              value={draft.reorderLevel}
              onChange={(event) => setDraft((prev) => ({ ...prev, reorderLevel: event.target.value }))}
            />
          </label>
        </div>
        {saveError && <div className="empty">{saveError}</div>}
        <div className="dialog-footer">
          <button type="button" className="icon-btn" onClick={() => setIsAddOpen(false)}>
            Cancel
          </button>
          <button type="button" className="counter" onClick={saveDraft} disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save item'}
          </button>
        </div>
      </Dialog>
    </section>
  )
}

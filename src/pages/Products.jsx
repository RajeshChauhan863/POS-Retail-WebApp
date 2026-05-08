import { useMemo, useState } from 'react'

const initialProducts = [
  {
    id: 'p1',
    name: 'Premium Coffee Beans 1kg',
    description: 'CF-1001',
    category: 'Grocery',
    unitPrice: 499,
    stock: 58,
    
  },
  {
    id: 'p2',
    name: 'Whole Wheat Bread Loaf',
    description: 'BR-2030',
    category: 'Bakery',
    price: 80,
    stock: 14,
  },
  {
    id: 'p3',
    name: 'Organic Almonds 500g',
    description: 'AL-3090',
    category: 'Dry Fruits',
    price: 699,
    stock: 9,
    
  },
  {
    id: 'p4',
    name: 'Soft Drink 750ml',
    description: 'SD-1040',
    category: 'Beverages',
    price: 55,
    stock: 0,
  },
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

export default function Products() {
  const [products, setProducts] = useState(initialProducts)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [stockFilter, setStockFilter] = useState('All')

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [draft, setDraft] = useState({
    name: '',
    sku: '',
    category: 'Grocery',
    price: '',
    stock: '',
    status: 'Active',
  })

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category))
    return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
  }, [products])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => {
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      const matchesCategory = category === 'All' || p.category === category
      const matchesStock =
        stockFilter === 'All' ||
        (stockFilter === 'InStock' && p.stock > 0) ||
        (stockFilter === 'OutOfStock' && p.stock === 0)
      return matchesQuery && matchesCategory && matchesStock
    })
  }, [products, query, category, stockFilter])

  const totals = useMemo(() => {
    const total = products.length
    const active = products.filter((p) => p.status === 'Active').length
    const low = products.filter((p) => p.stock > 0 && p.stock <= 10).length
    const oos = products.filter((p) => p.stock === 0).length
    return { total, active, low, oos }
  }, [products])

  function openAdd() {
    setDraft({
      name: '',
      sku: '',
      category: 'Grocery',
      price: '',
      stock: '',
      status: 'Active',
    })
    setIsAddOpen(true)
  }

  function saveDraft() {
    const name = draft.name.trim()
    const description = draft.description.trim()
    const unitPrice = Number(draft.price)
    const stock = Number(draft.stock)

    if (!name || !description || Number.isNaN(unitPrice) || Number.isNaN(stock)) return

    setProducts((prev) => [
      {
        id: `${Date.now()}`,
        name,
        description,
        category: draft.category,
        unitPrice,
        stock,
        
      },
      ...prev,
    ])
    setIsAddOpen(false)
  }

  function toggleStatus(id) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' }
          : p,
      ),
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Products</h2>
          <p className="page-subtitle">Manage catalog, pricing, and stock.</p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn-primary" onClick={openAdd}>
            Add product
          </button>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-label">Total products</div>
          <div className="stat-value">{totals.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active</div>
          <div className="stat-value">{totals.active}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Low stock (≤ 10)</div>
          <div className="stat-value">{totals.low}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Out of stock</div>
          <div className="stat-value">{totals.oos}</div>
        </div>
      </div>

      <div className="panel panel-tight">
        <div className="toolbar">
          <div className="toolbar-left">
            <input
              className="text-input"
              type="search"
              placeholder="Search by name or SKU\u2026"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products"
            />
            <select
              className="select-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter by category"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              className="select-input"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              aria-label="Filter by stock"
            >
              <option value="All">All stock</option>
              <option value="InStock">In stock</option>
              <option value="OutOfStock">Out of stock</option>
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
                <th>Product</th>
                <th>Description</th>
                <th>Category</th>
                <th className="numeric">Unit Price</th>
                <th className="numeric">Stock</th>
                <th className="numeric">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td className="strong">{p.name}</td>
                  <td>{p.sku}</td>
                  <td>{p.category}</td>
                  <td className="numeric">{formatINR(p.price)}</td>
                  <td className="numeric">
                    {p.stock === 0 ? (
                      <span className="badge badge-danger">0</span>
                    ) : p.stock <= 10 ? (
                      <span className="badge badge-warning">{p.stock}</span>
                    ) : (
                      <span className="badge badge-pill">{p.stock}</span>
                    )}
                  </td>
                  
                  <td className="numeric">
                    <button
                      type="button"
                      className="btn-outline btn-small"
                      onClick={() => toggleStatus(p.id)}
                    >
                      Toggle
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty">
                    No products match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog title="Add product" open={isAddOpen} onClose={() => setIsAddOpen(false)}>
        <div className="form-grid">
          <label className="field">
            <span className="field-label">Name</span>
            <input
              className="text-input"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="Product name"
            />
          </label>
          <label className="field">
            <span className="field-label">Descritpion</span>
            <input
              className="text-input"
              value={draft.sku}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              placeholder="e.g. CF-1001"
            />
          </label>
          <label className="field">
            <span className="field-label">Category</span>
            <select
              className="select-input"
              value={draft.category}
              onChange={(e) =>
                setDraft((d) => ({ ...d, category: e.target.value }))
              }
            >
              <option>Grocery</option>
              <option>Bakery</option>
              <option>Beverages</option>
              <option>Dry Fruits</option>
              <option>Dairy</option>
            </select>
          </label>
          <label className="field">
            <span className="field-label">Unit Price (INR)</span>
            <input
              className="text-input"
              inputMode="numeric"
              value={draft.price}
              onChange={(e) =>
                setDraft((d) => ({ ...d, price: e.target.value }))
              }
              placeholder="e.g. 499"
            />
          </label>
          <label className="field">
            <span className="field-label">Stock</span>
            <input
              className="text-input"
              inputMode="numeric"
              value={draft.stock}
              onChange={(e) =>
                setDraft((d) => ({ ...d, stock: e.target.value }))
              }
              placeholder="e.g. 50"
            />
          </label>
        </div>

        <div className="dialog-footer">
          <button type="button" className="btn-outline" onClick={() => setIsAddOpen(false)}>
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={saveDraft}>
            Save
          </button>
        </div>
      </Dialog>
    </div>
  )
}


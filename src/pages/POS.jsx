import { useMemo, useState } from 'react'
import '../css/pos.css'

const sampleProducts = [
  { id: 'p1', name: 'Espresso Roast 250g', sku: 'CF-2001', price: 6.5, stock: 24 },
  { id: 'p2', name: 'Latte Cup', sku: 'UT-1100', price: 2.5, stock: 120 },
  { id: 'p3', name: 'Blueberry Muffin', sku: 'BR-3001', price: 3.0, stock: 18 },
  { id: 'p4', name: 'Organic Milk 1L', sku: 'ML-4000', price: 1.8, stock: 40 },
  { id: 'p5', name: 'Orange Juice 500ml', sku: 'OJ-5005', price: 2.2, stock: 30 },
  { id: 'p6', name: 'Bagel Sesame', sku: 'BG-2200', price: 1.5, stock: 36 },
]

function currency(v) {
  return `$${v.toFixed(2)}`
}

export default function POS() {
  const [products] = useState(sampleProducts)
  const [cart, setCart] = useState({})
  const [query, setQuery] = useState('')

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
  }, [products, query])

  function addToCart(product) {
    setCart((prev) => {
      const existing = prev[product.id]
      const qty = existing ? existing.qty + 1 : 1
      return { ...prev, [product.id]: { ...product, qty } }
    })
  }

  function updateQty(id, qty) {
    setCart((prev) => {
      const copy = { ...prev }
      if (qty <= 0) delete copy[id]
      else copy[id] = { ...copy[id], qty }
      return copy
    })
  }

  function clearCart() {
    setCart({})
  }

  const items = Object.values(cart)
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0)
  const tax = subtotal * 0.07
  const total = subtotal + tax

  return (
    <section className="page pos-page" aria-label="Point of Sale">
      <div className="page-header">
        <div>
          <h1 className="page-title">Point of Sale</h1>
          <p className="page-subtitle">Quickly add products to cart and complete sales.</p>
        </div>
      </div>

      <div className="pos-grid">
        <div className="pos-catalog">
          <div className="pos-toolbar">
            <input
              className="text-input"
              placeholder="Search products or SKU"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="product-grid">
            {list.map((p) => (
              <div key={p.id} className="product-card">
                <div className="product-name">{p.name}</div>
                <div className="product-sku">{p.sku}</div>
                <div className="product-price">{currency(p.price)}</div>
                <div className="product-stock">Stock: {p.stock}</div>
                <button type="button" className="counter" onClick={() => addToCart(p)}>
                  + Add
                </button>
              </div>
            ))}
            {list.length === 0 && <div className="empty">No products found.</div>}
          </div>
        </div>

        <aside className="pos-cart" aria-label="Cart">
          <h2>Cart</h2>
          {items.length === 0 ? (
            <div className="empty">Cart is empty</div>
          ) : (
            <div>
              <ul className="cart-list">
                {items.map((it) => (
                  <li key={it.id} className="cart-item">
                    <div>
                      <div className="strong">{it.name}</div>
                      <div className="muted">{it.sku}</div>
                    </div>
                    <div className="cart-controls">
                      <button type="button" className="icon-btn" onClick={() => updateQty(it.id, it.qty - 1)}>-</button>
                      <span className="cart-qty">{it.qty}</span>
                      <button type="button" className="icon-btn" onClick={() => updateQty(it.id, it.qty + 1)}>+</button>
                    </div>
                    <div className="cart-line">{currency(it.price * it.qty)}</div>
                  </li>
                ))}
              </ul>

              <div className="cart-summary">
                <div className="cart-row"><span>Subtotal</span><span>{currency(subtotal)}</span></div>
                <div className="cart-row"><span>Tax (7%)</span><span>{currency(tax)}</span></div>
                <div className="cart-row strong"><span>Total</span><span>{currency(total)}</span></div>
              </div>

              <div className="cart-actions">
                <button type="button" className="counter" onClick={() => alert('Checkout simulated')}>Checkout</button>
                <button type="button" className="icon-btn" onClick={clearCart}>Clear</button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}

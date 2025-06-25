// Nuevo módulo para gestión del carrito de compras
import { Utils } from "./utils.js"
import { Data } from "./data.js"

export const Cart = {
  items: [],
  initialized: false,

  async init() {
    console.log("🛒 Initializing Cart module...")

    // Load cart from localStorage
    this.loadCart()

    // Setup event listeners
    this.setupEventListeners()

    // Update cart UI
    this.updateCartUI()

    this.initialized = true
    console.log("✅ Cart module initialized")
  },

  setupEventListeners() {
    // Cart button click
    const cartBtn = Utils.$("#cartBtn")
    if (cartBtn) {
      cartBtn.addEventListener("click", () => {
        this.openCartModal()
      })
    }

    // Listen for modal events
    document.addEventListener("modalOpened", (e) => {
      if (e.detail.modalId === "cartModal") {
        this.renderCartItems()
      }
    })
  },

  loadCart() {
    const savedCart = Utils.getStorage("inviteu_cart")
    if (savedCart) {
      this.items = savedCart
    }
  },

  saveCart() {
    Utils.setStorage("inviteu_cart", this.items)
  },

  addItem(itemId, type) {
    let itemData
    let name
    let price

    if (type === "template") {
      itemData = Data.getEventById(itemId)
      name = itemData?.name
      price = itemData?.price
    } else if (type === "package") {
      itemData = Data.getPackageById(itemId)
      name = `Paquete ${itemData?.name}`
      price = itemData?.price.max
    }

    if (!itemData) {
      if (window.UI) {
        window.UI.showNotification("Error al agregar al carrito", "error")
      }
      return
    }

    // Check if item already exists
    const existingItem = this.items.find((item) => item.id === itemId && item.type === type)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      this.items.push({
        id: itemId,
        type: type,
        name: name,
        price: price,
        quantity: 1,
        data: itemData,
      })
    }

    this.saveCart()
    this.updateCartUI()

    if (window.UI) {
      window.UI.showNotification(`"${name}" agregado al carrito`)
    }
  },

  removeItem(itemId, type) {
    this.items = this.items.filter((item) => !(item.id === itemId && item.type === type))
    this.saveCart()
    this.updateCartUI()
    this.renderCartItems()
  },

  updateQuantity(itemId, type, quantity) {
    const item = this.items.find((item) => item.id === itemId && item.type === type)
    if (item) {
      if (quantity <= 0) {
        this.removeItem(itemId, type)
      } else {
        item.quantity = quantity
        this.saveCart()
        this.updateCartUI()
        this.renderCartItems()
      }
    }
  },

  clearCart() {
    this.items = []
    this.saveCart()
    this.updateCartUI()
    this.renderCartItems()
  },

  updateCartUI() {
    const cartCount = Utils.$("#cartCount")
    const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0)

    if (cartCount) {
      cartCount.textContent = totalItems
      cartCount.style.display = totalItems > 0 ? "block" : "none"
    }
  },

  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  },

  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0)
  },

  async openCartModal() {
    if (window.UI) {
      await window.UI.loadModalContent("cartModal")
      window.UI.openModal("cartModal")
    }
  },

  renderCartItems() {
    const cartItemsContainer = Utils.$("#cartItems")
    const cartTotal = Utils.$("#cartTotal")
    const checkoutBtn = Utils.$("#proceedToCheckout")

    if (!cartItemsContainer) return

    if (this.items.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart">
          <svg class="empty-cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="8" cy="21" r="1"/>
            <circle cx="19" cy="21" r="1"/>
            <path d="m2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          </svg>
          <h3>Tu carrito está vacío</h3>
          <p>Explora nuestras plantillas y paquetes para comenzar</p>
          <button class="btn btn-primary" onclick="window.UI.closeModal('cartModal')">
            Explorar Plantillas
          </button>
        </div>
      `
      if (cartTotal) cartTotal.textContent = Utils.formatPrice(0)
      if (checkoutBtn) checkoutBtn.disabled = true
      return
    }

    const itemsHTML = this.items
      .map(
        (item) => `
      <div class="cart-item" data-item-id="${item.id}" data-item-type="${item.type}">
        <div class="cart-item-info">
          <h4 class="cart-item-name">${item.name}</h4>
          <p class="cart-item-price">${Utils.formatPrice(item.price)}</p>
        </div>
        <div class="cart-item-controls">
          <div class="quantity-controls">
            <button class="quantity-btn minus" onclick="window.Cart.updateQuantity('${item.id}', '${item.type}', ${item.quantity - 1})">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-btn plus" onclick="window.Cart.updateQuantity('${item.id}', '${item.type}', ${item.quantity + 1})">+</button>
          </div>
          <button class="remove-item-btn" onclick="window.Cart.removeItem('${item.id}', '${item.type}')" title="Eliminar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3,6 5,6 21,6"/>
              <path d="m19,6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>
    `,
      )
      .join("")

    cartItemsContainer.innerHTML = itemsHTML

    if (cartTotal) {
      cartTotal.textContent = Utils.formatPrice(this.getTotal())
    }

    if (checkoutBtn) {
      checkoutBtn.disabled = false
      checkoutBtn.onclick = () => this.proceedToCheckout()
    }
  },

  proceedToCheckout() {
    if (this.items.length === 0) {
      if (window.UI) {
        window.UI.showNotification("Tu carrito está vacío", "warning")
      }
      return
    }

    // Close cart modal and open checkout
    if (window.UI) {
      window.UI.closeModal("cartModal")
      setTimeout(() => {
        if (window.Checkout) {
          window.Checkout.openCheckout()
        }
      }, 300)
    }
  },
}

// Make available globally
if (typeof window !== "undefined") {
  window.Cart = Cart
}

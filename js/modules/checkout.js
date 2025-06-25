// Nuevo módulo para gestión de checkout
import { CONFIG } from "../config.js"
import { Utils } from "./utils.js"

export const Checkout = {
  currentOrder: null,
  initialized: false,

  async init() {
    console.log("💳 Initializing Checkout module...")
    this.setupEventListeners()
    this.initialized = true
  },

  setupEventListeners() {
    document.addEventListener("modalOpened", (e) => {
      if (e.detail.modalId === "checkoutModal") {
        this.initializeCheckoutModal()
      }
    })
  },

  initializeCheckoutModal() {
    this.loadCartSummary()
    this.setupPaymentMethods()
    this.setupCheckoutButtons()
  },

  loadCartSummary() {
    if (!window.Cart || window.Cart.items.length === 0) {
      if (window.UI) {
        window.UI.showNotification("El carrito está vacío", "error")
        window.UI.closeModal("checkoutModal")
      }
      return
    }

    const items = window.Cart.items
    const subtotal = window.Cart.getTotal()
    const tax = Math.round(subtotal * CONFIG.BUSINESS.TAX_RATE)
    const total = subtotal + tax

    // Update order summary UI
    const orderSummary = Utils.$("#orderSummary")
    if (orderSummary) {
      const itemsHTML = items
        .map(
          (item) => `
      <div class="order-item">
        <span class="item-name">${item.name}</span>
        <span class="item-quantity">x${item.quantity}</span>
        <span class="item-price">${Utils.formatPrice(item.price * item.quantity)}</span>
      </div>
    `,
        )
        .join("")

      orderSummary.innerHTML = `
      <div class="order-items">
        ${itemsHTML}
      </div>
      <div class="order-totals">
        <div class="subtotal">Subtotal: ${Utils.formatPrice(subtotal)}</div>
        <div class="tax">IVA (${(CONFIG.BUSINESS.TAX_RATE * 100).toFixed(0)}%): ${Utils.formatPrice(tax)}</div>
        <div class="total"><strong>Total: ${Utils.formatPrice(total)}</strong></div>
      </div>
    `
    }

    // Store order data
    this.currentOrder = {
      items: items,
      pricing: { subtotal, tax, total },
    }
  },

  setupPaymentMethods() {
    const paymentMethods = Utils.$$(".payment-method")

    paymentMethods.forEach((method) => {
      method.addEventListener("click", () => {
        // Remove active class from all methods
        paymentMethods.forEach((m) => m.classList.remove("active"))

        // Add active class to clicked method
        method.classList.add("active")

        // Show/hide payment forms
        this.togglePaymentForms(method.dataset.method)
      })
    })
  },

  togglePaymentForms(method) {
    const stripePayment = Utils.$("#stripe-payment")
    const paypalPayment = Utils.$("#paypal-payment")

    if (stripePayment && paypalPayment) {
      if (method === "stripe") {
        stripePayment.style.display = "block"
        paypalPayment.style.display = "none"
      } else {
        stripePayment.style.display = "none"
        paypalPayment.style.display = "block"
      }
    }
  },

  setupCheckoutButtons() {
    const backBtn = Utils.$("#backToCustomization")
    const completeBtn = Utils.$("#completePayment")

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        if (window.UI) {
          window.UI.closeModal("checkoutModal")
          window.UI.openModal("customizationModal")
        }
      })
    }

    if (completeBtn) {
      completeBtn.addEventListener("click", () => {
        this.processPayment()
      })
    }
  },

  async processPayment() {
    try {
      if (!window.Auth.isAuthenticated()) {
        if (window.UI) {
          window.UI.showNotification("Debes iniciar sesión para continuar", "warning")
          window.UI.closeModal("checkoutModal")
          window.UI.openModal("loginModal")
        }
        return
      }

      const completeBtn = Utils.$("#completePayment")
      Utils.setLoading(completeBtn, true)

      // Get selected payment method
      const activeMethod = Utils.$(".payment-method.active")
      const method = activeMethod?.dataset.method || "stripe"

      // Process payment
      const result = await this.processPaymentMethod(method)

      Utils.setLoading(completeBtn, false)

      if (result.success) {
        // Save order
        await this.saveOrder(result)

        // Clear cart
        if (window.Cart) {
          window.Cart.clearCart()
        }

        // Close checkout and show request form
        if (window.UI) {
          window.UI.closeModal("checkoutModal")
          setTimeout(() => {
            window.UI.openModal("requestFormModal")
          }, 500)
        }
      }
    } catch (error) {
      Utils.handleError(error, "processPayment")
      const completeBtn = Utils.$("#completePayment")
      Utils.setLoading(completeBtn, false)
    }
  },

  async processPaymentMethod(method) {
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (method === "stripe") {
      return { success: true, paymentMethod: "stripe", transactionId: `stripe_${Date.now()}` }
    } else {
      return { success: true, paymentMethod: "paypal", transactionId: `paypal_${Date.now()}` }
    }
  },

  async saveOrder(paymentResult) {
    const order = {
      id: Date.now().toString(),
      userId: window.Auth.currentUser?.id,
      ...this.currentOrder,
      paymentResult,
      status: "completed",
      createdAt: new Date().toISOString(),
    }

    // Save to localStorage (in production, save to database)
    const orders = Utils.getStorage("user_orders") || []
    orders.push(order)
    Utils.setStorage("user_orders", orders)

    return order
  },
}

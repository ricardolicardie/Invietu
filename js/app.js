// InviteU.Digital - Clean Application Code
class InviteUApp {
  constructor() {
    this.cart = []
    this.initialized = false
  }

  async init() {
    try {
      console.log("🚀 Initializing InviteU.Digital...")

      // Load cart from storage
      this.loadCart()

      // Initialize components
      this.initializeUI()
      this.setupEventListeners()
      this.loadContent()

      // Mark as loaded
      document.body.classList.remove("loading")
      document.body.classList.add("loaded")

      this.initialized = true
      console.log("✅ InviteU.Digital initialized successfully!")
    } catch (error) {
      console.error("❌ Error initializing application:", error)
    }
  }

  // Data
  getData() {
    return {
      events: [
        {
          id: "boda-elegante",
          name: "Boda Elegante",
          category: "bodas",
          price: 299,
          description: "Diseño romántico con toques rosados",
          image: "/placeholder.svg?height=300&width=400",
        },
        {
          id: "boda-rustica",
          name: "Boda Rústica",
          category: "bodas",
          price: 299,
          description: "Estilo campestre y natural",
          image: "/placeholder.svg?height=300&width=400",
        },
        {
          id: "cumple-festivo",
          name: "Cumpleaños Festivo",
          category: "cumpleanos",
          price: 199,
          description: "Colorido y lleno de diversión",
          image: "/placeholder.svg?height=300&width=400",
        },
        {
          id: "cumple-elegante",
          name: "Cumpleaños Elegante",
          category: "cumpleanos",
          price: 199,
          description: "Sofisticado para adultos",
          image: "/placeholder.svg?height=300&width=400",
        },
        {
          id: "bautizo-angelical",
          name: "Bautizo Angelical",
          category: "bautizos",
          price: 179,
          description: "Tierno y celestial",
          image: "/placeholder.svg?height=300&width=400",
        },
        {
          id: "baby-dulce",
          name: "Baby Shower Dulce",
          category: "baby-shower",
          price: 159,
          description: "Colores pastel y ternura",
          image: "/placeholder.svg?height=300&width=400",
        },
      ],
      packages: [
        {
          id: "basico",
          name: "Básico",
          price: { min: 159, max: 299 },
          features: [
            "Desarrollo web personalizado",
            "Subdominio exclusivo",
            "Acceso por 3 meses",
            "Música de fondo incluida",
            "Diseño responsive",
            "RSVP básico integrado",
          ],
          featured: false,
        },
        {
          id: "intermedio",
          name: "Intermedio",
          price: { min: 299, max: 499 },
          features: [
            "Todo lo del paquete Básico",
            "Sistema RSVP avanzado",
            "Galería de fotos",
            "Cronograma del evento",
            "Personalización avanzada",
            "Mapa de ubicación",
          ],
          featured: true,
        },
        {
          id: "premium",
          name: "Premium",
          price: { min: 499, max: 799 },
          features: [
            "Todo lo del paquete Intermedio",
            "Animaciones personalizadas",
            "Video de fondo",
            "Lista de regalos integrada",
            "Chat en vivo para invitados",
            "Soporte prioritario 24/7",
          ],
          featured: false,
        },
      ],
      testimonials: [
        {
          id: 1,
          name: "María y Carlos",
          event: "Boda en Sevilla, 2024",
          rating: 5,
          text: "Nuestra invitación de boda fue absolutamente perfecta. El diseño capturó exactamente lo que queríamos y nuestros invitados quedaron encantados.",
          photo: "/placeholder.svg?height=60&width=60",
        },
        {
          id: 2,
          name: "Carmen López",
          event: "Cumpleaños en Valencia, 2024",
          rating: 5,
          text: "Para el cumpleaños de mi hija elegimos el diseño festivo y fue un éxito total. Los invitados se divirtieron mucho con la invitación interactiva.",
          photo: "/placeholder.svg?height=60&width=60",
        },
        {
          id: 3,
          name: "Rosa Martín",
          event: "Baby Shower en Madrid, 2024",
          rating: 5,
          text: "El baby shower de mi nieta fue perfecto gracias a la invitación digital. El diseño dulce y la facilidad para confirmar asistencia hicieron todo más sencillo.",
          photo: "/placeholder.svg?height=60&width=60",
        },
      ],
    }
  }

  // UI Initialization
  initializeUI() {
    // Update current year
    const yearElement = document.getElementById("currentYear")
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear()
    }

    // Update cart UI
    this.updateCartUI()
  }

  // Event Listeners
  setupEventListeners() {
    // Mobile menu
    const mobileMenuBtn = document.getElementById("mobileMenuBtn")
    const mobileMenu = document.getElementById("mobileMenu")
    const closeMenuBtn = document.getElementById("closeMenuBtn")

    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.add("active")
        document.body.style.overflow = "hidden"
      })
    }

    if (closeMenuBtn) {
      closeMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.remove("active")
        document.body.style.overflow = ""
      })
    }

    // Close mobile menu on link click
    document.querySelectorAll(".mobile-nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active")
        document.body.style.overflow = ""
      })
    })

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute("href"))
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      })
    })

    // Cart button
    const cartBtn = document.getElementById("cartBtn")
    if (cartBtn) {
      cartBtn.addEventListener("click", () => this.openCartModal())
    }

    // Contact form
    const contactForm = document.getElementById("contactForm")
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => this.handleContactForm(e))
    }

    // Filter buttons
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("filter-btn")) {
        this.handleFilter(e.target.dataset.filter)

        // Update active button
        document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"))
        e.target.classList.add("active")
      }
    })

    // Event delegation for dynamic content
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("add-to-cart-btn")) {
        const eventId = e.target.dataset.eventId
        this.addToCart(eventId, "template")
      }

      if (e.target.classList.contains("package-btn")) {
        const packageId = e.target.dataset.package
        this.addToCart(packageId, "package")
      }
    })

    // Modal close
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal") || e.target.classList.contains("close-modal")) {
        this.closeModal()
      }
    })

    // Escape key to close modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeModal()
      }
    })
  }

  // Load Content
  loadContent() {
    this.loadEvents()
    this.loadPackages()
    this.loadTestimonials()
  }

  loadEvents() {
    const eventsGrid = document.getElementById("eventsGrid")
    if (!eventsGrid) return

    const data = this.getData()
    const eventsHTML = data.events
      .map(
        (event) => `
      <div class="event-card" data-category="${event.category}">
        <div class="event-image">
          <img src="${event.image}" alt="${event.name}" loading="lazy">
          <div class="event-overlay">
            <button class="btn btn-primary add-to-cart-btn" data-event-id="${event.id}">
              Agregar al Carrito
            </button>
          </div>
        </div>
        <div class="event-info">
          <h3 class="event-title">${event.name}</h3>
          <p class="event-description">${event.description}</p>
          <div class="event-price">Desde ${this.formatPrice(event.price)}</div>
        </div>
      </div>
    `,
      )
      .join("")

    eventsGrid.innerHTML = eventsHTML
  }

  loadPackages() {
    const packagesGrid = document.getElementById("packagesGrid")
    if (!packagesGrid) return

    const data = this.getData()
    const packagesHTML = data.packages
      .map(
        (pkg) => `
      <div class="package-card ${pkg.featured ? "featured" : ""}">
        ${pkg.featured ? '<div class="package-badge">Más Popular</div>' : ""}
        <div class="package-header">
          <h3 class="package-name">${pkg.name}</h3>
          <div class="package-price">
            <span class="price">${this.formatPrice(pkg.price.max)}</span>
            <span class="price-note">${this.formatPrice(pkg.price.min)}</span>
          </div>
        </div>
        <div class="package-features">
          ${pkg.features
            .map(
              (feature) => `
            <div class="feature">
              <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20,6 9,17 4,12"/>
              </svg>
              <span>${feature}</span>
            </div>
          `,
            )
            .join("")}
        </div>
        <button class="btn ${pkg.featured ? "btn-primary" : "btn-outline"} btn-full package-btn" data-package="${pkg.id}">
          Seleccionar ${pkg.name}
        </button>
      </div>
    `,
      )
      .join("")

    packagesGrid.innerHTML = packagesHTML
  }

  loadTestimonials() {
    const testimonialsGrid = document.getElementById("testimonialsGrid")
    if (!testimonialsGrid) return

    const data = this.getData()
    const testimonialsHTML = data.testimonials
      .map(
        (testimonial) => `
      <div class="testimonial-card">
        <div class="testimonial-rating">
          <div class="stars">
            ${Array(testimonial.rating)
              .fill()
              .map(
                () => `
              <svg class="star" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
            `,
              )
              .join("")}
          </div>
        </div>
        <p class="testimonial-text">"${testimonial.text}"</p>
        <div class="testimonial-author">
          <img src="${testimonial.photo}" alt="${testimonial.name}" class="author-photo" loading="lazy">
          <div>
            <h4 class="author-name">${testimonial.name}</h4>
            <p class="author-date">${testimonial.event}</p>
          </div>
        </div>
      </div>
    `,
      )
      .join("")

    testimonialsGrid.innerHTML = testimonialsHTML
  }

  // Filter Events
  handleFilter(category) {
    const eventCards = document.querySelectorAll(".event-card")

    eventCards.forEach((card) => {
      const cardCategory = card.dataset.category
      const shouldShow = category === "todos" || cardCategory === category

      if (shouldShow) {
        card.classList.remove("hidden")
      } else {
        card.classList.add("hidden")
      }
    })
  }

  // Cart Management
  loadCart() {
    const savedCart = localStorage.getItem("inviteu_cart")
    if (savedCart) {
      this.cart = JSON.parse(savedCart)
    }
  }

  saveCart() {
    localStorage.setItem("inviteu_cart", JSON.stringify(this.cart))
  }

  addToCart(itemId, type) {
    const data = this.getData()
    let item

    if (type === "template") {
      item = data.events.find((e) => e.id === itemId)
    } else if (type === "package") {
      item = data.packages.find((p) => p.id === itemId)
    }

    if (!item) return

    // Check if item already exists
    const existingItem = this.cart.find((cartItem) => cartItem.id === itemId && cartItem.type === type)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      this.cart.push({
        id: itemId,
        type: type,
        name: type === "package" ? `Paquete ${item.name}` : item.name,
        price: type === "package" ? item.price.max : item.price,
        quantity: 1,
      })
    }

    this.saveCart()
    this.updateCartUI()
    this.showNotification(`"${type === "package" ? `Paquete ${item.name}` : item.name}" agregado al carrito`)
  }

  removeFromCart(itemId, type) {
    this.cart = this.cart.filter((item) => !(item.id === itemId && item.type === type))
    this.saveCart()
    this.updateCartUI()
    this.renderCartModal()
  }

  updateQuantity(itemId, type, quantity) {
    const item = this.cart.find((cartItem) => cartItem.id === itemId && cartItem.type === type)
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(itemId, type)
      } else {
        item.quantity = quantity
        this.saveCart()
        this.updateCartUI()
        this.renderCartModal()
      }
    }
  }

  clearCart() {
    this.cart = []
    this.saveCart()
    this.updateCartUI()
    this.renderCartModal()
  }

  updateCartUI() {
    const cartCount = document.getElementById("cartCount")
    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0)

    if (cartCount) {
      cartCount.textContent = totalItems
      if (totalItems > 0) {
        cartCount.classList.add("show")
      } else {
        cartCount.classList.remove("show")
      }
    }
  }

  getCartTotal() {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  // Modals
  openCartModal() {
    this.createModal("cart")
  }

  openCheckoutModal() {
    this.createModal("checkout")
  }

  openRequestModal() {
    this.createModal("request")
  }

  openSuccessModal() {
    this.createModal("success")
  }

  createModal(type) {
    const modalContainer = document.getElementById("modalContainer")

    let modalHTML = ""

    switch (type) {
      case "cart":
        modalHTML = this.getCartModalHTML()
        break
      case "checkout":
        modalHTML = this.getCheckoutModalHTML()
        break
      case "request":
        modalHTML = this.getRequestModalHTML()
        break
      case "success":
        modalHTML = this.getSuccessModalHTML()
        break
    }

    modalContainer.innerHTML = modalHTML

    const modal = modalContainer.querySelector(".modal")
    if (modal) {
      setTimeout(() => modal.classList.add("active"), 10)
      document.body.style.overflow = "hidden"

      if (type === "cart") {
        this.renderCartModal()
      } else if (type === "request") {
        this.setupRequestForm()
      }
    }
  }

  closeModal() {
    const modal = document.querySelector(".modal.active")
    if (modal) {
      modal.classList.remove("active")
      document.body.style.overflow = ""
      setTimeout(() => {
        const modalContainer = document.getElementById("modalContainer")
        modalContainer.innerHTML = ""
      }, 300)
    }
  }

  getCartModalHTML() {
    return `
      <div class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Carrito de Compras</h2>
            <button class="close-modal">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" x2="6" y1="6" y2="18"/>
                <line x1="6" x2="18" y1="6" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div id="cartItems"></div>
            <div class="cart-summary" style="border-top: 1px solid #e5e7eb; padding-top: 1rem; margin-top: 1rem;">
              <div style="text-align: center; margin-bottom: 1rem;">
                <strong>Total: <span id="cartTotal">${this.formatPrice(this.getCartTotal())}</span></strong>
              </div>
              <div style="display: flex; gap: 1rem;">
                <button class="btn btn-outline" onclick="app.clearCart()" style="flex: 1;">
                  Vaciar Carrito
                </button>
                <button class="btn btn-primary" onclick="app.proceedToCheckout()" style="flex: 1;" ${this.cart.length === 0 ? "disabled" : ""}>
                  Proceder al Pago
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }

  getCheckoutModalHTML() {
    return `
      <div class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Checkout</h2>
            <button class="close-modal">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" x2="6" y1="6" y2="18"/>
                <line x1="6" x2="18" y1="6" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div style="margin-bottom: 2rem;">
              <h3>Resumen del Pedido</h3>
              ${this.cart
                .map(
                  (item) => `
                <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #f3f4f6;">
                  <span>${item.name} x${item.quantity}</span>
                  <span>${this.formatPrice(item.price * item.quantity)}</span>
                </div>
              `,
                )
                .join("")}
              <div style="display: flex; justify-content: space-between; padding: 1rem 0; font-weight: bold; border-top: 2px solid #e5e7eb;">
                <span>Total</span>
                <span>${this.formatPrice(this.getCartTotal())}</span>
              </div>
            </div>
            
            <div style="text-align: center;">
              <p style="margin-bottom: 1rem; color: #6b7280;">Simulación de pago - En producción se integraría con Stripe/PayPal</p>
              <button class="btn btn-primary btn-full" onclick="app.processPayment()">
                Procesar Pago
              </button>
            </div>
          </div>
        </div>
      </div>
    `
  }

  getRequestModalHTML() {
    return `
      <div class="modal">
        <div class="modal-content" style="max-width: 600px;">
          <div class="modal-header">
            <h2>Detalles de tu Invitación</h2>
            <button class="close-modal">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" x2="6" y1="6" y2="18"/>
                <line x1="6" x2="18" y1="6" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <p style="background: linear-gradient(to right, #fdf2f8, #faf5ff); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
              ¡Pago procesado correctamente! Completa los detalles para que nuestro equipo diseñe tu invitación perfecta.
            </p>
            
            <form id="requestForm" style="display: flex; flex-direction: column; gap: 1rem;">
              <div class="form-group">
                <label>Nombre(s) de los novios *</label>
                <input type="text" name="coupleNames" required placeholder="María y Carlos">
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label>Fecha del evento *</label>
                  <input type="date" name="eventDate" required>
                </div>
                <div class="form-group">
                  <label>Ciudad o ubicación *</label>
                  <input type="text" name="eventLocation" required placeholder="Madrid, España">
                </div>
              </div>
              
              <div class="form-group">
                <label>Frase o dedicatoria (opcional)</label>
                <textarea name="specialMessage" rows="3" placeholder="Una frase especial para vuestra invitación..."></textarea>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label>Correo electrónico *</label>
                  <input type="email" name="contactEmail" required>
                </div>
                <div class="form-group">
                  <label>Número de WhatsApp *</label>
                  <input type="tel" name="whatsappNumber" required placeholder="+34 123 456 789">
                </div>
              </div>
              
              <div class="form-group">
                <label>Subdominio deseado (opcional)</label>
                <div style="display: flex; align-items: center; border: 1px solid #d1d5db; border-radius: 0.375rem; overflow: hidden;">
                  <input type="text" name="desiredSubdomain" placeholder="maria-y-carlos" style="border: none; flex: 1; padding: 0.75rem;">
                  <span style="background: #f3f4f6; padding: 0.75rem; color: #6b7280; font-size: 0.875rem;">.inviteu.digital</span>
                </div>
                <small style="color: #6b7280; font-size: 0.875rem;">Si no especificas uno, crearemos uno automáticamente</small>
              </div>
              
              <button type="submit" class="btn btn-primary btn-full">
                Enviar Solicitud
              </button>
            </form>
          </div>
        </div>
      </div>
    `
  }

  getSuccessModalHTML() {
    return `
      <div class="modal">
        <div class="modal-content" style="text-align: center;">
          <div class="modal-body" style="padding: 3rem 2rem;">
            <div style="width: 80px; height: 80px; margin: 0 auto 1.5rem; background: linear-gradient(to right, #ec4899, #a855f7); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <svg style="width: 40px; height: 40px; color: white;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
              </svg>
            </div>
            <h2 style="margin-bottom: 1rem;">¡Gracias por tu compra!</h2>
            <p style="font-size: 1.125rem; margin-bottom: 1rem;">
              Nuestro equipo está trabajando en tu invitación y la recibirás en un plazo de <strong>24 a 48 horas</strong>.
            </p>
            <p style="color: #6b7280; margin-bottom: 2rem;">
              Te contactaremos al correo y WhatsApp proporcionados para coordinar cualquier detalle adicional.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
              <button class="btn btn-primary" onclick="app.closeModal()">
                Continuar Navegando
              </button>
            </div>
          </div>
        </div>
      </div>
    `
  }

  renderCartModal() {
    const cartItems = document.getElementById("cartItems")
    const cartTotal = document.getElementById("cartTotal")

    if (!cartItems) return

    if (this.cart.length === 0) {
      cartItems.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #6b7280;">
          <svg style="width: 64px; height: 64px; margin: 0 auto 1rem; color: #d1d5db;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="8" cy="21" r="1"/>
            <circle cx="19" cy="21" r="1"/>
            <path d="m2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          </svg>
          <h3>Tu carrito está vacío</h3>
          <p>Explora nuestras plantillas y paquetes para comenzar</p>
        </div>
      `
    } else {
      cartItems.innerHTML = this.cart
        .map(
          (item) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; margin-bottom: 1rem; background: #fafafa;">
          <div>
            <h4 style="margin: 0 0 0.25rem 0;">${item.name}</h4>
            <p style="margin: 0; color: #ec4899; font-weight: 600;">${this.formatPrice(item.price)}</p>
          </div>
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <button onclick="app.updateQuantity('${item.id}', '${item.type}', ${item.quantity - 1})" style="width: 32px; height: 32px; border: 1px solid #d1d5db; background: white; border-radius: 4px; cursor: pointer;">-</button>
              <span style="min-width: 30px; text-align: center; font-weight: 600;">${item.quantity}</span>
              <button onclick="app.updateQuantity('${item.id}', '${item.type}', ${item.quantity + 1})" style="width: 32px; height: 32px; border: 1px solid #d1d5db; background: white; border-radius: 4px; cursor: pointer;">+</button>
            </div>
            <button onclick="app.removeFromCart('${item.id}', '${item.type}')" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 0.25rem;">
              <svg style="width: 18px; height: 18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3,6 5,6 21,6"/>
                <path d="m19,6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>
      `,
        )
        .join("")
    }

    if (cartTotal) {
      cartTotal.textContent = this.formatPrice(this.getCartTotal())
    }
  }

  setupRequestForm() {
    const form = document.getElementById("requestForm")
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault()

        const formData = new FormData(form)
        const requestData = {
          coupleNames: formData.get("coupleNames"),
          eventDate: formData.get("eventDate"),
          eventLocation: formData.get("eventLocation"),
          specialMessage: formData.get("specialMessage"),
          contactEmail: formData.get("contactEmail"),
          whatsappNumber: formData.get("whatsappNumber"),
          desiredSubdomain: formData.get("desiredSubdomain"),
          submittedAt: new Date().toISOString(),
        }

        // Validate required fields
        if (
          !requestData.coupleNames ||
          !requestData.eventDate ||
          !requestData.eventLocation ||
          !requestData.contactEmail ||
          !requestData.whatsappNumber
        ) {
          this.showNotification("Por favor completa todos los campos requeridos", "error")
          return
        }

        // Save request
        const requests = JSON.parse(localStorage.getItem("inviteu_requests") || "[]")
        requests.push(requestData)
        localStorage.setItem("inviteu_requests", JSON.stringify(requests))

        // Clear cart and show success
        this.clearCart()
        this.closeModal()

        setTimeout(() => {
          this.openSuccessModal()
        }, 500)
      })
    }
  }

  // Actions
  proceedToCheckout() {
    if (this.cart.length === 0) {
      this.showNotification("Tu carrito está vacío", "warning")
      return
    }

    this.closeModal()
    setTimeout(() => {
      this.openCheckoutModal()
    }, 300)
  }

  async processPayment() {
    // Simulate payment processing
    const btn = event.target
    btn.disabled = true
    btn.textContent = "Procesando..."

    await new Promise((resolve) => setTimeout(resolve, 2000))

    this.closeModal()
    setTimeout(() => {
      this.openRequestModal()
    }, 500)
  }

  handleContactForm(e) {
    e.preventDefault()

    const btn = e.target.querySelector('button[type="submit"]')
    btn.disabled = true
    btn.textContent = "Enviando..."

    // Simulate form submission
    setTimeout(() => {
      btn.disabled = false
      btn.textContent = "Enviar Consulta"
      this.showNotification("¡Consulta enviada correctamente! Te contactaremos pronto.")
      e.target.reset()
    }, 1000)
  }

  // Utilities
  formatPrice(price) {
    return `€${price.toLocaleString("es-ES")}`
  }

  showNotification(message, type = "success") {
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => notification.classList.add("show"), 100)

    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => document.body.removeChild(notification), 300)
    }, 3000)
  }
}

// Initialize app
const app = new InviteUApp()

// Start when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => app.init())
} else {
  app.init()
}

// Make app globally available
window.app = app

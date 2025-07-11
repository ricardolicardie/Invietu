// Update UI module to use new customization module
// Enhanced UI Management with Performance Optimizations - UPDATED
import { CONFIG } from "../config.js"
import { Utils } from "./utils.js"
import { Data } from "./data.js"

export const UI = {
  currentSlide: 0,
  slideInterval: null,
  modals: new Map(),
  initialized: false,

  // Initialize UI components
  async init() {
    try {
      console.log("🎨 Initializing UI module...")

      // Initialize components in order
      await this.initializeComponents()

      // Setup global UI listeners
      this.setupGlobalListeners()

      // Setup intersection observers for animations
      this.setupIntersectionObservers()

      // Setup lazy loading
      this.setupLazyLoading()

      this.initialized = true
      console.log("✅ UI module initialized")
    } catch (error) {
      console.error("❌ UI initialization failed:", error)
    }
  },

  // Initialize all UI components
  async initializeComponents() {
    // Initialize in dependency order
    this.initSlider()
    this.initEventFiltering()
    this.loadEvents()
    this.loadPackages()
    this.loadTestimonials()
    this.setupNavigation()
    this.setupContactForm()
    this.setupModals()
    this.updateCurrentYear()
  },

  // Initialize hero slider with performance optimizations
  initSlider() {
    const slides = Utils.$$(".slide")
    const dots = Utils.$$(".dot")

    if (slides.length === 0) return

    const showSlide = (index) => {
      // Use requestAnimationFrame for smooth transitions
      requestAnimationFrame(() => {
        slides.forEach((slide, i) => {
          slide.classList.toggle("active", i === index)
        })
        dots.forEach((dot, i) => {
          dot.classList.toggle("active", i === index)
        })
        this.currentSlide = index
      })
    }

    const nextSlide = () => {
      this.currentSlide = (this.currentSlide + 1) % slides.length
      showSlide(this.currentSlide)
    }

    // Auto-advance slides
    this.slideInterval = setInterval(nextSlide, CONFIG.UI.SLIDER_INTERVAL)

    // Dot navigation with event delegation
    const dotsContainer = Utils.$(".slider-dots")
    if (dotsContainer) {
      Utils.delegate(dotsContainer, ".dot", "click", (e) => {
        const index = Array.from(dots).indexOf(e.target)
        clearInterval(this.slideInterval)
        showSlide(index)
        this.slideInterval = setInterval(nextSlide, CONFIG.UI.SLIDER_INTERVAL)
      })
    }

    // Pause on hover with better performance
    const sliderContainer = Utils.$(".slider-container")
    if (sliderContainer) {
      sliderContainer.addEventListener("mouseenter", () => {
        clearInterval(this.slideInterval)
      })
      sliderContainer.addEventListener("mouseleave", () => {
        this.slideInterval = setInterval(nextSlide, CONFIG.UI.SLIDER_INTERVAL)
      })
    }

    // Pause when page is not visible
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        clearInterval(this.slideInterval)
      } else {
        this.slideInterval = setInterval(nextSlide, CONFIG.UI.SLIDER_INTERVAL)
      }
    })
  },

  // Initialize event filtering with improved performance
  initEventFiltering() {
    const filterButtons = Utils.$$(".filter-btn")

    // Use event delegation for better performance
    const filterContainer = Utils.$(".filter-buttons")
    if (filterContainer) {
      Utils.delegate(filterContainer, ".filter-btn", "click", (e) => {
        const filter = e.target.dataset.filter

        // Update active button
        filterButtons.forEach((btn) => btn.classList.remove("active"))
        e.target.classList.add("active")

        // Filter events with animation
        this.filterEvents(filter)
      })
    }

    // Dropdown navigation
    Utils.$$(".dropdown-content a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const filter = link.dataset.filter

        Utils.scrollToSection("eventos")

        setTimeout(() => {
          const filterBtn = Utils.$(`[data-filter="${filter}"]`)
          if (filterBtn) {
            filterBtn.click()
          }
        }, 500)
      })
    })
  },

  // Enhanced event filtering with smooth animations
  filterEvents(category) {
    const eventCards = Utils.$$(".event-card")

    // Use requestAnimationFrame for smooth animations
    requestAnimationFrame(() => {
      eventCards.forEach((card, index) => {
        const cardCategory = card.dataset.category
        const shouldShow = category === "todos" || cardCategory === category

        if (shouldShow) {
          card.classList.remove("hidden")
          // Stagger animation
          card.style.animationDelay = `${index * 0.1}s`
        } else {
          card.classList.add("hidden")
        }
      })
    })
  },

  // Load events with virtual scrolling for large datasets
  loadEvents() {
    const eventsGrid = Utils.$("#eventsGrid")
    if (!eventsGrid) return

    const events = Data.events
    const eventsHTML = events
      .map(
        (event) => `
        <div class="event-card" data-category="${event.category}" data-design="${event.id}" data-price="${event.price}">
          <div class="event-image">
            <img src="${event.image}" alt="${event.name}" loading="lazy">
            <div class="event-overlay">
              <button class="btn btn-primary select-template-btn" data-event-id="${event.id}">Seleccionar Plantilla</button>
              <button class="btn btn-outline add-to-cart-btn" data-event-id="${event.id}">Agregar al Carrito</button>
            </div>
          </div>
          <div class="event-info">
            <h3 class="event-title">${event.name}</h3>
            <p class="event-description">${event.description}</p>
            <div class="event-price">Desde ${Utils.formatPrice(event.price)}</div>
          </div>
        </div>
      `,
      )
      .join("")

    eventsGrid.innerHTML = eventsHTML

    // Setup event listeners with delegation - UPDATED
    Utils.delegate(eventsGrid, ".select-template-btn", "click", (e) => {
      e.stopPropagation()
      const eventId = e.target.dataset.eventId
      this.selectTemplate(eventId)
    })

    Utils.delegate(eventsGrid, ".add-to-cart-btn", "click", (e) => {
      e.stopPropagation()
      const eventId = e.target.dataset.eventId
      if (window.Cart) {
        window.Cart.addItem(eventId, "template")
      }
    })
  },

  // Load packages with enhanced features
  loadPackages() {
    const packagesGrid = Utils.$("#packagesGrid")
    if (!packagesGrid) return

    const packages = Data.packages
    const packagesHTML = packages
      .map(
        (pkg) => `
        <div class="package-card ${pkg.featured ? "featured" : ""}">
          ${pkg.featured ? '<div class="package-badge">Más Popular</div>' : ""}
          <div class="package-header">
            <h3 class="package-name">${pkg.name}</h3>
            <div class="package-price">
              <span class="price">${Utils.formatPrice(pkg.price.max)}</span>
              <span class="price-note">${Utils.formatPrice(pkg.price.min)}</span>
            </div>
          </div>
          <div class="package-features">
            ${pkg.features
              .map(
                (feature) => `
              <div class="feature included">
                <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
                <span>${typeof feature === "string" ? feature : feature.name}</span>
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

    // Setup package button listeners with delegation
    Utils.delegate(packagesGrid, ".package-btn", "click", (e) => {
      e.preventDefault()
      const packageType = e.target.dataset.package
      if (window.Cart) {
        window.Cart.addItem(packageType, "package")
      }
    })
  },

  // Load testimonials with rating system
  loadTestimonials() {
    const testimonialsGrid = Utils.$("#testimonialsGrid")
    if (!testimonialsGrid) return

    const testimonials = Data.testimonials
    const testimonialsHTML = testimonials
      .map(
        (testimonial) => `
        <div class="testimonial-card">
          <div class="testimonial-rating">
            <div class="stars">
              ${Array(testimonial.rating)
                .fill()
                .map(
                  () => `
                <svg class="star filled" viewBox="0 0 24 24" fill="currentColor">
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
            <div class="author-info">
              <h4 class="author-name">${testimonial.name}</h4>
              <p class="author-date">${testimonial.event}</p>
            </div>
          </div>
        </div>
      `,
      )
      .join("")

    testimonialsGrid.innerHTML = testimonialsHTML
  },

  // Enhanced navigation setup
  setupNavigation() {
    const navbar = Utils.$("#navbar")
    const mobileMenuBtn = Utils.$("#mobileMenuBtn")
    const mobileMenu = Utils.$("#mobileMenu")
    const closeMenuBtn = Utils.$("#closeMenuBtn")

    // Mobile menu toggle
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

    // Close mobile menu when clicking on links
    Utils.$$(".mobile-nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active")
        document.body.style.overflow = ""
      })
    })

    // Close mobile menu when clicking outside
    if (mobileMenu) {
      mobileMenu.addEventListener("click", (e) => {
        if (e.target === mobileMenu) {
          mobileMenu.classList.remove("active")
          document.body.style.overflow = ""
        }
      })
    }

    // Smooth scrolling for anchor links
    Utils.$$('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
        const target = Utils.$(this.getAttribute("href"))
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      })
    })
  },

  // Enhanced contact form with validation
  setupContactForm() {
    const contactForm = Utils.$("#contactForm")
    if (!contactForm) return

    const validationRules = {
      name: [{ type: "required" }],
      email: [{ type: "required" }, { type: "email" }],
      phone: [{ type: "phone" }],
      "event-type": [{ type: "required" }],
    }

    if (window.Validation) {
      window.Validation.setupValidation(contactForm, validationRules)
    }

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      if (window.Validation && !window.Validation.validateForm(contactForm, validationRules)) return

      const submitBtn = contactForm.querySelector('button[type="submit"]')
      Utils.setLoading(submitBtn, true)

      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      Utils.setLoading(submitBtn, false)
      this.showNotification("¡Consulta enviada correctamente! Te contactaremos pronto.")
      contactForm.reset()
    })
  },

  // Enhanced modal management
  setupModals() {
    // Close modals with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeAllModals()
      }
    })

    // Setup modal container
    this.ensureModalContainer()
  },

  ensureModalContainer() {
    let modalContainer = Utils.$("#modalContainer")
    if (!modalContainer) {
      modalContainer = Utils.createElement("div", {
        id: "modalContainer",
        className: "modal-container",
      })
      document.body.appendChild(modalContainer)
    }
  },

  // Enhanced modal opening with lazy loading
  async openModal(modalId) {
    try {
      await this.loadModalContent(modalId)
      const modal = Utils.$(`#${modalId}`)
      if (modal) {
        modal.classList.add("active")
        document.body.style.overflow = "hidden"

        // Dispatch custom event
        document.dispatchEvent(
          new CustomEvent("modalOpened", {
            detail: { modalId },
          }),
        )

        // Track modal opening
        if (CONFIG.FEATURES.ANALYTICS) {
          this.trackEvent("modal_opened", { modal_id: modalId })
        }
      }
    } catch (error) {
      console.error("Error opening modal:", error)
      this.showNotification("Error al abrir el modal", "error")
    }
  },

  closeModal(modalId) {
    const modal = Utils.$(`#${modalId}`)
    if (modal) {
      modal.classList.remove("active")
      document.body.style.overflow = ""

      // Track modal closing
      if (CONFIG.FEATURES.ANALYTICS) {
        this.trackEvent("modal_closed", { modal_id: modalId })
      }
    }
  },

  closeAllModals() {
    Utils.$$(".modal.active").forEach((modal) => {
      modal.classList.remove("active")
    })
    document.body.style.overflow = ""
  },

  // Load modal content dynamically
  async loadModalContent(modalId) {
    const modalContainer = Utils.$("#modalContainer")
    if (!modalContainer) return

    // Check if modal already exists
    if (Utils.$(`#${modalId}`)) return

    let modalHTML = ""

    switch (modalId) {
      case "loginModal":
        modalHTML = this.getLoginModalHTML()
        break
      case "registerModal":
        modalHTML = this.getRegisterModalHTML()
        break
      case "customizationModal":
        modalHTML = this.getCustomizationModalHTML()
        break
      case "checkoutModal":
        modalHTML = this.getCheckoutModalHTML()
        break
      case "cartModal":
        modalHTML = this.getCartModalHTML()
        break
      case "requestFormModal":
        modalHTML = this.getRequestFormModalHTML()
        break
      case "successModal":
        modalHTML = this.getSuccessModalHTML()
        break
      default:
        throw new Error(`Unknown modal: ${modalId}`)
    }

    modalContainer.insertAdjacentHTML("beforeend", modalHTML)

    // Setup modal close listeners
    const modal = Utils.$(`#${modalId}`)
    const closeBtn = modal.querySelector(".close-modal")

    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closeModal(modalId))
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        this.closeModal(modalId)
      }
    })

    // Setup modal switching
    this.setupModalSwitching(modal)
  },

  setupModalSwitching(modal) {
    const switchToRegister = modal.querySelector("#switchToRegister")
    const switchToLogin = modal.querySelector("#switchToLogin")

    if (switchToRegister) {
      switchToRegister.addEventListener("click", (e) => {
        e.preventDefault()
        this.closeModal("loginModal")
        this.openModal("registerModal")
      })
    }

    if (switchToLogin) {
      switchToLogin.addEventListener("click", (e) => {
        e.preventDefault()
        this.closeModal("registerModal")
        this.openModal("loginModal")
      })
    }

    // Setup request form
    const requestForm = modal.querySelector("#requestForm")
    if (requestForm) {
      this.setupRequestForm(requestForm)
    }
  },

  // Modal HTML templates
  getLoginModalHTML() {
    return `
      <div id="loginModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Iniciar Sesión</h2>
            <button class="close-modal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" x2="6" y1="6" y2="18"/>
                <line x1="6" x2="18" y1="6" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <form id="loginForm" class="auth-form">
              <div class="form-group">
                <label for="loginEmail">Email *</label>
                <input type="email" id="loginEmail" name="email" required>
                <div class="form-error"></div>
              </div>
              <div class="form-group">
                <label for="loginPassword">Contraseña *</label>
                <input type="password" id="loginPassword" name="password" required>
                <div class="form-error"></div>
              </div>
              <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
            </form>
          </div>
        </div>
      </div>
    `
  },

  getRegisterModalHTML() {
    return `
      <div id="registerModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Registrarse</h2>
            <button class="close-modal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" x2="6" y1="6" y2="18"/>
                <line x1="6" x2="18" y1="6" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <form id="registerForm" class="auth-form">
              <div class="form-group">
                <label for="registerName">Nombre *</label>
                <input type="text" id="registerName" name="name" required>
                <div class="form-error"></div>
              </div>
              <div class="form-group">
                <label for="registerEmail">Email *</label>
                <input type="email" id="registerEmail" name="email" required>
                <div class="form-error"></div>
              </div>
              <div class="form-group">
                <label for="registerPassword">Contraseña *</label>
                <input type="password" id="registerPassword" name="password" required>
                <div class="form-error"></div>
              </div>
              <button type="submit" class="btn btn-primary">Registrarse</button>
            </form>
          </div>
        </div>
      </div>
    `
  },

  getCustomizationModalHTML() {
    return `
      <div id="customizationModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Personalización</h2>
            <button class="close-modal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" x2="6" y1="6" y2="18"/>
                <line x1="6" x2="18" y1="6" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <p>Contenido de la modal de personalización</p>
          </div>
        </div>
      </div>
    `
  },

  getCheckoutModalHTML() {
    return `
      <div id="checkoutModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Checkout</h2>
            <button class="close-modal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" x2="6" y1="6" y2="18"/>
                <line x1="6" x2="18" y1="6" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <p>Contenido de la modal de checkout</p>
          </div>
        </div>
      </div>
    `
  },

  getCartModalHTML() {
    return `
    <div id="cartModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Carrito de Compras</h2>
          <button class="close-modal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" x2="6" y1="6" y2="18"/>
              <line x1="6" x2="18" y1="6" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div id="cartItems" class="cart-items">
            <!-- Cart items will be rendered here -->
          </div>
          <div class="cart-summary">
            <div class="cart-total">
              <strong>Total: <span id="cartTotal">€0</span></strong>
            </div>
            <div class="cart-actions">
              <button class="btn btn-outline" onclick="window.Cart.clearCart()">
                Vaciar Carrito
              </button>
              <button id="proceedToCheckout" class="btn btn-primary">
                Proceder al Pago
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
  },

  getRequestFormModalHTML() {
    return `
    <div id="requestFormModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Detalles de tu Invitación</h2>
          <button class="close-modal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" x2="6" y1="6" y2="18"/>
              <line x1="6" x2="18" y1="6" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <p class="request-intro">¡Pago procesado correctamente! Ahora completa los detalles para que nuestro equipo diseñe tu invitación perfecta.</p>
          
          <form id="requestForm" class="request-form">
            <div class="form-group">
              <label for="coupleNames">Nombre(s) de los novios *</label>
              <input type="text" id="coupleNames" name="coupleNames" required placeholder="María y Carlos">
              <div class="form-error"></div>
            </div>

            <div class="form-group">
              <label for="eventDate">Fecha del evento *</label>
              <input type="date" id="eventDate" name="eventDate" required>
              <div class="form-error"></div>
            </div>

            <div class="form-group">
              <label for="eventLocation">Ciudad o ubicación *</label>
              <input type="text" id="eventLocation" name="eventLocation" required placeholder="Madrid, España">
              <div class="form-error"></div>
            </div>

            <div class="form-group">
              <label for="specialMessage">Frase o dedicatoria (opcional)</label>
              <textarea id="specialMessage" name="specialMessage" rows="3" placeholder="Una frase especial para vuestra invitación..."></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="contactEmail">Correo electrónico *</label>
                <input type="email" id="contactEmail" name="contactEmail" required>
                <div class="form-error"></div>
              </div>

              <div class="form-group">
                <label for="whatsappNumber">Número de WhatsApp *</label>
                <input type="tel" id="whatsappNumber" name="whatsappNumber" required placeholder="+34 123 456 789">
                <div class="form-error"></div>
              </div>
            </div>

            <div class="form-group">
              <label for="desiredSubdomain">Subdominio deseado (opcional)</label>
              <div class="subdomain-input">
                <input type="text" id="desiredSubdomain" name="desiredSubdomain" placeholder="maria-y-carlos">
                <span class="subdomain-suffix">.inviteu.digital</span>
              </div>
              <small class="form-help">Si no especificas uno, crearemos uno automáticamente</small>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary btn-full">
                Enviar Solicitud
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
  },

  getSuccessModalHTML() {
    return `
      <div id="successModal" class="modal">
        <div class="modal-content success-modal">
          <div class="modal-body">
            <div class="success-content">
              <div class="success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
              </div>
              <h2>¡Gracias por tu compra!</h2>
              <p class="success-message">
                Nuestro equipo está trabajando en tu invitación y la recibirás en un plazo de <strong>24 a 48 horas</strong>.
              </p>
              <p class="success-details">
                Te contactaremos al correo y WhatsApp proporcionados para coordinar cualquier detalle adicional.
              </p>
              <div class="success-actions">
                <button class="btn btn-primary" onclick="window.UI.closeModal('successModal')">
                  Continuar Navegando
                </button>
                <button class="btn btn-outline" onclick="window.location.href='#inicio'">
                  Volver al Inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  },

  // Track events for analytics
  trackEvent(eventName, eventData) {
    if (window.ga) {
      window.ga("send", "event", {
        eventCategory: "UI",
        eventAction: eventName,
        eventLabel: JSON.stringify(eventData),
      })
    }
  },

  // Show notification to the user
  showNotification(message, type = "success") {
    const notification = Utils.createElement("div", {
      className: `notification ${type}`,
      textContent: message,
    })
    document.body.appendChild(notification)

    // Automatically remove notification after 3 seconds
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 3000)
  },

  // Update current year in footer
  updateCurrentYear() {
    const yearElement = Utils.$("#currentYear")
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear()
    }
  },

  selectTemplate(eventId) {
    const event = Data.getEventById(eventId)
    if (!event) return

    this.showNotification(`Plantilla "${event.name}" seleccionada. Agrégala al carrito para continuar.`)

    // Scroll to the add to cart button
    const eventCard = Utils.$(`[data-event-id="${eventId}"]`).closest(".event-card")
    if (eventCard) {
      eventCard.scrollIntoView({ behavior: "smooth", block: "center" })
      eventCard.classList.add("selected-template")
      setTimeout(() => eventCard.classList.remove("selected-template"), 2000)
    }
  },

  setupRequestForm(form) {
    form.addEventListener("submit", async (e) => {
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
      const required = ["coupleNames", "eventDate", "eventLocation", "contactEmail", "whatsappNumber"]
      const missing = required.filter((field) => !requestData[field])

      if (missing.length > 0) {
        this.showNotification(`Campos requeridos: ${missing.join(", ")}`, "error")
        return
      }

      const submitBtn = form.querySelector('button[type="submit"]')
      Utils.setLoading(submitBtn, true)

      try {
        // Save request data
        const requests = Utils.getStorage("inviteu_requests") || []
        requests.push({
          id: Date.now().toString(),
          ...requestData,
          userId: window.Auth.currentUser?.id,
        })
        Utils.setStorage("inviteu_requests", requests)

        Utils.setLoading(submitBtn, false)

        // Close modal and show success
        this.closeModal("requestFormModal")

        setTimeout(() => {
          this.openModal("successModal")
        }, 500)
      } catch (error) {
        Utils.setLoading(submitBtn, false)
        this.showNotification("Error al enviar la solicitud", "error")
      }
    })
  },
}

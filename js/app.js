/**
 * SmartScan Go — Smartphone-Based Supermarket Scan & Go System
 * Academic Capstone Prototype | Product Ideation (Sem III, 2026-27)
 * Team: Dilan Lad, Hetvi Vora, Dhvani Patel
 * Institution: CVM University, Faculty of Engineering & Technology (GCET)
 */

"use strict";

// ==========================================================================
// 1. Product Catalogue Data Module
// ==========================================================================

const products = [
    {
        id: "1001",
        name: "Fresh Milk",
        category: "Dairy",
        price: 32,
        emoji: "🥛"
    },
    {
        id: "1002",
        name: "Red Apples",
        category: "Fresh Produce",
        price: 120,
        emoji: "🍎"
    },
    {
        id: "1003",
        name: "Whole Wheat Bread",
        category: "Bakery",
        price: 45,
        emoji: "🍞"
    },
    {
        id: "1004",
        name: "Fresh Avocado",
        category: "Fresh Produce",
        price: 80,
        emoji: "🥑"
    },
    {
        id: "1005",
        name: "Orange Juice",
        category: "Beverages",
        price: 95,
        emoji: "🧃"
    },
    {
        id: "1006",
        name: "Potato Chips",
        category: "Snacks",
        price: 30,
        emoji: "🥔"
    },
    {
        id: "1007",
        name: "Greek Yogurt",
        category: "Dairy",
        price: 55,
        emoji: "🥣"
    },
    {
        id: "1008",
        name: "Salted Butter",
        category: "Dairy",
        price: 60,
        emoji: "🧈"
    },
    {
        id: "1009",
        name: "Organic Bananas",
        category: "Fresh Produce",
        price: 40,
        emoji: "🍌"
    },
    {
        id: "1010",
        name: "Butter Croissant",
        category: "Bakery",
        price: 75,
        emoji: "🥐"
    },
    {
        id: "1011",
        name: "Cold Brew Coffee",
        category: "Beverages",
        price: 110,
        emoji: "☕"
    },
    {
        id: "1012",
        name: "Roasted Almonds",
        category: "Snacks",
        price: 150,
        emoji: "🥜"
    }
];

// ==========================================================================
// 2. Application State & Constants
// ==========================================================================

const cart = {};
const TAX_RATE = 0.05; // Illustrative 5% GST

let currentCategory = "All";
let searchQuery = "";
let messageTimeout = null;

// ==========================================================================
// 3. DOM Elements Selection
// ==========================================================================

const productGrid = document.getElementById("productGrid");
const productCountBadge = document.getElementById("productCountBadge");
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearch");
const categoryPillsContainer = document.getElementById("categoryPills");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTitleCount = document.getElementById("cartTitleCount");
const subtotalElement = document.getElementById("subtotal");
const taxElement = document.getElementById("tax");
const grandTotalElement = document.getElementById("grandTotal");
const checkoutButton = document.getElementById("checkoutButton");

const codeForm = document.getElementById("codeForm");
const productCodeInput = document.getElementById("productCode");
const appMessage = document.getElementById("appMessage");
const receiptSection = document.getElementById("receiptSection");

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

// ==========================================================================
// 4. Utility Functions (Currency, Notifications, Sanitization)
// ==========================================================================

/**
 * Format numeric value into Indian Rupee currency format (e.g., ₹120.00)
 */
function formatMoney(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

/**
 * Display non-intrusive toast feedback messages
 */
function showMessage(message, isError = false) {
    if (!appMessage) return;

    if (messageTimeout) {
        clearTimeout(messageTimeout);
    }

    appMessage.textContent = message;
    appMessage.classList.add("show");
    appMessage.classList.toggle("error", isError);

    messageTimeout = setTimeout(() => {
        appMessage.classList.remove("show");
    }, 4000);
}

// ==========================================================================
// 5. Product Catalogue Rendering & Filtering
// ==========================================================================

/**
 * Filter catalogue products according to active category and search text
 */
function getFilteredProducts() {
    return products.filter(product => {
        const matchesCategory =
            currentCategory === "All" || product.category === currentCategory;

        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
            query === "" ||
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            product.id.includes(query);

        return matchesCategory && matchesSearch;
    });
}

/**
 * Render catalogue products into the product grid
 */
function renderProducts() {
    if (!productGrid) return;

    const filtered = getFilteredProducts();

    if (productCountBadge) {
        productCountBadge.textContent = `${filtered.length} ITEM${filtered.length === 1 ? "" : "S"}`;
    }

    if (filtered.length === 0) {
        productGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <h4>No Matching Products Found</h4>
                <p>We couldn't find anything matching "${searchQuery}".</p>
                <button type="button" class="secondary-button" id="resetFilterBtn" style="margin-top: 12px; padding: 8px 14px; font-size: 12px;">
                    Clear Search &amp; Show All
                </button>
            </div>
        `;

        const resetBtn = document.getElementById("resetFilterBtn");
        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                searchQuery = "";
                if (searchInput) searchInput.value = "";
                if (clearSearchBtn) clearSearchBtn.style.display = "none";
                currentCategory = "All";
                updateCategoryPillsUI();
                renderProducts();
            });
        }
        return;
    }

    productGrid.innerHTML = filtered.map(product => `
        <article class="product-card" data-product-id="${product.id}">
            <div class="product-art" aria-hidden="true">${product.emoji}</div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h4>${product.name}</h4>
                <p class="product-code">Code: ${product.id}</p>
                <div class="product-bottom">
                    <span class="product-price">${formatMoney(product.price)}</span>
                    <button
                        class="add-button"
                        type="button"
                        data-add="${product.id}"
                        aria-label="Add ${product.name} to cart"
                        title="Add to basket"
                    >+</button>
                </div>
            </div>
        </article>
    `).join("");
}

/**
 * Synchronize category pill button active states
 */
function updateCategoryPillsUI() {
    if (!categoryPillsContainer) return;
    const buttons = categoryPillsContainer.querySelectorAll(".category-pill");
    buttons.forEach(btn => {
        const isActive = btn.dataset.category === currentCategory;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });
}

// ==========================================================================
// 6. Shopping Cart Operations
// ==========================================================================

/**
 * Add product to cart by product ID
 */
function addProduct(productId) {
    const product = products.find(item => item.id === productId);

    if (!product) {
        showMessage(`Product code "${productId}" not found. Try a code from 1001 to 1012.`, true);
        return;
    }

    if (cart[productId]) {
        cart[productId].quantity += 1;
    } else {
        cart[productId] = {
            ...product,
            quantity: 1
        };
    }

    showMessage(`Added ${product.name} to your basket.`);
    renderCart();
}

/**
 * Adjust quantity (+1 or -1) of an existing item in the cart
 */
function changeQuantity(productId, delta) {
    const item = cart[productId];
    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        delete cart[productId];
        showMessage(`Removed ${item.name} from basket.`);
    }

    renderCart();
}

/**
 * Remove an item completely from the cart
 */
function removeProduct(productId) {
    const item = cart[productId];
    if (item) {
        delete cart[productId];
        showMessage(`Removed ${item.name} from basket.`);
        renderCart();
    }
}

/**
 * Compute financial totals for items in cart
 */
function getCartTotals() {
    const items = Object.values(cart);
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const total = subtotal + tax;

    return {
        subtotal,
        tax,
        total
    };
}

/**
 * Re-render cart aside UI, item rows, badges, and financial totals
 */
function renderCart() {
    const items = Object.values(cart);
    const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

    if (cartCount) cartCount.textContent = totalQuantity;
    if (cartTitleCount) cartTitleCount.textContent = `(${totalQuantity} item${totalQuantity === 1 ? "" : "s"})`;

    if (!cartItems) return;

    if (items.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <span class="empty-icon">🛒</span>
                <h4>Your basket is empty</h4>
                <p>Select products from the catalogue or enter shelf codes above.</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = items.map(item => `
            <div class="cart-item">
                <div class="cart-item-art" aria-hidden="true">${item.emoji}</div>
                <div>
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatMoney(item.price)} each</div>
                    <div class="quantity-controls">
                        <button
                            type="button"
                            data-change="${item.id}"
                            data-amount="-1"
                            aria-label="Decrease ${item.name} quantity"
                        >−</button>
                        <span>${item.quantity}</span>
                        <button
                            type="button"
                            data-change="${item.id}"
                            data-amount="1"
                            aria-label="Increase ${item.name} quantity"
                        >+</button>
                        <button
                            type="button"
                            class="remove-button"
                            data-remove="${item.id}"
                            aria-label="Remove ${item.name}"
                        >Remove</button>
                    </div>
                </div>
                <span class="cart-item-total">${formatMoney(item.price * item.quantity)}</span>
            </div>
        `).join("");
    }

    const totals = getCartTotals();

    if (subtotalElement) subtotalElement.textContent = formatMoney(totals.subtotal);
    if (taxElement) taxElement.textContent = formatMoney(totals.tax);
    if (grandTotalElement) grandTotalElement.textContent = formatMoney(totals.total);

    if (checkoutButton) {
        checkoutButton.disabled = items.length === 0;
    }
}

// ==========================================================================
// 7. Checkout & Digital Receipt Generation
// ==========================================================================

/**
 * Generate simulated digital receipt and demonstration exit token
 */
function createReceipt() {
    const items = Object.values(cart);

    if (items.length === 0) {
        showMessage("Add at least one product before initiating checkout.", true);
        return;
    }

    const totals = getCartTotals();
    const now = new Date();

    // Unique demonstrative receipt and verification token IDs
    const receiptId = `SSG-REC-${now.getTime().toString().slice(-7)}`;
    const randomHex = Math.random().toString(36).slice(2, 6).toUpperCase();
    const verificationCode = `EXIT-PASS-${now.getFullYear()}-${randomHex}-OK`;

    const receiptIdEl = document.getElementById("receiptId");
    const receiptDateEl = document.getElementById("receiptDate");
    const receiptItemsEl = document.getElementById("receiptItems");
    const receiptSubtotalEl = document.getElementById("receiptSubtotal");
    const receiptTaxEl = document.getElementById("receiptTax");
    const receiptTotalEl = document.getElementById("receiptTotal");
    const verificationCodeEl = document.getElementById("verificationCode");

    if (receiptIdEl) receiptIdEl.textContent = receiptId;
    if (receiptDateEl) {
        receiptDateEl.textContent = now.toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
        });
    }

    if (receiptItemsEl) {
        receiptItemsEl.innerHTML = items.map(item => `
            <div class="receipt-line">
                <span>${item.name} &times; ${item.quantity}</span>
                <strong>${formatMoney(item.price * item.quantity)}</strong>
            </div>
        `).join("");
    }

    if (receiptSubtotalEl) receiptSubtotalEl.textContent = formatMoney(totals.subtotal);
    if (receiptTaxEl) receiptTaxEl.textContent = formatMoney(totals.tax);
    if (receiptTotalEl) receiptTotalEl.textContent = formatMoney(totals.total);
    if (verificationCodeEl) verificationCodeEl.textContent = verificationCode;

    if (receiptSection) {
        receiptSection.classList.remove("hidden");
        receiptSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    showMessage("Simulated checkout complete. Digital receipt and exit token generated!");
}

/**
 * Reset shopping session to a fresh basket
 */
function resetShoppingSession() {
    Object.keys(cart).forEach(productId => {
        delete cart[productId];
    });

    if (receiptSection) {
        receiptSection.classList.add("hidden");
    }

    showMessage("A fresh shopping basket is ready.");
    renderCart();

    const prototypeSection = document.getElementById("prototype");
    if (prototypeSection) {
        prototypeSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

// ==========================================================================
// 8. Event Listeners & Interactive Handlers
// ==========================================================================

// Add Product via Grid Button Click
if (productGrid) {
    productGrid.addEventListener("click", event => {
        const button = event.target.closest("[data-add]");
        if (button) {
            addProduct(button.dataset.add);
        }
    });
}

// Cart Quantity and Removal Clicks
if (cartItems) {
    cartItems.addEventListener("click", event => {
        const quantityButton = event.target.closest("[data-change]");
        const removeButton = event.target.closest("[data-remove]");

        if (quantityButton) {
            changeQuantity(
                quantityButton.dataset.change,
                Number(quantityButton.dataset.amount)
            );
        }

        if (removeButton) {
            removeProduct(removeButton.dataset.remove);
        }
    });
}

// Manual Product Code Submission
if (codeForm) {
    codeForm.addEventListener("submit", event => {
        event.preventDefault();

        const productId = productCodeInput.value.trim();

        if (!productId) {
            showMessage("Please enter a 4-digit product code.", true);
            return;
        }

        const productExists = products.some(product => product.id === productId);

        if (!productExists) {
            showMessage(`Code "${productId}" not found. Try 1001, 1002, 1003, or 1004.`, true);
            return;
        }

        addProduct(productId);
        productCodeInput.value = "";
        productCodeInput.focus();
    });
}

// Quick Test Chips Clicks
document.querySelectorAll(".code-chip").forEach(chip => {
    chip.addEventListener("click", () => {
        const code = chip.dataset.code;
        if (code) {
            addProduct(code);
        }
    });
});

// Real-Time Search Input
if (searchInput) {
    searchInput.addEventListener("input", () => {
        searchQuery = searchInput.value;
        if (clearSearchBtn) {
            clearSearchBtn.style.display = searchQuery ? "grid" : "none";
        }
        renderProducts();
    });
}

// Clear Search Button
if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", () => {
        searchQuery = "";
        searchInput.value = "";
        clearSearchBtn.style.display = "none";
        renderProducts();
        searchInput.focus();
    });
}

// Category Pills Filtering
if (categoryPillsContainer) {
    categoryPillsContainer.addEventListener("click", event => {
        const pill = event.target.closest(".category-pill");
        if (!pill) return;

        currentCategory = pill.dataset.category;
        updateCategoryPillsUI();
        renderProducts();
    });
}

// Checkout Trigger Button
if (checkoutButton) {
    checkoutButton.addEventListener("click", createReceipt);
}

// Scroll to Cart Button in Header
const cartButton = document.getElementById("cartButton");
if (cartButton) {
    cartButton.addEventListener("click", () => {
        const cartEl = document.getElementById("cart");
        if (cartEl) {
            cartEl.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
}

// Print Receipt
const printReceiptBtn = document.getElementById("printReceipt");
if (printReceiptBtn) {
    printReceiptBtn.addEventListener("click", () => {
        window.print();
    });
}

// New Shopping Basket
const newShoppingBtn = document.getElementById("newShopping");
if (newShoppingBtn) {
    newShoppingBtn.addEventListener("click", resetShoppingSession);
}

// Mobile Hamburger Menu Toggle
if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close menu on nav link click
    navMenu.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

// Auto-update Footer Copyright Year
const currentYearEl = document.getElementById("currentYear");
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}

// ==========================================================================
// 9. Application Initialization
// ==========================================================================

renderProducts();
renderCart();

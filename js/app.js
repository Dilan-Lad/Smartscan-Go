/**
 * SmartScan Go — Supermarket In-Store Self-Checkout Engine
 * Retail web application with real-time cart, shelf code lookups, and digital receipt generation.
 */

"use strict";

// ==========================================================================
// 1. Supermarket Catalogue Data Module
// ==========================================================================

const products = [
    {
        id: "1001",
        name: "Fresh Whole Milk, 1L",
        category: "Dairy",
        price: 32,
        emoji: "🥛",
        unit: "1 Litre bottle",
        badge: "Fresh Today",
        rating: 4.8,
        reviews: 142
    },
    {
        id: "1002",
        name: "Crisp Red Apples, 1kg",
        category: "Fresh Produce",
        price: 120,
        emoji: "🍎",
        unit: "1 kg pack (~5 pcs)",
        badge: "Farm Pick",
        rating: 4.6,
        reviews: 89
    },
    {
        id: "1003",
        name: "Whole Wheat Bread, 400g",
        category: "Bakery",
        price: 45,
        emoji: "🍞",
        unit: "400g loaf",
        badge: "Daily Baked",
        rating: 4.7,
        reviews: 210
    },
    {
        id: "1004",
        name: "Fresh Hass Avocado",
        category: "Fresh Produce",
        price: 80,
        emoji: "🥑",
        unit: "2 pcs pack",
        badge: "Imported",
        rating: 4.5,
        reviews: 64
    },
    {
        id: "1005",
        name: "100% Orange Juice, 1L",
        category: "Beverages",
        price: 95,
        emoji: "🧃",
        unit: "1 Litre tetra pack",
        badge: "Zero Sugar",
        rating: 4.6,
        reviews: 112
    },
    {
        id: "1006",
        name: "Classic Potato Chips",
        category: "Snacks",
        price: 30,
        emoji: "🥔",
        unit: "100g pack",
        badge: "Best Seller",
        rating: 4.9,
        reviews: 320
    },
    {
        id: "1007",
        name: "Greek Yogurt, 400g",
        category: "Dairy",
        price: 55,
        emoji: "🥣",
        unit: "400g tub",
        badge: "High Protein",
        rating: 4.7,
        reviews: 78
    },
    {
        id: "1008",
        name: "Salted Table Butter, 100g",
        category: "Dairy",
        price: 60,
        emoji: "🧈",
        unit: "100g pack",
        badge: "Dairy Fresh",
        rating: 4.8,
        reviews: 195
    },
    {
        id: "1009",
        name: "Organic Bananas, 1 Dozen",
        category: "Fresh Produce",
        price: 40,
        emoji: "🍌",
        unit: "12 pcs bunch",
        badge: "Farm Direct",
        rating: 4.6,
        reviews: 153
    },
    {
        id: "1010",
        name: "Butter Croissant, 2pcs",
        category: "Bakery",
        price: 75,
        emoji: "🥐",
        unit: "Pack of 2",
        badge: "Artisan",
        rating: 4.8,
        reviews: 91
    },
    {
        id: "1011",
        name: "Cold Brew Coffee, 250ml",
        category: "Beverages",
        price: 110,
        emoji: "☕",
        unit: "250ml bottle",
        badge: "Single Origin",
        rating: 4.7,
        reviews: 84
    },
    {
        id: "1012",
        name: "California Roasted Almonds",
        category: "Snacks",
        price: 150,
        emoji: "🥜",
        unit: "200g pouch",
        badge: "Healthy Snack",
        rating: 4.9,
        reviews: 167
    }
];

// ==========================================================================
// 2. Application State
// ==========================================================================

const cart = {};
const TAX_RATE = 0.05; // 5% GST

let currentCategory = "All";
let searchQuery = "";
let currentSort = "featured";
let toastTimeout = null;

// ==========================================================================
// 3. Currency & Utility Helpers
// ==========================================================================

/**
 * Format currency into Indian Rupees
 */
function formatINR(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

/**
 * Show a temporary toast notification
 */
function showToast(message, isError = false) {
    const toast = document.getElementById("toastNotification");
    if (!toast) return;

    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }

    toast.textContent = message;
    toast.className = `toast-notification show ${isError ? "toast-error" : ""}`;

    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 3200);
}

// ==========================================================================
// 4. Products Rendering, Filtering & Sorting
// ==========================================================================

function getFilteredAndSortedProducts() {
    let list = products.filter(product => {
        const matchesCategory =
            currentCategory === "All" || product.category === currentCategory;

        const q = searchQuery.trim().toLowerCase();
        const matchesSearch =
            q === "" ||
            product.name.toLowerCase().includes(q) ||
            product.category.toLowerCase().includes(q) ||
            product.id.includes(q);

        return matchesCategory && matchesSearch;
    });

    if (currentSort === "price-low") {
        list.sort((a, b) => a.price - b.price);
    } else if (currentSort === "price-high") {
        list.sort((a, b) => b.price - a.price);
    } else if (currentSort === "name") {
        list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
}

function renderProducts() {
    const grid = document.getElementById("productsGrid");
    const countLabel = document.getElementById("itemCountLabel");
    const heading = document.getElementById("currentCategoryHeading");

    if (!grid) return;

    const list = getFilteredAndSortedProducts();

    if (heading) {
        heading.textContent = currentCategory === "All" ? "All Departments" : currentCategory;
    }

    if (countLabel) {
        countLabel.textContent = `Showing ${list.length} product${list.length === 1 ? "" : "s"}`;
    }

    if (list.length === 0) {
        grid.innerHTML = `
            <div class="empty-catalogue">
                <div class="empty-icon">🔍</div>
                <h4>No matching products found</h4>
                <p>We couldn't find any supermarket items matching "${searchQuery}".</p>
                <button type="button" class="btn-reset-search" id="resetSearchBtn">Show All Items</button>
            </div>
        `;

        const resetBtn = document.getElementById("resetSearchBtn");
        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                searchQuery = "";
                const searchInput = document.getElementById("searchInput");
                if (searchInput) searchInput.value = "";
                currentCategory = "All";
                updateCategoryUI();
                renderProducts();
            });
        }
        return;
    }

    grid.innerHTML = list.map(item => {
        const inCartItem = cart[item.id];
        const qty = inCartItem ? inCartItem.quantity : 0;

        return `
            <article class="product-card" data-product-id="${item.id}">
                ${item.badge ? `<span class="card-badge">${item.badge}</span>` : ""}
                <div class="product-art" aria-hidden="true">${item.emoji}</div>
                <span class="product-dept">${item.category}</span>
                <h3 class="product-title">${item.name}</h3>
                <div class="product-shelf-code">Shelf Code: <strong>${item.id}</strong></div>
                <div class="product-rating">
                    <span class="rating-stars">★★★★☆</span>
                    <span class="rating-count">(${item.reviews})</span>
                </div>
                <div class="product-price-row">
                    <span class="price-currency">₹</span>
                    <span class="price-amount">${item.price.toFixed(2)}</span>
                    <span class="price-unit">/ ${item.unit}</span>
                </div>

                ${
                    qty > 0
                        ? `
                    <div class="card-stepper">
                        <button type="button" class="card-stepper-btn" data-stepper="${item.id}" data-change="-1" aria-label="Decrease quantity">−</button>
                        <span class="card-stepper-count">${qty} in basket</span>
                        <button type="button" class="card-stepper-btn" data-stepper="${item.id}" data-change="1" aria-label="Increase quantity">+</button>
                    </div>
                `
                        : `
                    <button type="button" class="add-to-cart-btn" data-add="${item.id}">
                        Add to Cart
                    </button>
                `
                }
            </article>
        `;
    }).join("");
}

function updateCategoryUI() {
    // Update sub-navigation buttons
    document.querySelectorAll(".sub-nav-item").forEach(btn => {
        const isActive = btn.dataset.category === currentCategory;
        btn.classList.toggle("active", isActive);
    });

    // Update search bar dropdown
    const select = document.getElementById("searchCategorySelect");
    if (select) {
        select.value = currentCategory;
    }
}

// ==========================================================================
// 5. Cart Operations & Drawer Logic
// ==========================================================================

function openCartDrawer() {
    const drawer = document.getElementById("cartDrawer");
    const backdrop = document.getElementById("cartBackdrop");
    if (drawer && backdrop) {
        drawer.classList.add("open");
        backdrop.classList.add("open");
    }
}

function closeCartDrawer() {
    const drawer = document.getElementById("cartDrawer");
    const backdrop = document.getElementById("cartBackdrop");
    if (drawer && backdrop) {
        drawer.classList.remove("open");
        backdrop.classList.remove("open");
    }
}

function addProductToCart(productId, openDrawer = false) {
    const product = products.find(p => p.id === productId);

    if (!product) {
        showToast(`Code "${productId}" is not in catalogue. Try 1001 to 1012.`, true);
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

    showToast(`Added ${product.name} to your basket!`);
    renderCart();
    renderProducts();

    if (openDrawer) {
        openCartDrawer();
    }
}

function updateItemQuantity(productId, delta) {
    const item = cart[productId];
    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        delete cart[productId];
        showToast(`Removed ${item.name} from basket.`);
    }

    renderCart();
    renderProducts();
}

function removeItemFromCart(productId) {
    const item = cart[productId];
    if (item) {
        delete cart[productId];
        showToast(`Removed ${item.name} from basket.`);
        renderCart();
        renderProducts();
    }
}

function getCartFinancials() {
    const items = Object.values(cart);
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const grandTotal = subtotal + tax;

    return {
        subtotal,
        tax,
        grandTotal,
        totalItems: items.reduce((acc, item) => acc + item.quantity, 0)
    };
}

function renderCart() {
    const { subtotal, tax, grandTotal, totalItems } = getCartFinancials();
    const items = Object.values(cart);

    // Header Cart Badge & Amount
    const cartCountEl = document.getElementById("cartCount");
    const navGrandTotalEl = document.getElementById("navGrandTotal");
    const drawerCartCountEl = document.getElementById("drawerCartCount");

    if (cartCountEl) cartCountEl.textContent = totalItems;
    if (navGrandTotalEl) navGrandTotalEl.textContent = formatINR(grandTotal);
    if (drawerCartCountEl) {
        drawerCartCountEl.textContent = `(${totalItems} item${totalItems === 1 ? "" : "s"})`;
    }

    // Drawer Totals
    const drawerSubtotal = document.getElementById("drawerSubtotal");
    const drawerTax = document.getElementById("drawerTax");
    const drawerGrandTotal = document.getElementById("drawerGrandTotal");
    const checkoutBtn = document.getElementById("drawerCheckoutBtn");

    if (drawerSubtotal) drawerSubtotal.textContent = formatINR(subtotal);
    if (drawerTax) drawerTax.textContent = formatINR(tax);
    if (drawerGrandTotal) drawerGrandTotal.textContent = formatINR(grandTotal);
    if (checkoutBtn) checkoutBtn.disabled = items.length === 0;

    // Drawer Items List
    const drawerBody = document.getElementById("drawerCartItems");
    if (!drawerBody) return;

    if (items.length === 0) {
        drawerBody.innerHTML = `
            <div class="empty-drawer">
                <span class="empty-drawer-icon">🛒</span>
                <h4>Your basket is empty</h4>
                <p>Browse products or enter a shelf code to fill your basket.</p>
            </div>
        `;
    } else {
        drawerBody.innerHTML = items.map(item => `
            <div class="drawer-item">
                <div class="drawer-item-art">${item.emoji}</div>
                <div>
                    <h4 class="drawer-item-name">${item.name}</h4>
                    <div class="drawer-item-unit">${formatINR(item.price)} each</div>
                    <div class="drawer-stepper">
                        <button type="button" data-drawer-change="${item.id}" data-delta="-1">−</button>
                        <span>${item.quantity}</span>
                        <button type="button" data-drawer-change="${item.id}" data-delta="1">+</button>
                        <button type="button" class="drawer-remove-link" data-drawer-remove="${item.id}">Delete</button>
                    </div>
                </div>
                <div class="drawer-item-price">${formatINR(item.price * item.quantity)}</div>
            </div>
        `).join("");
    }
}

// ==========================================================================
// 6. Checkout & Digital Receipt Modal
// ==========================================================================

function openReceiptModal() {
    const { subtotal, tax, grandTotal } = getCartFinancials();
    const items = Object.values(cart);

    if (items.length === 0) {
        showToast("Your cart is empty. Add items before checking out.", true);
        return;
    }

    // Close Cart Drawer
    closeCartDrawer();

    const now = new Date();
    const receiptId = `SSG-REC-${now.getTime().toString().slice(-7)}`;
    const randomHex = Math.random().toString(36).slice(2, 6).toUpperCase();
    const verificationCode = `EXIT-PASS-${now.getFullYear()}-${randomHex}-OK`;

    const receiptIdEl = document.getElementById("receiptId");
    const receiptDateEl = document.getElementById("receiptDate");
    const receiptItemsList = document.getElementById("receiptItemsList");
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

    if (receiptItemsList) {
        receiptItemsList.innerHTML = items.map(item => `
            <div class="receipt-line">
                <span>${item.name} &times; ${item.quantity}</span>
                <strong>${formatINR(item.price * item.quantity)}</strong>
            </div>
        `).join("");
    }

    if (receiptSubtotalEl) receiptSubtotalEl.textContent = formatINR(subtotal);
    if (receiptTaxEl) receiptTaxEl.textContent = formatINR(tax);
    if (receiptTotalEl) receiptTotalEl.textContent = formatINR(grandTotal);
    if (verificationCodeEl) verificationCodeEl.textContent = verificationCode;

    const modalBackdrop = document.getElementById("checkoutModalBackdrop");
    if (modalBackdrop) {
        modalBackdrop.classList.remove("hidden");
    }

    showToast("Checkout simulated! Digital receipt and exit pass ready.");
}

function closeReceiptModal() {
    const modalBackdrop = document.getElementById("checkoutModalBackdrop");
    if (modalBackdrop) {
        modalBackdrop.classList.add("hidden");
    }
}

function startNewBasket() {
    Object.keys(cart).forEach(id => delete cart[id]);
    closeReceiptModal();
    renderCart();
    renderProducts();
    showToast("A new shopping basket is ready!");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==========================================================================
// 7. Event Listeners Initialization
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // Initial Render
    renderProducts();
    renderCart();

    // Set Copyright Year
    const yearEl = document.getElementById("currentYear");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Toggle Cart Drawer
    const cartToggleBtn = document.getElementById("cartToggleBtn");
    const cartCloseBtn = document.getElementById("cartCloseBtn");
    const cartBackdrop = document.getElementById("cartBackdrop");

    if (cartToggleBtn) cartToggleBtn.addEventListener("click", openCartDrawer);
    if (cartCloseBtn) cartCloseBtn.addEventListener("click", closeCartDrawer);
    if (cartBackdrop) cartBackdrop.addEventListener("click", closeCartDrawer);

    // Add to Cart and Steppers on Grid
    const productsGrid = document.getElementById("productsGrid");
    if (productsGrid) {
        productsGrid.addEventListener("click", event => {
            const addBtn = event.target.closest("[data-add]");
            const stepperBtn = event.target.closest("[data-stepper]");

            if (addBtn) {
                addProductToCart(addBtn.dataset.add, false);
            } else if (stepperBtn) {
                updateItemQuantity(
                    stepperBtn.dataset.stepper,
                    Number(stepperBtn.dataset.change)
                );
            }
        });
    }

    // Steppers and Removal inside Drawer
    const drawerItems = document.getElementById("drawerCartItems");
    if (drawerItems) {
        drawerItems.addEventListener("click", event => {
            const changeBtn = event.target.closest("[data-drawer-change]");
            const removeBtn = event.target.closest("[data-drawer-remove]");

            if (changeBtn) {
                updateItemQuantity(
                    changeBtn.dataset.drawerChange,
                    Number(changeBtn.dataset.delta)
                );
            } else if (removeBtn) {
                removeItemFromCart(removeBtn.dataset.drawerRemove);
            }
        });
    }

    // Sub-Nav Category Clicks
    document.querySelectorAll(".sub-nav-item").forEach(btn => {
        btn.addEventListener("click", () => {
            currentCategory = btn.dataset.category;
            updateCategoryUI();
            renderProducts();
        });
    });

    // Search Category Select Dropdown
    const searchCatSelect = document.getElementById("searchCategorySelect");
    if (searchCatSelect) {
        searchCatSelect.addEventListener("change", e => {
            currentCategory = e.target.value;
            updateCategoryUI();
            renderProducts();
        });
    }

    // Search Input Real-Time
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            searchQuery = searchInput.value;
            renderProducts();
        });

        searchInput.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                searchQuery = searchInput.value;
                renderProducts();
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            if (searchInput) {
                searchQuery = searchInput.value;
                renderProducts();
            }
        });
    }

    // Sorting Dropdown
    const sortSelect = document.getElementById("sortSelect");
    if (sortSelect) {
        sortSelect.addEventListener("change", e => {
            currentSort = e.target.value;
            renderProducts();
        });
    }

    // Quick Code Strip Form
    const quickCodeForm = document.getElementById("quickCodeForm");
    const quickCodeInput = document.getElementById("quickCodeInput");

    if (quickCodeForm && quickCodeInput) {
        quickCodeForm.addEventListener("submit", e => {
            e.preventDefault();
            const code = quickCodeInput.value.trim();
            if (code) {
                addProductToCart(code, true);
                quickCodeInput.value = "";
            }
        });
    }

    // Sample Chips Clicks
    document.querySelectorAll(".sample-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            const code = chip.dataset.code;
            if (code) {
                addProductToCart(code, true);
            }
        });
    });

    // Nav "Scan Shelf Code" Trigger Buttons
    const openCodeModalBtn = document.getElementById("openCodeModalBtn");
    const bannerCodeBtn = document.getElementById("bannerCodeBtn");

    const focusCodeInput = () => {
        const codeInput = document.getElementById("quickCodeInput");
        if (codeInput) {
            codeInput.scrollIntoView({ behavior: "smooth", block: "center" });
            codeInput.focus();
        }
    };

    if (openCodeModalBtn) openCodeModalBtn.addEventListener("click", focusCodeInput);
    if (bannerCodeBtn) bannerCodeBtn.addEventListener("click", focusCodeInput);

    // Proceed to Checkout Button
    const checkoutBtn = document.getElementById("drawerCheckoutBtn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", openReceiptModal);
    }

    // Receipt Modal Close & Actions
    const receiptCloseBtn = document.getElementById("receiptCloseBtn");
    const printReceiptBtn = document.getElementById("printReceiptBtn");
    const newShoppingBtn = document.getElementById("newShoppingBtn");

    if (receiptCloseBtn) receiptCloseBtn.addEventListener("click", closeReceiptModal);
    if (printReceiptBtn) printReceiptBtn.addEventListener("click", () => window.print());
    if (newShoppingBtn) newShoppingBtn.addEventListener("click", startNewBasket);

    // Back to top
    const backToTop = document.getElementById("backToTop");
    if (backToTop) {
        backToTop.addEventListener("click", e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Footer department links
    document.querySelectorAll(".footer-cat-link").forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            currentCategory = link.dataset.category;
            updateCategoryUI();
            renderProducts();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });
});

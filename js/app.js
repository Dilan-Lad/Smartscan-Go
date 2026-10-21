
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
    }
];

const cart = {};

const TAX_RATE = 0.05;

const productGrid = document.getElementById("productGrid");
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

function formatMoney(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

function showMessage(message, isError = false) {
    appMessage.textContent = message;
    appMessage.classList.toggle("error", isError);
}

function renderProducts() {
    productGrid.innerHTML = products.map(product => `
        <article class="product-card">
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
                    >+</button>
                </div>
            </div>
        </article>
    `).join("");
}

function addProduct(productId) {
    const product = products.find(item => item.id === productId);

    if (!product) {
        showMessage("Product not found. Check the code and try again.", true);
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

    showMessage(`${product.name} added to your basket.`);
    renderCart();
}

function changeQuantity(productId, change) {
    const item = cart[productId];

    if (!item) {
        return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {
        delete cart[productId];
    }

    renderCart();
}

function removeProduct(productId) {
    delete cart[productId];
    showMessage("Product removed from your basket.");
    renderCart();
}

function getCartTotals() {
    const subtotal = Object.values(cart).reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);

    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;

    return {
        subtotal,
        tax,
        total: subtotal + tax
    };
}

function renderCart() {
    const items = Object.values(cart);
    const totalQuantity = items.reduce((total, item) => {
        return total + item.quantity;
    }, 0);

    cartCount.textContent = totalQuantity;
    cartTitleCount.textContent = `(${totalQuantity})`;

    if (items.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <span class="empty-icon">🛒</span>
                <h4>Your basket is empty</h4>
                <p>Add a product to get started.</p>
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
                        >Remove</button>
                    </div>
                </div>
                <span class="cart-item-total">${formatMoney(item.price * item.quantity)}</span>
            </div>
        `).join("");
    }

    const totals = getCartTotals();

    subtotalElement.textContent = formatMoney(totals.subtotal);
    taxElement.textContent = formatMoney(totals.tax);
    grandTotalElement.textContent = formatMoney(totals.total);
    checkoutButton.disabled = items.length === 0;
}

function createReceipt() {
    const items = Object.values(cart);

    if (items.length === 0) {
        showMessage("Add at least one product before checkout.", true);
        return;
    }

    const totals = getCartTotals();
    const now = new Date();
    const receiptId = `SSG-${now.getTime().toString().slice(-8)}`;
    const verificationCode = `DEMO-${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`;

    document.getElementById("receiptId").textContent = receiptId;
    document.getElementById("receiptDate").textContent =
        now.toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
        });

    document.getElementById("receiptItems").innerHTML = items.map(item => `
        <div class="receipt-line">
            <span>${item.name} × ${item.quantity}</span>
            <strong>${formatMoney(item.price * item.quantity)}</strong>
        </div>
    `).join("");

    document.getElementById("receiptTotal").textContent =
        formatMoney(totals.total);

    document.getElementById("verificationCode").textContent =
        verificationCode;

    receiptSection.classList.remove("hidden");
    receiptSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

productGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");

    if (button) {
        addProduct(button.dataset.add);
    }
});

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

codeForm.addEventListener("submit", event => {
    event.preventDefault();

    const productId = productCodeInput.value.trim();

    if (!productId) {
        showMessage("Please enter a product code.", true);
        return;
    }

    const productExists = products.some(product => product.id === productId);

    if (!productExists) {
        showMessage("Invalid code. Try a code from 1001 to 1006.", true);
        return;
    }

    addProduct(productId);
    productCodeInput.value = "";
    productCodeInput.focus();
});

checkoutButton.addEventListener("click", createReceipt);

document.getElementById("cartButton").addEventListener("click", () => {
    document.getElementById("cart").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

document.getElementById("printReceipt").addEventListener("click", () => {
    window.print();
});

document.getElementById("newShopping").addEventListener("click", () => {
    Object.keys(cart).forEach(productId => {
        delete cart[productId];
    });

    receiptSection.classList.add("hidden");
    showMessage("A new shopping basket is ready.");
    renderCart();

    document.getElementById("scanner").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

document.getElementById("currentYear").textContent =
    new Date().getFullYear();

renderProducts();
renderCart();

# SmartScan Go 🛒
### Smartphone-Based Supermarket Scan & Go Web Application

SmartScan Go is a modern, responsive supermarket self-checkout web application designed like a consumer retail platform (Amazon / Fresh Grocery). Shoppers can scan or enter shelf product codes, maintain an active cart in real time, view live budget totals, and complete simulated self-checkout with a digital exit verification pass.

---

## 🚀 Key Features

* **Amazon-Style In-Store Header:**
  * Supermarket brand & store location indicator (`Anand Supermarket`).
  * Instant search bar with department category selector (`Dairy`, `Produce`, `Bakery`, `Beverages`, `Snacks`).
  * Quick shelf code entry button.
  * Live running total and cart badge counter in the top bar.
* **Sub-Navigation Category Ribbon:**
  * One-tap department filters with active state indicators.
* **Quick Code Bar:**
  * Dedicated 4-digit shelf code input (`1001`–`1012`) with quick sample chips.
* **Amazon-Style Product Grid:**
  * Product department, title, shelf barcode reference, star ratings, and price in `₹`.
  * Dynamic **"Add to Cart"** button that transforms into an in-place quantity stepper `[ − ] qty [ + ]` once added.
* **Slide-Over Cart Drawer:**
  * Smooth right fly-out drawer showing all cart items with steppers, delete links, subtotal, 5% estimated GST, and total.
* **Simulated Checkout & Digital Receipt:**
  * Modal with order reference, date, line items, and a single-use **Store Exit Pass** with simulated barcode.
  * One-click **Print Receipt** action formatted specifically for clean printing.
  * **Start New Basket** session reset.
* **Clean Retail Footer:**
  * "Back to top" bar, department links, store policies, and project credits.

---

## 🛠️ Technology Stack

* **HTML5:** Semantic e-commerce structure.
* **CSS3:** Custom responsive layout, Amazon-style card design, slide-over drawer, and `@media print` receipt stylesheet.
* **Vanilla JavaScript:** 100% dependency-free client-side catalogue, live search, department filtering, cart state management, and exit pass generation.

---

## 💻 Running Locally

1. Clone or download this repository:
   ```bash
   git clone https://github.com/Dilan-Lad/Smartscan-Go.git
   ```
2. Open `index.html` directly in your browser or run with VS Code Live Server.
3. Or preview locally at `http://localhost:5500/`.

---

## 👥 Project Team & Attribution

* **Dilan Lad** — Lead Developer & System Architect
* **Hetvi Vora** — UI/UX Designer
* **Dhvani Patel** — Product Strategy & Feasibility
* **Institution:** CVM University, Faculty of Engineering & Technology (GCET)
* **Course:** Product Ideation (Semester III, Academic Year 2026–27)

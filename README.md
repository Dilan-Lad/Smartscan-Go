# SmartScan Go 🛒
### Smartphone-Based Supermarket Scan & Go System

> **Product Ideation Capstone Project (Semester III, Academic Year 2026–27)**  
> **Institution:** CVM University, Faculty of Engineering & Technology (GCET)  
> **Department:** Department of Computer Engineering  
> **Domain:** Smart Retail & Automated Checkout Systems  

---

## 👥 Project Team

| Name | Role | Responsibilities |
| :--- | :--- | :--- |
| **Dilan Lad** | Lead Developer & System Architect | Front-end state management, cart calculation engine, GitHub repository |
| **Hetvi Vora** | UI/UX Designer & Research Lead | 41-shopper field survey, empathy mapping, Nielsen-Norman heuristics, visual styling |
| **Dhvani Patel** | Product Analyst & Feasibility Lead | SCAMPER ideation, Pugh decision matrix, risk assessment, sustainability roadmap |

---

## 📌 Problem Statement & "How Might We"

Traditional supermarket checkout forces shoppers into lengthy stationary queues while cashiers scan items, calculate totals, collect payment, and bag goods sequentially.

> **How Might We Statement:**  
> *"How might we design a secure, user-friendly mobile self-checkout application that enables supermarket shoppers to scan items and pay digitally in real time while shopping, thereby reducing billing wait times to under 2 minutes while preventing store theft?"*  
> *(Note: The 2-minute benchmark is an engineering design goal, not a verified production result).*

---

## 📊 Primary Research Evidence (Practical 1)

* **Methodology:** Primary team-conducted field survey.
* **Sample Size:** 41 supermarket shoppers across 8 commercial hubs (Anand, Navsari, Rajkot, Surat, Bilimora, Vapi, Vadodara, and Mumbai).
* **Key Findings:**
  * **51.2%** reported billing wait time as the single most frustrating aspect of in-store shopping.
  * **61.0%** reported abandoning a checkout queue and walking away due to excessive line length.
* *Transparency Note: These figures represent our team's project evidence and are not generalized to the broader national population.*

---

## 💡 Selected Concept & Decision Matrix (Practicals 2 & 3)

### Shortlisted Concepts & Team Votes
* **I-17: Barcode + AI Recognition (Concept C2)** — 10 group votes (Selected)
* **I-20: Automatic Exit Verification** — 9 group votes
* **I-06: One-Tap Checkout** — 8 group votes
* **I-03: QR / UPI Payment Integration** — 8 group votes
* **I-11: AI-Based Theft Detection** — 7 group votes

### Weighted Decision Matrix (Criteria & Weights)
Evaluated against the Datum (Traditional Cashier Checkout):
1. **User Need Satisfaction:** 20%
2. **Security & Verification:** 18%
3. **Novelty / Innovation:** 17%
4. **Technical Feasibility:** 15%
5. **Ease of Use:** 10%
6. **Cost of Development:** 8%
7. **Scalability:** 7%
8. **Implementation Time:** 5%
* **Final Score for Concept C2:** **4.24 / 5.00 (Ranked #1)**

---

## 🛠️ Technology Stack & Constraints

Strictly built using pure web standards without heavy frameworks or external database dependencies:
* **HTML5:** Semantic architecture, accessible labels, ARIA landmarks.
* **CSS3:** Custom responsive layout, CSS grid/flexbox, native CSS tokens, print stylesheet (`@media print`).
* **Vanilla JavaScript (ES6+):** In-memory state management, real-time search & category filtering, dynamic ₹ totals, digital receipt & demo exit token generation.

---

## 🚀 Key Prototype Features

* **Interactive Catalogue:** 12 sample supermarket grocery items across 5 categories (Dairy, Fresh Produce, Bakery, Beverages, Snacks).
* **Real-Time Search & Category Filters:** Instant client-side search by item name, aisle, or 4-digit code with clean empty states.
* **Manual Product Code Entry:** Input field with validation and quick-test chip shortcuts (`1001`–`1012`).
* **Dynamic Smart Basket:** Live item count, `+` and `−` quantity controls, item removal, and auto-computed 5% GST in Indian Rupees (`₹`).
* **Simulated Checkout:** Instant order finalization with clear demo notices (no real payment taken).
* **Printable Digital Receipt:** Clean receipt layout isolating the bill during browser printing (`window.print()`).
* **Exit Verification Pass:** Demonstrative single-use digital exit token with simulated barcode pattern for audit inspection.
* **Session Reset:** One-click "Start a New Basket" to clear state for fresh demonstration.

---

## ⚖️ Project Status & Honest Distinctions

| Feature Area | Current Prototype State | Future Production Roadmap |
| :--- | :--- | :--- |
| **Barcode Scanning** | Manual 4-digit code entry + click-to-add | Live smartphone camera WebRTC / ZXing barcode scanner |
| **AI Recognition** | Visual catalogue categorization | On-device MobileNet model for loose produce classification |
| **Payment** | Simulated instant checkout | Live UPI / payment gateway transaction settlement |
| **Inventory** | In-memory JSON module (12 items) | Store POS inventory database synchronization |
| **Exit Security** | Demonstration pass token | Automated hardware exit gate / turnstile integration |

---

## 💻 Running Locally

1. Clone or download this repository:
   ```bash
   git clone https://github.com/Dilan-Lad/Smartscan-Go.git
   ```
2. Navigate into the project directory:
   ```bash
   cd Smartscan-Go
   ```
3. Open `index.html` in any modern web browser, or launch with VS Code's **Live Server** extension.

---

## 📂 Project Directory Structure

```text
Smartscan-Go/
├── .gitignore          # Git exclusions for OS & IDE artifacts
├── index.html          # Main HTML5 document containing all 8 academic sections
├── README.md           # Comprehensive project documentation
├── assets/             # Project graphics and static assets
├── css/
│   └── style.css       # Clean retail styling, responsive layout & print styles
└── js/
    └── app.js          # Product catalogue, cart management & receipt logic
```

---

## 📜 Academic Attribution

* **Course:** Product Ideation (Academic Year 2026–27)
* **Faculty:** Faculty of Engineering & Technology (FET), CVM University
* **Location:** Vallabh Vidyanagar, Gujarat, India
* **Copyright:** &copy; 2026 SmartScan Go · Dilan Lad, Hetvi Vora, Dhvani Patel

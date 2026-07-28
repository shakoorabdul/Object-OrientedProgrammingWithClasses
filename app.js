/**
 * PART 1: BASE CLASS - Transaction
 * Represents a basic financial record.
 */
class Transaction {
  constructor(id, description, amount, category, date) {
    this.id = id;
    this.description = description;
    this.amount = Number(amount);
    this.category = category;
    this.date = date;
  }

  /**
   * Returns a signed, formatted currency string.
   */
  getFormattedAmount() {
    const symbol = this.amount >= 0 ? "+" : "-";
    return `${symbol}$${Math.abs(this.amount).toFixed(2)}`;
  }

  /**
   * Summary text output.
   */
  toString() {
    return `${this.description}`;
  }

  /**
   * PART 2: STATIC METHODS
   */
  static calculateTax(amount, taxRate = 0.15) {
    return amount * taxRate;
  }

  static sortByDate(transactions) {
    return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  }
}

/**
 * SUBCLASS - RecurringTransaction
 * Extends Transaction with frequency details.
 */
class RecurringTransaction extends Transaction {
  constructor(id, description, amount, category, date, frequency) {
    super(id, description, amount, category, date);
    this.frequency = frequency;
  }

  /**
   * Overrides parent toString method.
   */
  toString() {
    return `${super.toString()} [Recurring: ${this.frequency}]`;
  }
}

/**
 * MANAGER CLASS - AccountManager
 * Manages inventory of transactions and synchronization with LocalStorage.
 */
class AccountManager {
  constructor() {
    this.transactions = [];
    this.loadFromStorage();
  }

  addTransaction(transaction) {
    this.transactions.push(transaction);
    this.saveToStorage();
  }

  deleteTransaction(id) {
    this.transactions = this.transactions.filter((t) => t.id !== id);
    this.saveToStorage();
  }

  getTotalBalance() {
    return this.transactions.reduce((acc, t) => acc + t.amount, 0);
  }

  getTotalIncome() {
    return this.transactions
      .filter((t) => t.amount > 0)
      .reduce((acc, t) => acc + t.amount, 0);
  }

  getTotalExpenses() {
    return Math.abs(
      this.transactions
        .filter((t) => t.amount < 0)
        .reduce((acc, t) => acc + t.amount, 0)
    );
  }

  filterByCategory(category) {
    if (!category || category === "All") return this.transactions;
    return this.transactions.filter(
      (t) => t.category.toLowerCase() === category.toLowerCase()
    );
  }

  saveToStorage() {
    localStorage.setItem("finance_data", JSON.stringify(this.transactions));
  }

  loadFromStorage() {
    const rawData = localStorage.getItem("finance_data");
    if (!rawData) return;

    const parsed = JSON.parse(rawData);
    // Re-instantiate generic objects back into class instances
    this.transactions = parsed.map((item) => {
      if (item.frequency) {
        return new RecurringTransaction(
          item.id, item.description, item.amount, item.category, item.date, item.frequency
        );
      }
      return new Transaction(
        item.id, item.description, item.amount, item.category, item.date
      );
    });
  }
}

// Global Manager Instance
const manager = new AccountManager();

// ==========================================
// DOM INTERACTION & EVENT LISTENERS
// ==========================================

const form = document.getElementById("transaction-form");
const filterSelect = document.getElementById("filter-category");

// Handle Form Submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const desc = document.getElementById("desc").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;
  const freq = document.getElementById("frequency").value;
  const id = Date.now().toString();

  const item = freq
    ? new RecurringTransaction(id, desc, amount, category, date, freq)
    : new Transaction(id, desc, amount, category, date);

  manager.addTransaction(item);
  form.reset();
  renderUI();
});

// Handle Category Filter Change
filterSelect.addEventListener("change", renderUI);

// Global Delete Handler
function deleteItem(id) {
  manager.deleteTransaction(id);
  renderUI();
}

// Renders dynamic content to HTML page
function renderUI() {
  const filter = filterSelect.value;
  const filteredList = manager.filterByCategory(filter);
  const sortedList = Transaction.sortByDate(filteredList);

  // Update Summary Metrics
  document.getElementById("net-balance").textContent = `$${manager.getTotalBalance().toFixed(2)}`;
  document.getElementById("total-income").textContent = `$${manager.getTotalIncome().toFixed(2)}`;
  document.getElementById("total-expenses").textContent = `$${manager.getTotalExpenses().toFixed(2)}`;

  // Update Transactions Table
  const tbody = document.getElementById("transaction-rows");
  tbody.innerHTML = sortedList.map((t) => `
    <tr>
      <td>${t.date}</td>
      <td>${t.toString()}</td>
      <td>${t.category}</td>
      <td class="${t.amount >= 0 ? 'positive' : 'negative'}">${t.getFormattedAmount()}</td>
      <td><button class="delete-btn" onclick="deleteItem('${t.id}')">Delete</button></td>
    </tr>
  `).join("");
}

// Initial UI Render on Page Load
renderUI();
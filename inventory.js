/**
 * Part 1: Base Class - Product
 * Stores general product information and provides baseline methods.
 */
class Product {
  /**
   * Initializes basic product properties.
   * @param {string} name - The product name.
   * @param {number} price - Unit price.
   * @param {number} quantity - Quantity available.
   */
  constructor(name, price, quantity) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }

  /**
   * Calculates total monetary value of current product stock.
   * @returns {number} Value of stock (price * quantity).
   */
  getTotalValue() {
    return this.price * this.quantity;
  }

  /**
   * Generates a formatted string summary of the product.
   * @returns {string} Text output of product details.
   */
  toString() {
    return `Product: ${this.name}, Price: $${this.price.toFixed(2)}, Quantity: ${this.quantity}`;
  }

  /**
   * Part 3: Static Method
   * Reduces the unit price of each product in an array by a given percentage.
   * @param {Array<Product>} products - Array containing Product/PerishableProduct objects.
   * @param {number} discount - Discount percentage as a decimal (e.g., 0.15 for 15%).
   */
  static applyDiscount(products, discount) {
    products.forEach((product) => {
      product.price -= product.price * discount;
    });
  }
}

/**
 * Part 2: Subclass - PerishableProduct
 * Extends Product to add expiration tracking.
 */
class PerishableProduct extends Product {
  /**
   * Initializes perishable product properties alongside base product properties.
   * @param {string} name - Product name.
   * @param {number} price - Unit price.
   * @param {number} quantity - Quantity available.
   * @param {string} expirationDate - Date string (YYYY-MM-DD).
   */
  constructor(name, price, quantity, expirationDate) {
    // Call parent class constructor
    super(name, price, quantity);
    this.expirationDate = expirationDate;
  }

  /**
   * Overrides base toString method to include expiration date.
   * @returns {string} Extended product summary.
   */
  toString() {
    return `${super.toString()}, Expiration Date: ${this.expirationDate}`;
  }
}

/**
 * Part 4: Store Management Class
 * Handles an inventory list of products.
 */
class Store {
  constructor() {
    this.inventory = [];
  }

  /**
   * Adds a product instance to the inventory array.
   * @param {Product} product - Instance of Product or PerishableProduct.
   */
  addProduct(product) {
    this.inventory.push(product);
  }

  /**
   * Sums the total monetary value of all items in inventory.
   * @returns {number} Combined total value.
   */
  getInventoryValue() {
    return this.inventory.reduce((total, item) => total + item.getTotalValue(), 0);
  }

  /**
   * Finds a product by its name (case-insensitive).
   * @param {string} name - Target product name.
   * @returns {Product|null} Matching product object or null if missing.
   */
  findProductByName(name) {
    const found = this.inventory.find(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );
    return found || null;
  }
}

// ==========================================
// Part 5: Testing & Execution System
// ==========================================

function runStoreSystem() {
  // 1. Initialize store instance
  const store = new Store();

  // 2. Create 5 products (3 standard, 2 perishable)
  const p1 = new Product("Laptop", 999.99, 5);
  const p2 = new Product("Wireless Mouse", 25.50, 40);
  const p3 = new Product("Keyboard", 45.00, 15);
  const perishable1 = new PerishableProduct("Whole Milk", 3.49, 20, "2026-08-15");
  const perishable2 = new PerishableProduct("Greek Yogurt", 1.99, 30, "2026-08-01");

  // 3. Add products to store
  store.addProduct(p1);
  store.addProduct(p2);
  store.addProduct(p3);
  store.addProduct(perishable1);
  store.addProduct(perishable2);

  // 4. Record initial inventory value
  const initialValue = store.getInventoryValue();
  console.log("=== INVENTORY SYSTEM INITIALIZED ===");
  console.log(`Initial Total Inventory Value: $${initialValue.toFixed(2)}`);

  // 5. Apply 15% discount using static method
  Product.applyDiscount(store.inventory, 0.15);

  // 6. Record discounted inventory value
  const discountedValue = store.getInventoryValue();
  console.log(`Total Value After 15% Discount: $${discountedValue.toFixed(2)}`);

  // 7. Find and print details of a specific product
  const searchName = "Whole Milk";
  const searchedProduct = store.findProductByName(searchName);
  console.log("\n=== SEARCH RESULTS ===");
  if (searchedProduct) {
    console.log(`Product found: ${searchedProduct.toString()}`);
  } else {
    console.log(`Product "${searchName}" not found.`);
  }

  // 8. Return values so index.html can render them on screen
  return {
    store,
    initialValue,
    discountedValue,
    searchedProduct,
    searchName
  };
}

// Run test logic on load
const systemData = runStoreSystem();
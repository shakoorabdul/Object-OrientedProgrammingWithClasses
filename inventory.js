/**
 * Stores product information and provides baseline.
 */
class Product {
  /**
   * Initializes basic product properties.
   */
  constructor(name, price, quantity) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }

  /**
   * Calculates total value of current product stock.
   */
  getTotalValue() {
    return this.price * this.quantity;
  }

  /**
   * Generates a summary of the product.
   */
  toString() {
    return `Product: ${this.name}, Price: $${this.price.toFixed(2)}, Quantity: ${this.quantity}`;
  }

  /**
   * Applying discount
   */
  static applyDiscount(products, discount) {
    products.forEach((product) => {
      product.price -= product.price * discount;
    });
  }
}

/**
 * PerishableProduct
 */
class PerishableProduct extends Product {
  /**
   * Initializes perishable product properties.
   */
  constructor(name, price, quantity, expirationDate) {
    // Call parent class constructor
    super(name, price, quantity);
    this.expirationDate = expirationDate;
  }

  /**
   * Method to include expiration date.
  */
  toString() {
    return `${super.toString()}, Expiration Date: ${this.expirationDate}`;
  }
}

/**
 * Store Management Class
 */
class Store {
  constructor() {
    this.inventory = [];
  }

  /**
   * Adds a product to the inventory array.
   */
  addProduct(product) {
    this.inventory.push(product);
  }

  /**
   * Sums the total value of all items.
   */
  getInventoryValue() {
    return this.inventory.reduce((total, item) => total + item.getTotalValue(), 0);
  }

  /**
   * Finds a product by its name.
   */
  findProductByName(name) {
    const found = this.inventory.find(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );
    return found || null;
  }
}

// Testing & Execution System
function runStoreSystem() {
  // Initialize store instance
  const store = new Store();

  // Create 5 products (3 standard, 2 perishable)
  const p1 = new Product("Laptop", 999.99, 5);
  const p2 = new Product("Wireless Mouse", 25.50, 40);
  const p3 = new Product("Keyboard", 45.00, 15);
  const perishable1 = new PerishableProduct("Whole Milk", 3.49, 20, "2026-08-15");
  const perishable2 = new PerishableProduct("Greek Yogurt", 1.99, 30, "2026-08-01");

  // Add products to store
  store.addProduct(p1);
  store.addProduct(p2);
  store.addProduct(p3);
  store.addProduct(perishable1);
  store.addProduct(perishable2);

  // Record initial inventory value
  const initialValue = store.getInventoryValue();
  console.log("=== INVENTORY SYSTEM INITIALIZED ===");
  console.log(`Initial Total Inventory Value: $${initialValue.toFixed(2)}`);

  // Apply 15% discount using static method
  Product.applyDiscount(store.inventory, 0.15);

  // Record discounted inventory value
  const discountedValue = store.getInventoryValue();
  console.log(`Total Value After 15% Discount: $${discountedValue.toFixed(2)}`);

  // Find and print details of a specific product
  const searchName = "Whole Milk";
  const searchedProduct = store.findProductByName(searchName);
  console.log("\n=== SEARCH RESULTS ===");
  if (searchedProduct) {
    console.log(`Product found: ${searchedProduct.toString()}`);
  } else {
    console.log(`Product "${searchName}" not found.`);
  }

  // Return values so index.html can render them on screen
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

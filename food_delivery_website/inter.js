let menu = [
  { id: 1, name: "Veg Burger", price: 120, category: "Burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
  { id: 2, name: "Cheese Burger", price: 150, category: "Burgers",
    image: "https://images.unsplash.com/photo-1550317138-10000687a72b?w=400&q=80" },
  { id: 3, name: "Cheese Pizza", price: 250, category: "Pizza",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" },
  { id: 4, name: "Veggie Pizza", price: 280, category: "Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80" },
  { id: 5, name: "Paneer Roll", price: 150, category: "Rolls",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80" },
  { id: 6, name: "Chicken Roll", price: 170, category: "Rolls",
    image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400&q=80" },
  { id: 7, name: "French Fries", price: 100, category: "Sides",
    image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400&q=80" },
  { id: 8, name: "Garlic Bread", price: 110, category: "Sides",
    image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=400&q=80" },
  { id: 9, name: "Cold Coffee", price: 90, category: "Drinks",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80" },
  { id: 10, name: "Lemon Soda", price: 70, category: "Drinks",
    image: "https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=400&q=80" },
  { id: 11, name: "Chocolate Cake", price: 180, category: "Desserts",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80" },
  { id: 12, name: "Ice Cream", price: 90, category: "Desserts",
    image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&q=80" }
];

let nextItemId = 13;
let cart = [];
let myOrders = [];
let nextOrderId = 1001;   
let selectedCategory = "All";
let deliveryFee = 40;
let profile = { name: "", phone: "", email: "", address: "" };
let orderStatusSteps = ["Pending", "Preparing", "Out for Delivery", "Delivered"];

function showPage(pageId, clickedButton) {
  let allPages = document.querySelectorAll(".page");
  for (let i = 0; i < allPages.length; i++) {
    allPages[i].classList.add("d-none");
  }
  document.getElementById(pageId).classList.remove("d-none");

  let allNavButtons = document.querySelectorAll(".nav-btn");
  for (let i = 0; i < allNavButtons.length; i++) {
    allNavButtons[i].classList.remove("active");
  }
  clickedButton.classList.add("active");

  if (pageId === "orders-page") displayMyOrders();
  if (pageId === "admin-page") {
    displayAdminOrders();
    displayAdminMenu();
    updateAdminStats();
  }
}

function displayCategoryButtons() {
  let buttonContainer = document.getElementById("category-buttons");

  let categories = ["All"];
  for (let i = 0; i < menu.length; i++) {
    if (categories.indexOf(menu[i].category) === -1) {
      categories.push(menu[i].category);
    }
  }

  buttonContainer.innerHTML = "";
  for (let i = 0; i < categories.length; i++) {
    let cat = categories[i];
    let activeClass = (cat === selectedCategory) ? "btn-dark" : "btn-outline-dark";

    buttonContainer.innerHTML += `
      <button class="btn ${activeClass} btn-sm me-2 mb-2" onclick="filterCategory('${cat}')">
        ${cat}
      </button>
    `;
  }
}

function filterCategory(cat) {
  selectedCategory = cat;
  displayCategoryButtons();
  displayMenu();
}

function displayMenu() {
  let menuContainer = document.getElementById("menu-list");
  let searchText = document.getElementById("search-box").value.toLowerCase();

  menuContainer.innerHTML = "";

  let filteredMenu = menu.filter(function (item) {
    let matchesCategory = (selectedCategory === "All" || item.category === selectedCategory);
    let matchesSearch = item.name.toLowerCase().includes(searchText);
    return matchesCategory && matchesSearch;
  });

  if (filteredMenu.length === 0) {
    menuContainer.innerHTML = `<p class="text-muted">No items found.</p>`;
    return;
  }

  for (let i = 0; i < filteredMenu.length; i++) {
    let item = filteredMenu[i];

    menuContainer.innerHTML += `
      <div class="col-sm-6">
        <div class="menu-card">
          <img src="${item.image}" alt="${item.name}">
          <div class="menu-card-body">
            <h5>${item.name}</h5>
            <p class="category-tag">${item.category}</p>
            <p class="price">₹${item.price}</p>
            <button class="btn btn-primary btn-sm" onclick="addToCart(${item.id})">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

function addToCart(itemId) {
  let existingItem = cart.find(function (cartItem) {
    return cartItem.id === itemId;
  });

  if (existingItem) {
    existingItem.qty = existingItem.qty + 1;
  } else {
    let selectedItem = menu.find(function (item) {
      return item.id === itemId;
    });

    cart.push({
      id: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      image: selectedItem.image,
      qty: 1
    });
  }

  displayCart();
}

function increaseQty(itemId) {
  let cartItem = cart.find(function (item) { return item.id === itemId; });
  cartItem.qty = cartItem.qty + 1;
  displayCart();
}

function decreaseQty(itemId) {
  let cartItem = cart.find(function (item) { return item.id === itemId; });
  cartItem.qty = cartItem.qty - 1;
  if (cartItem.qty <= 0) {
    removeFromCart(itemId);
  } else {
    displayCart();
  }
}

function removeFromCart(itemId) {
  cart = cart.filter(function (item) { return item.id !== itemId; });
  displayCart();
}

function displayCart() {
  let cartList = document.getElementById("cart-list");
  let cartCount = document.getElementById("cart-count");
  let subtotalEl = document.getElementById("cart-subtotal");
  let deliveryEl = document.getElementById("cart-delivery");
  let totalEl = document.getElementById("cart-total");

  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML = `<li class="empty-ticket-msg">Your cart is empty</li>`;
  }

  let subtotal = 0;
  let totalItems = 0;

  for (let i = 0; i < cart.length; i++) {
    let item = cart[i];
    subtotal = subtotal + (item.price * item.qty);
    totalItems = totalItems + item.qty;

    cartList.innerHTML += `
      <li>
        <div class="d-flex justify-content-between align-items-center">
          <span>${item.name}</span>
          <span>₹${item.price * item.qty}</span>
        </div>
        <div class="d-flex align-items-center justify-content-between mt-1">
          <div>
            <button class="qty-btn" onclick="decreaseQty(${item.id})">-</button>
            <span class="mx-2">${item.qty}</span>
            <button class="qty-btn" onclick="increaseQty(${item.id})">+</button>
          </div>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </li>
    `;
  }

  let delivery = (cart.length > 0) ? deliveryFee : 0;
  let total = subtotal + delivery;

  cartCount.innerHTML = totalItems;
  subtotalEl.innerHTML = subtotal;
  deliveryEl.innerHTML = delivery;
  totalEl.innerHTML = total;
}

function openCheckout() {
  let total = document.getElementById("cart-total").innerHTML;
  document.getElementById("modal-total").innerHTML = total;

  document.getElementById("customer-name").value = profile.name || "";
  document.getElementById("customer-phone").value = profile.phone || "";
  document.getElementById("customer-address").value = profile.address || "";
}

function placeOrder(event) {
  event.preventDefault();

  if (cart.length === 0) {
    alert("Your cart is empty! Please add some items first.");
    return;
  }

  let name = document.getElementById("customer-name").value;
  let phone = document.getElementById("customer-phone").value;
  let address = document.getElementById("customer-address").value;
  let payment = document.getElementById("payment-method").value;
  let total = Number(document.getElementById("cart-total").innerHTML);

  let newOrder = {
    orderId: nextOrderId,
    customer: name,
    phone: phone,
    address: address,
    items: cart.slice(),
    total: total,
    payment: payment,
    status: "Pending",
    date: new Date().toLocaleString()
  };

  nextOrderId = nextOrderId + 1;
  myOrders.unshift(newOrder);

  let checkoutModal = bootstrap.Modal.getInstance(document.getElementById("checkoutModal"));
  checkoutModal.hide();

  document.getElementById("order-summary-text").innerHTML =
    "Thanks " + name + "! Your order #" + newOrder.orderId +
    " of ₹" + total + " (" + payment + ") is on its way.";

  let successModal = new bootstrap.Modal(document.getElementById("successModal"));
  successModal.show();

  cart = [];
  displayCart();
  document.getElementById("checkout-form").reset();
}

function displayMyOrders() {
  let tableBody = document.getElementById("my-orders-body");

  if (myOrders.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No orders placed yet.</td></tr>`;
    return;
  }

  tableBody.innerHTML = "";

  for (let i = 0; i < myOrders.length; i++) {
    let order = myOrders[i];


    let itemNames = order.items.map(function (item) {
      return item.name + " x" + item.qty;
    }).join(", ");

    let statusClass = "status-" + order.status.replace(/\s/g, "");

    tableBody.innerHTML += `
      <tr>
        <td>#${order.orderId}</td>
        <td>${itemNames}</td>
        <td>₹${order.total}</td>
        <td>${order.payment}</td>
        <td><span class="status-badge ${statusClass}">${order.status}</span></td>
        <td>${order.date}</td>
      </tr>
    `;
  }
}

function saveProfile(event) {
  event.preventDefault();

  profile.name = document.getElementById("profile-name").value;
  profile.phone = document.getElementById("profile-phone").value;
  profile.email = document.getElementById("profile-email").value;
  profile.address = document.getElementById("profile-address").value;

  let savedMsg = document.getElementById("profile-saved-msg");
  savedMsg.classList.remove("d-none");
  setTimeout(function () {
    savedMsg.classList.add("d-none");
  }, 2000);
}

function displayAdminOrders() {
  let tableBody = document.getElementById("admin-orders-body");

  if (myOrders.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No orders yet.</td></tr>`;
    return;
  }

  tableBody.innerHTML = "";

  for (let i = 0; i < myOrders.length; i++) {
    let order = myOrders[i];

    let itemNames = order.items.map(function (item) {
      return item.name + " x" + item.qty;
    }).join(", ");

    let optionsHTML = "";
    for (let j = 0; j < orderStatusSteps.length; j++) {
      let step = orderStatusSteps[j];
      let isSelected = (step === order.status) ? "selected" : "";
      optionsHTML += `<option ${isSelected}>${step}</option>`;
    }

    tableBody.innerHTML += `
      <tr>
        <td>#${order.orderId}</td>
        <td>${order.customer}</td>
        <td>${itemNames}</td>
        <td>₹${order.total}</td>
        <td>
          <select class="form-select form-select-sm" onchange="updateOrderStatus(${order.orderId}, this.value)">
            ${optionsHTML}
          </select>
        </td>
      </tr>
    `;
  }
}

function updateOrderStatus(orderId, newStatus) {
  let order = myOrders.find(function (o) { return o.orderId === orderId; });
  order.status = newStatus;
  displayAdminOrders();
  updateAdminStats();
}

function displayAdminMenu() {
  let tableBody = document.getElementById("admin-menu-body");
  tableBody.innerHTML = "";

  for (let i = 0; i < menu.length; i++) {
    let item = menu[i];

    tableBody.innerHTML += `
      <tr>
        <td><img src="${item.image}" class="table-thumb" alt="${item.name}"></td>
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>₹${item.price}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary" onclick="openEditItemForm(${item.id})">Edit</button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteMenuItem(${item.id})">Delete</button>
        </td>
      </tr>
    `;
  }
}

function openAddItemForm() {
  document.getElementById("menu-item-modal-title").innerHTML = "Add Menu Item";
  document.getElementById("menu-item-form").reset();
  document.getElementById("item-id").value = "";
}

function openEditItemForm(itemId) {
  let item = menu.find(function (m) { return m.id === itemId; });

  document.getElementById("menu-item-modal-title").innerHTML = "Edit Menu Item";
  document.getElementById("item-id").value = item.id;
  document.getElementById("item-name").value = item.name;
  document.getElementById("item-category").value = item.category;
  document.getElementById("item-price").value = item.price;
  document.getElementById("item-image").value = item.image;

  let modal = new bootstrap.Modal(document.getElementById("menuItemModal"));
  modal.show();
}

function saveMenuItem(event) {
  event.preventDefault();

  let id = document.getElementById("item-id").value;
  let name = document.getElementById("item-name").value;
  let category = document.getElementById("item-category").value;
  let price = Number(document.getElementById("item-price").value);
  let image = document.getElementById("item-image").value || "https://via.placeholder.com/300x200?text=Food";

  if (id) {
    let item = menu.find(function (m) { return m.id === Number(id); });
    item.name = name;
    item.category = category;
    item.price = price;
    item.image = image;
  } else {
    menu.push({
      id: nextItemId,
      name: name,
      category: category,
      price: price,
      image: image
    });
    nextItemId = nextItemId + 1;
  }

  let modal = bootstrap.Modal.getInstance(document.getElementById("menuItemModal"));
  modal.hide();

  displayAdminMenu();
  displayCategoryButtons();
  displayMenu();
  updateAdminStats();
}

function deleteMenuItem(itemId) {
  let confirmDelete = confirm("Are you sure you want to delete this item?");
  if (!confirmDelete) return;

  menu = menu.filter(function (item) { return item.id !== itemId; });

  displayAdminMenu();
  displayCategoryButtons();
  displayMenu();
  updateAdminStats();
}

function updateAdminStats() {
  let totalRevenue = 0;
  let pendingCount = 0;

  for (let i = 0; i < myOrders.length; i++) {
    totalRevenue = totalRevenue + myOrders[i].total;
    if (myOrders[i].status !== "Delivered") {
      pendingCount = pendingCount + 1;
    }
  }

  document.getElementById("stat-total-orders").innerHTML = myOrders.length;
  document.getElementById("stat-revenue").innerHTML = "₹" + totalRevenue;
  document.getElementById("stat-pending").innerHTML = pendingCount;
  document.getElementById("stat-menu-items").innerHTML = menu.length;
}

function showAdminTab(tabId, clickedButton) {
  let allTabs = document.querySelectorAll(".admin-tab-content");
  for (let i = 0; i < allTabs.length; i++) {
    allTabs[i].classList.add("d-none");
  }
  document.getElementById(tabId).classList.remove("d-none");

  let allButtons = document.querySelectorAll(".admin-tab");
  for (let i = 0; i < allButtons.length; i++) {
    allButtons[i].classList.remove("btn-dark");
    allButtons[i].classList.add("btn-outline-dark");
  }
  clickedButton.classList.remove("btn-outline-dark");
  clickedButton.classList.add("btn-dark");
}


displayCategoryButtons();
displayMenu();
displayCart();

// Expose functions to global `window` so inline handlers work after bundling
if (typeof window !== 'undefined') {
  Object.assign(window, {
    showPage,
    displayCategoryButtons,
    filterCategory,
    displayMenu,
    addToCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    displayCart,
    openCheckout,
    placeOrder,
    displayMyOrders,
    saveProfile,
    displayAdminOrders,
    updateOrderStatus,
    displayAdminMenu,
    openAddItemForm,
    openEditItemForm,
    saveMenuItem,
    deleteMenuItem,
    updateAdminStats,
    showAdminTab
  });
}


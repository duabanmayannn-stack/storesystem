// Array to store cart items
let cart = [];

// Functions for Sidenav Navigation
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

// 1. Add item to cart
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: name, price: price, quantity: 1 });
    }
    updateCartUI();
}

// 2. Change Item Quantity (+ or -)
function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.name !== name);
        }
    }
    updateCartUI();
}

// 3. Render Cart & Calculate Total
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cartItems');
    const subtotalElement = document.getElementById('subtotalVal');
    const totalElement = document.getElementById('totalVal');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">No items selected</p>';
        subtotalElement.textContent = '₱0.00';
        totalElement.textContent = '₱0.00';
        return;
    }

    let cartHTML = '';
    let grandTotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        grandTotal += itemTotal;

        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">₱${item.price.toFixed(2)} x ${item.quantity}</span>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                    <strong>₱${itemTotal.toFixed(2)}</strong>
                    <button class="qty-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = cartHTML;
    subtotalElement.textContent = `₱${grandTotal.toFixed(2)}`;
    totalElement.textContent = `₱${grandTotal.toFixed(2)}`;
}

// 4. Pay / Checkout Button
function processCheckout() {
    if (cart.length === 0) {
        alert("Pahabol: Mag-select sa og items bag-o mag-pay!");
        return;
    }
    
    let totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Total Amount: ₱${totalAmount.toFixed(2)}\n\nSalamat sa pagpalit! Order successful.`);
    
    // Reset cart after payment
    cart = [];
    updateCartUI();
}

// 5. Category Filtering
document.addEventListener("DOMContentLoaded", () => {
    const categoryTabs = document.querySelectorAll(".cat-item");
    const productCards = document.querySelectorAll(".item-card");
    const searchInput = document.getElementById("searchInput");

    categoryTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            categoryTabs.forEach(c => c.classList.remove("active"));
            tab.classList.add("active");

            const selectedCategory = tab.getAttribute("data-cat");
            filterProducts(selectedCategory, searchInput.value);
        });
    });

    // 6. Live Search Filter
    searchInput.addEventListener("input", () => {
        const activeCategory = document.querySelector(".cat-item.active").getAttribute("data-cat");
        filterProducts(activeCategory, searchInput.value);
    });

    function filterProducts(category, query) {
        const searchTerm = query.toLowerCase().trim();

        productCards.forEach(card => {
            const productName = card.querySelector("h3").innerText.toLowerCase();
            const productCat = card.getAttribute("data-category");

            const matchesCategory = (category === "All" || productCat === category);
            const matchesSearch = productName.includes(searchTerm);

            if (matchesCategory && matchesSearch) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    }
});
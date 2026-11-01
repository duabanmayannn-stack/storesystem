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
        document.getElementById('cashInput').value = '';
        document.getElementById('changeVal').textContent = '₱0.00';
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
    
    // Automatic re-compute ng change kung may nakalagay na sa cash input
    calculateChange();
}

// 4. Calculate Change Automatically when typing cash
function calculateChange() {
    let totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cashInput = document.getElementById('cashInput').value;
    const changeElement = document.getElementById('changeVal');

    if (cashInput === "" || isNaN(cashInput)) {
        changeElement.textContent = '₱0.00';
        changeElement.style.color = "#2e7d32";
        return;
    }

    let cashGiven = parseFloat(cashInput);
    let change = cashGiven - totalAmount;

    if (change >= 0) {
        changeElement.textContent = `₱${change.toFixed(2)}`;
        changeElement.style.color = "#2e7d32"; // Green kung sapat o sobra
    } else {
        changeElement.textContent = `-₱${Math.abs(change).toFixed(2)}`;
        changeElement.style.color = "#e53935"; // Red kung kulang pa ang pera
    }
}

// 5. Pay / Checkout Button
function processCheckout() {
    if (cart.length === 0) {
        alert("Pahabol: Mag-select sa og items bag-o mag-pay!");
        return;
    }
    
    let totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let cashGivenInput = document.getElementById('cashInput').value;

    if (cashGivenInput === "" || isNaN(cashGivenInput)) {
        alert("Palihog og butang sa kwarta (Cash Given) sa dili pa mag-checkout!");
        return;
    }

    let cashGiven = parseFloat(cashGivenInput);

    if (cashGiven < totalAmount) {
        alert("Kulang ang kwarta! Palihog og dugang sa cash.");
        return;
    }

    let change = cashGiven - totalAmount;
    alert(`Total: ₱${totalAmount.toFixed(2)}\nCash: ₱${cashGiven.toFixed(2)}\nChange: ₱${change.toFixed(2)}\n\nSalamat sa pagpalit! Order successful.`);
    
    // Reset cart and inputs after payment
    cart = [];
    document.getElementById('cashInput').value = '';
    updateCartUI();
}

// 6. Category Filtering & Search
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

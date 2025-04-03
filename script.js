// Database simulation
const carDatabase = [
    {
        id: 1,
        make: 'Toyota',
        model: 'Camry',
        year: 2023,
        price: 29999,
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        features: ['Automatic', '4-Cylinder', 'Sedan', 'Bluetooth'],
        mileage: 5000
    },
    {
        id: 2,
        make: 'Honda',
        model: 'Accord',
        year: 2023,
        price: 31999,
        image: 'https://cdn.prod.website-files.com/62f50791f9b93f9c60c6b70a/6560c3487dee9697974d14de_Honda_Accord_(CV3)_EX_eHEV%2C_2021%2C_front-p-800.jpg',
        features: ['Automatic', '4-Cylinder', 'Sedan', 'Apple CarPlay'],
        mileage: 3000
    },
    {
        id: 3,
        make: 'Ford',
        model: 'Mustang',
        year: 2023,
        price: 42999,
        image: 'https://hips.hearstapps.com/hmg-prod/images/4e9a7794-1663012415.jpg?crop=1xw:1xh;center,top&resize=980:*',
        features: ['Automatic', 'V8', 'Coupe', 'Leather Seats'],
        mileage: 2000
    },
    {
        id: 4,
        make: 'Chevrolet',
        model: 'Tahoe',
        year: 2023,
        price: 54999,
        image: 'https://www.motortrend.com/uploads/2023/02/2023-Chevrolet-Tahoe-Z71-012.jpg',
        features: ['Automatic', 'V8', 'SUV', 'Third Row'],
        mileage: 4000
    },
    {
        id: 5,
        make: 'BMW',
        model: 'X5',
        year: 2023,
        price: 65999,
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        features: ['Automatic', 'V6', 'SUV', 'Premium Package'],
        mileage: 1500
    },
    {
        id: 6,
        make: 'Mercedes-Benz',
        model: 'E-Class',
        year: 2023,
        price: 72999,
        image: 'https://media.evo.co.uk/image/private/s--hCniKi2M--/f_auto,t_content-image-full-desktop@1/v1682436220/evo/2023/04/2023%20Mercedes%20Eclass.jpg',
        features: ['Automatic', 'V6', 'Sedan', 'Luxury Package'],
        mileage: 1000
    },
    {
        id: 7,
        make: 'Tesla',
        model: 'Model 3',
        year: 2023,
        price: 48999,
        image: 'https://www.shop4tesla.com/cdn/shop/articles/lohnt-sich-ein-gebrauchtes-tesla-model-3-vor-und-nachteile-833053.jpg?format=webp&pad_color=ffffff&v=1733570691&width=640',
        features: ['Electric', 'Autopilot', 'Sedan', 'Tech Package'],
        mileage: 2500
    },
    {
        id: 8,
        make: 'Audi',
        model: 'Q7',
        year: 2023,
        price: 58999,
        image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        features: ['Automatic', 'V6', 'SUV', 'Premium Plus'],
        mileage: 1800
    },
    {
        id: 9,
        make: 'Lexus',
        model: 'RX',
        year: 2023,
        price: 56999,
        image: 'https://imageio.forbes.com/specials-images/imageserve/631a6e12adc7714035b586d2/2023-Lexus-2023-RX-350h-Premium-AWD-Front-Driving/960x0.jpg?format=jpg&width=1440',
        features: ['Automatic', 'V6', 'SUV', 'F Sport'],
        mileage: 1200
    },
    {
        id: 10,
        make: 'Porsche',
        model: 'Cayenne',
        year: 2023,
        price: 84999,
        image: 'https://www.motortrend.com/uploads/2023/02/2023-Porsche-Cayenne-E-Hybrid-three-quarter-view-33.jpg',
        features: ['Automatic', 'V8', 'SUV', 'Sport Package'],
        mileage: 800

    },
    {
        id: 11,
        make: 'Toyota',
        model: 'C-HR',
        year: 2023,
        price: 29999,
        image: 'https://scene7.toyota.eu/is/image/toyotaeurope/C-HR+HYBRID-2?wid=1600&fit=fit,1&ts=1740388742102&resMode=sharp2&op_usm=1.75,0.3,2,0',
        features: ['Automatic', '4-Cylinder', 'SUV', 'Bluetooth'],
        mileage: 5000
    },
];

// User database simulation
const userDatabase = [];
let currentUser = null;
let shoppingCart = [];
let isBlackFriday = false;

// DOM Elements
const carListings = document.getElementById('car-listings');
const makeFilter = document.getElementById('make-filter');
const priceFilter = document.getElementById('price-filter');
const blackFridayBtn = document.getElementById('black-friday-btn');
const cartCount = document.getElementById('cart-count');
const cartLink = document.getElementById('cart-link');
const loginLink = document.getElementById('login-link');
const registerLink = document.getElementById('register-link');
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const cartModal = document.getElementById('cart-modal');
const checkoutModal = document.getElementById('checkout-modal');
const closeButtons = document.querySelectorAll('.close');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const cartItems = document.getElementById('cart-items');
const checkoutForm = document.getElementById('checkout-form');
const checkoutBtn = document.getElementById('checkout-btn');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayCars();
    populateMakeFilter();
    setupEventListeners();
});

function setupEventListeners() {
    // Filter event listeners
    makeFilter.addEventListener('change', filterCars);
    priceFilter.addEventListener('change', filterCars);
    blackFridayBtn.addEventListener('click', toggleBlackFriday);
    
    // Modal open buttons
    loginLink.addEventListener('click', () => openModal(loginModal));
    registerLink.addEventListener('click', () => openModal(registerModal));
    cartLink.addEventListener('click', () => {
        updateCartModal();
        openModal(cartModal);
    });
    
    // Modal close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });
    
    // Form submissions
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    checkoutBtn.addEventListener('click', () => openModal(checkoutModal));
    checkoutForm.addEventListener('submit', handleCheckout);
}

function displayCars(cars = carDatabase) {
    carListings.innerHTML = '';
    
    cars.forEach(car => {
        const discountedPrice = isBlackFriday ? car.price * 0.85 : car.price;
        const isDiscounted = isBlackFriday && discountedPrice < car.price;
        
        const carCard = document.createElement('div');
        carCard.className = `car-card ${isDiscounted ? 'discounted' : ''}`;
        carCard.innerHTML = `
            <img src="${car.image}" alt="${car.make} ${car.model}" class="car-image">
            <div class="car-details">
                <h3>${car.model}</h3>
                <p class="car-make">${car.make} • ${car.year} • ${car.mileage.toLocaleString()} miles</p>
                <div class="car-price">
                    ${isDiscounted ? `<span class="original">$${car.price.toLocaleString()}</span>` : ''}
                    <span class="${isDiscounted ? 'discounted' : ''}">$${discountedPrice.toLocaleString()}</span>
                </div>
                <div class="car-features">
                    ${car.features.map(feature => `<span>${feature}</span>`).join('')}
                </div>
                <div class="car-actions">
                    <button class="add-to-cart" data-id="${car.id}">Add to Cart</button>
                    <button class="view-details">Details</button>
                </div>
            </div>
        `;
        
        carListings.appendChild(carCard);
    });
    
    // Add event listeners to the new buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

function populateMakeFilter() {
    const makes = [...new Set(carDatabase.map(car => car.make))];
    makes.forEach(make => {
        const option = document.createElement('option');
        option.value = make;
        option.textContent = make;
        makeFilter.appendChild(option);
    });
}

function filterCars() {
    const selectedMake = makeFilter.value;
    const selectedPrice = priceFilter.value;
    
    let filteredCars = carDatabase;
    
    if (selectedMake !== 'all') {
        filteredCars = filteredCars.filter(car => car.make === selectedMake);
    }
    
    if (selectedPrice !== 'all') {
        const [min, max] = selectedPrice.split('-').map(part => {
            if (part.endsWith('+')) return parseInt(part) || Infinity;
            return parseInt(part) || 0;
        });
        
        filteredCars = filteredCars.filter(car => {
            const price = isBlackFriday ? car.price * 0.85 : car.price;
            return price >= min && price <= max;
        });
    }
    
    displayCars(filteredCars);
}

function toggleBlackFriday() {
    isBlackFriday = !isBlackFriday;
    blackFridayBtn.textContent = isBlackFriday ? 'Remove Black Friday Deals' : 'Apply Black Friday Deals';
    filterCars();
}

// Modal functions
function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Cart functions
function addToCart(event) {
    const carId = parseInt(event.target.dataset.id);
    const car = carDatabase.find(car => car.id === carId);
    
    if (!car) return;
    
    const existingItem = shoppingCart.find(item => item.id === carId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        shoppingCart.push({
            ...car,
            quantity: 1,
            discountedPrice: isBlackFriday ? car.price * 0.85 : car.price
        });
    }
    
    updateCartCount();
    showCartNotification();
}

function removeFromCart(carId) {
    shoppingCart = shoppingCart.filter(item => item.id !== carId);
    updateCartCount();
    updateCartModal();
    
    if (shoppingCart.length === 0) {
        checkoutBtn.disabled = true;
    }
}

function updateCartCount() {
    const totalItems = shoppingCart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartModal() {
    cartItems.innerHTML = '';
    
    if (shoppingCart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        checkoutBtn.disabled = true;
        return;
    }
    
    checkoutBtn.disabled = false;
    
    shoppingCart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.make} ${item.model}">
            <div class="cart-item-info">
                <h4>${item.make} ${item.model}</h4>
                <p>$${item.discountedPrice.toLocaleString()} x ${item.quantity}</p>
            </div>
            <div class="cart-item-price">
                $${(item.discountedPrice * item.quantity).toLocaleString()}
            </div>
            <button class="remove-item" data-id="${item.id}">&times;</button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            removeFromCart(parseInt(e.target.dataset.id));
        });
    });
    
    // Update totals
    const subtotal = shoppingCart.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    
    document.getElementById('cart-subtotal').textContent = subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('cart-tax').textContent = tax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    document.getElementById('cart-total').textContent = total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

function showCartNotification() {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = 'Item added to cart!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// User authentication functions
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Simple validation
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }
    
    // Find user in database
    const user = userDatabase.find(user => user.email === email && user.password === password);
    
    if (user) {
        currentUser = user;
        closeModal(loginModal);
        updateAuthUI();
        alert(`Welcome back, ${user.name}!`);
    } else {
        alert('Invalid email or password');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (password.length < 8) {
        alert('Password must be at least 8 characters');
        return;
    }
    
    // Check if user already exists
    if (userDatabase.some(user => user.email === email)) {
        alert('Email already registered');
        return;
    }
    
    // Add new user
    const newUser = { name, email, password };
    userDatabase.push(newUser);
    currentUser = newUser;
    
    closeModal(registerModal);
    updateAuthUI();
    alert(`Welcome, ${name}! Your account has been created.`);
}

function updateAuthUI() {
    if (currentUser) {
        document.getElementById('auth-links').innerHTML = `
            <span>Welcome, ${currentUser.name}</span> | 
            <a href="#" id="logout-link">Logout</a>
        `;
        document.getElementById('logout-link').addEventListener('click', handleLogout);
    } else {
        document.getElementById('auth-links').innerHTML = `
            <a href="#" id="login-link">Login</a> | 
            <a href="#" id="register-link">Register</a>
        `;
        // Re-add event listeners
        document.getElementById('login-link').addEventListener('click', () => openModal(loginModal));
        document.getElementById('register-link').addEventListener('click', () => openModal(registerModal));
    }
}

function handleLogout() {
    currentUser = null;
    updateAuthUI();
    alert('You have been logged out');
}

// Checkout functions
function handleCheckout(event) {
    event.preventDefault();
    
    if (!currentUser) {
        alert('Please login to complete your purchase');
        openModal(loginModal);
        return;
    }
    
    if (shoppingCart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    const name = document.getElementById('checkout-name').value;
    const address = document.getElementById('checkout-address').value;
    const card = document.getElementById('checkout-card').value;
    const expiry = document.getElementById('checkout-expiry').value;
    const cvv = document.getElementById('checkout-cvv').value;
    
    // Simple validation
    if (!name || !address || !card || !expiry || !cvv) {
        alert('Please fill in all fields');
        return;
    }
    
    if (card.length !== 16 || !/^\d+$/.test(card)) {
        alert('Please enter a valid 16-digit card number');
        return;
    }
    
    if (!/^\d{3}$/.test(cvv)) {
        alert('Please enter a valid 3-digit CVV');
        return;
    }
    
    // In a real app, you would send this data to your server
    const order = {
        userId: currentUser.email,
        items: shoppingCart,
        shippingAddress: address,
        paymentMethod: `Card ending in ${card.slice(-4)}`,
        orderDate: new Date().toISOString(),
        status: 'Processing'
    };
    
    // Simulate saving to database
    console.log('Order placed:', order);
    
    // Clear cart
    shoppingCart = [];
    updateCartCount();
    updateCartModal();
    
    closeModal(checkoutModal);
    closeModal(cartModal);
    
    alert('Thank you for your purchase! Your order has been placed.');
}
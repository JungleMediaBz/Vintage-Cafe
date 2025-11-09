document.addEventListener('DOMContentLoaded', () => {
  // --- HERO SLIDER ---
  const textSlides = document.querySelectorAll('.hero-slide');
  const imageSlides = document.querySelectorAll('.image-slide');

  if (textSlides.length > 0 && imageSlides.length > 0) {
    let currentSlide = 0;
    const showSlide = (index) => {
      textSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
      imageSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    };
    setInterval(() => {
      currentSlide = (currentSlide + 1) % textSlides.length;
      showSlide(currentSlide);
    }, 4000); // Change slide every 4 seconds
  }
  
  // --- MENU PAGE LOGIC ---
  const menuItems = document.querySelectorAll('.menu-item-selectable');
  const orderActions = document.getElementById('order-actions');
  const cartCountSpan = document.getElementById('cart-count');
  const placeOrderBtn = document.getElementById('btn-place-order');

  let cart = JSON.parse(localStorage.getItem('bleuBakeryCart')) || [];

  const updateCartDisplay = () => {
    if (!cartCountSpan || !orderActions) return; // Only run on menu page

    // Highlight selected items on page load
    const cartItemNames = cart.map(item => item.name);
    let totalItems = 0;
    menuItems.forEach(menuItem => {
      const itemName = menuItem.dataset.name;
      const quantityEl = menuItem.querySelector('.item-quantity');
      const cartItem = cart.find(item => item.name === itemName);

      if (cartItem) {
        quantityEl.textContent = cartItem.quantity;
        menuItem.classList.add('selected');
        totalItems += cartItem.quantity;
      } else {
        quantityEl.textContent = 0;
        menuItem.classList.remove('selected');
      }
    });

    if (totalItems > 0) {
      cartCountSpan.textContent = totalItems;
      orderActions.style.display = 'block';
    } else {
      orderActions.style.display = 'none';
    }
  };

  const updateCart = (name, price, change) => {
    const itemIndex = cart.findIndex(item => item.name === name);
    if (itemIndex > -1) {
      cart[itemIndex].quantity += change;
      if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1); // Remove if quantity is 0 or less
      }
    } else if (change > 0) {
      cart.push({ name, price: parseFloat(price), quantity: 1 });
    }
    localStorage.setItem('bleuBakeryCart', JSON.stringify(cart));
    updateCartDisplay();
  };

  menuItems.forEach(menuItem => {
    const itemName = menuItem.dataset.name;
    const itemPrice = menuItem.dataset.price;
    const plusBtn = menuItem.querySelector('.plus-btn');
    const minusBtn = menuItem.querySelector('.minus-btn');

    plusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateCart(itemName, itemPrice, 1);
    });

    minusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateCart(itemName, itemPrice, -1);
    });
  });

  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', () => {
      window.location.href = 'order.html';
    });
  }

  // --- ORDER PAGE LOGIC ---
  const orderSummaryList = document.getElementById('order-summary-list');
  const orderTotalP = document.getElementById('order-total');
  const checkoutForm = document.getElementById('checkout-form');
  const orderSection = document.getElementById('order-section');

  if (orderSummaryList) { // Only run on order page
    let total = 0;
    orderSummaryList.innerHTML = ''; // Clear list before populating
    cart.forEach(item => {
      const li = document.createElement('li');
      const itemTotal = item.price * item.quantity;
      li.innerHTML = `<span>${item.name} (x${item.quantity})</span> <span>$${itemTotal.toFixed(2)}</span>`;
      orderSummaryList.appendChild(li);
      total += itemTotal;
    });
    orderTotalP.textContent = `Total: $${total.toFixed(2)}`;

    if (cart.length === 0) {
      orderSection.innerHTML = '<h1 class="section-title">Your Cart is Empty</h1><p><a href="menu.html" style="color:white;">Go back to the menu to add items.</a></p>';
    } else {
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const location = document.getElementById('pickup-location').value;
        if (!location) {
          alert('Please select a pickup location.');
          return;
        }
        localStorage.removeItem('bleuBakeryCart'); // Clear cart
        orderSection.innerHTML = `<div class="logo" style="display: flex; justify-content: center; margin-bottom: 20px;"><img src="images/logo-new.png" alt="Bleu Bakery Logo" style="height: 80px;"></div><h1 class="section-title">Thank You!</h1><p class="about-text">Your order has been placed. It will be ready for pickup at <strong>${location}</strong> shortly.</p><p><a href="index.html" style="color:white;">Back to Home</a></p>`;
      });
    }
  }

  // Initial call on page load
  updateCartDisplay();

  // --- GENERAL PAGE SCRIPTS ---

  // Button hover effects and interactions
  document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // Order button interactions on homepage
  document.querySelectorAll('.btn-order').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'menu.html';
    });
  });

  // Link the main "View Menu" button on the homepage hero section
  document.querySelector('.hero .btn-discover')?.addEventListener('click', () => {
    window.location.href = 'menu.html';
  });

  document.querySelector('.btn-read-more')?.addEventListener('click', () => {
    window.location.href = 'about.html';
  });

  // Interactive hover effects for feature items
  document.querySelectorAll('.feature-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.background = 'rgba(255, 255, 255, 0.15)';
      this.style.transform = 'translateY(-3px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.background = 'rgba(255, 255, 255, 0.05)';
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Loading animation for images
  document.querySelectorAll('img').forEach(img => {
    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.style.opacity = '0';
      img.addEventListener('load', function() {
        this.style.transition = 'opacity 0.5s ease-in-out';
        this.style.opacity = '1';
      });
    }
  });
});

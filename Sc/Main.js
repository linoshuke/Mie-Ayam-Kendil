// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeNavigation();
    initializeOrderSystem();
    initializeContactForm();
    initializeAnimations();
    initializeResponsive();
});

// Navigation functionality
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    navbar.appendChild(menuToggle);

    // Add scroll event listener for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.backgroundColor = '#fff';
            navbar.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        }
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('active');
        menuToggle.innerHTML = navLinks.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            const headerOffset = 80;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu after clicking
            document.querySelector('.nav-links').classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// Order system functionality
function initializeOrderSystem() {
    const orderButtons = document.querySelectorAll('.order-button');
    
    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const itemName = menuItem.querySelector('h3').textContent;
            const itemPrice = menuItem.querySelector('.price').textContent;
            
            showOrderModal(itemName, itemPrice);
        });
    });
}

function showOrderModal(itemName, price) {
    const modal = document.createElement('div');
    modal.className = 'order-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Konfirmasi Pesanan</h3>
            <div id="orderItems">
                <div class="order-item">
                    <p>Item: ${itemName}</p>
                    <p>Harga: ${price}</p>
                    <div class="quantity-selector">
                        <label>Jumlah:</label>
                        <input type="number" value="1" min="1" style="width: 60px;">
                    </div>
                </div>
            </div>
            <button class="add-item-btn" disabled>+ Tambah Menu Lain</button>
            <div class="customer-info">
                <input type="text" id="customerName" placeholder="Nama Anda" required>
                <textarea id="customerAddress" placeholder="Alamat Pengiriman" required></textarea>
            </div>
            <div class="modal-buttons">
                <button class="whatsapp-order">Pesan via WhatsApp</button>
                <button class="cancel-order">Batal</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add new item functionality
    const addItemBtn = modal.querySelector('.add-item-btn');
    const orderItems = modal.querySelector('#orderItems');
    
    // Enable add item button when quantity is selected for current item
    const firstQuantityInput = modal.querySelector('input[type="number"]');
    firstQuantityInput.addEventListener('input', () => {
        if (parseInt(firstQuantityInput.value) > 0) {
            addItemBtn.disabled = false;
        } else {
            addItemBtn.disabled = true;
        }
    });
    
    addItemBtn.addEventListener('click', () => {
        const menuItems = document.querySelectorAll('.menu-item');
        const selectHTML = `
            <select class="menu-select">
                <option value="">Pilih Menu</option>
                ${Array.from(menuItems).map(item => {
                    const name = item.querySelector('h3').textContent;
                    const price = item.querySelector('.price').textContent;
                    return `<option value="${price}">${name}</option>`;
                }).join('')}
            </select>
        `;

        const newItem = document.createElement('div');
        newItem.className = 'order-item';
        newItem.innerHTML = `
            ${selectHTML}
            <div class="quantity-selector" style="display: none;">
                <label>Jumlah:</label>
                <input type="number" value="1" min="1" style="width: 60px;">
            </div>
            <button class="remove-item">Hapus</button>
        `;

        orderItems.appendChild(newItem);
        addItemBtn.disabled = true;

        const select = newItem.querySelector('.menu-select');
        const quantityDiv = newItem.querySelector('.quantity-selector');
        const quantityInput = quantityDiv.querySelector('input[type="number"]');

        select.addEventListener('change', function() {
            if (this.value) {
                quantityDiv.style.display = 'block';
            } else {
                quantityDiv.style.display = 'none';
                addItemBtn.disabled = true;
            }
        });

        quantityInput.addEventListener('input', () => {
            if (parseInt(quantityInput.value) > 0) {
                addItemBtn.disabled = false;
            } else {
                addItemBtn.disabled = true;
            }
        });

        newItem.querySelector('.remove-item').addEventListener('click', () => {
            newItem.remove();
            // Enable add item button after removing an item
            const lastItem = orderItems.querySelector('.order-item:last-child');
            if (lastItem) {
                const lastQuantityInput = lastItem.querySelector('input[type="number"]');
                if (lastQuantityInput && parseInt(lastQuantityInput.value) > 0) {
                    addItemBtn.disabled = false;
                }
            }
        });
    });

    const quantityInputs = modal.querySelectorAll('input[type="number"]');
    quantityInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 1) this.value = 1;
        });
    });
    
    modal.querySelector('.whatsapp-order').addEventListener('click', () => {
        const customerName = modal.querySelector('#customerName').value;
        const customerAddress = modal.querySelector('#customerAddress').value;
        
        if (!customerName || !customerAddress) {
            showNotification('Mohon isi nama dan alamat Anda', 'error');
            return;
        }

        let totalPrice = 0;
        let orderMessage = `Halo, saya ingin memesan:\n\n`;

        const orderItems = modal.querySelectorAll('.order-item');
        let hasValidOrder = false;

        // Create a map to store combined quantities for same items
        const itemMap = new Map();

        orderItems.forEach((item, index) => {
            const select = item.querySelector('.menu-select');
            const quantity = parseInt(item.querySelector('input[type="number"]').value);
            
            let itemName, price;
            if (index === 0) {
                itemName = item.querySelector('p').textContent.replace('Item: ', '');
                price = item.querySelector('p:nth-child(2)').textContent.replace('Harga: ', '');
            } else {
                if (select.value) {
                    itemName = select.options[select.selectedIndex].text;
                    price = select.value;
                } else {
                    return;
                }
            }

            if (quantity < 1) return;

            hasValidOrder = true;
            const priceNum = parseInt(price.replace(/\D/g, ''));

            // Combine quantities for same items
            if (itemMap.has(itemName)) {
                const existingItem = itemMap.get(itemName);
                existingItem.quantity += quantity;
                existingItem.total = existingItem.quantity * priceNum;
            } else {
                itemMap.set(itemName, {
                    quantity: quantity,
                    price: priceNum,
                    total: quantity * priceNum
                });
            }
        });

        if (!hasValidOrder) {
            showNotification('Mohon pilih minimal satu menu', 'error');
            return;
        }

        // Generate order message from combined items
        itemMap.forEach((value, key) => {
            orderMessage += `${key}\n`;
            orderMessage += `Jumlah: ${value.quantity}\n`;
            orderMessage += `Subtotal: Rp ${value.total.toLocaleString('id-ID')}\n\n`;
            totalPrice += value.total;
        });

        orderMessage += `Total Harga: Rp ${totalPrice.toLocaleString('id-ID')}\n\n`;
        orderMessage += `Nama: ${customerName}\n`;
        orderMessage += `Alamat: ${customerAddress}`;

        const phoneNumber = '6289514656979';
        const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(orderMessage)}`;
        
        window.open(whatsappURL, '_blank');
        modal.remove();
    });

    modal.querySelector('.cancel-order').addEventListener('click', () => {
        modal.remove();
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            if (validateForm(name, email, message)) {
                showNotification('Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.', 'success');
                this.reset();
            }
        });
    }
}

function validateForm(name, email, message) {
    if (!name || !email || !message) {
        showNotification('Mohon isi semua field yang diperlukan', 'error');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Mohon masukkan email yang valid', 'error');
        return false;
    }
    
    return true;
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Animations
function initializeAnimations() {
    const menuItems = document.querySelectorAll('.menu-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    menuItems.forEach(item => {
        observer.observe(item);
    });
}

// Responsive design
function initializeResponsive() {
    const adjustLayout = debounce(() => {
        document.body.classList.toggle('mobile-view', window.innerWidth <= 768);
    }, 250);

    window.addEventListener('resize', adjustLayout);
    adjustLayout();
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Add styles
const styles = document.createElement('style');
styles.textContent = `
    .order-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        max-width: 90%;
        width: 400px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        max-height: 90vh;
        overflow-y: auto;
    }

    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 8px;
        color: white;
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }

    .notification.success {
        background: #4CAF50;
    }

    .notification.error {
        background: #f44336;
    }

    .notification.fade-out {
        opacity: 0;
        transition: opacity 0.3s ease-out;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .menu-item {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.5s ease-out;
    }

    .menu-item.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .customer-info input,
    .customer-info textarea {
        width: 100%;
        padding: 0.8rem;
        margin-bottom: 1rem;
        border: 2px solid #ddd;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
    }

    .customer-info input:focus,
    .customer-info textarea:focus {
        border-color: #e65100;
        outline: none;
    }

    .customer-info textarea {
        height: 100px;
        resize: vertical;
    }

    .modal-buttons {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }

    .whatsapp-order,
    .cancel-order {
        padding: 0.8rem 1.5rem;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        flex: 1;
    }

    .whatsapp-order {
        background-color: #25D366;
        color: white;
    }

    .whatsapp-order:hover {
        background-color: #128C7E;
    }

    .cancel-order {
        background-color: #f5f5f5;
        color: #333;
    }

    .cancel-order:hover {
        background-color: #e0e0e0;
    }

    .add-item-btn {
        width: 100%;
        padding: 0.8rem;
        margin: 1rem 0;
        background-color: #e65100;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .add-item-btn:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    .add-item-btn:not(:disabled):hover {
        background-color: #ff6f00;
    }

    .order-item {
        margin-bottom: 1rem;
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
    }

    .menu-select {
        width: 100%;
        padding: 0.8rem;
        margin-bottom: 1rem;
        border: 2px solid #ddd;
        border-radius: 8px;
        font-size: 1rem;
    }

    .remove-item {
        padding: 0.5rem 1rem;
        background-color: #f44336;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 0.5rem;
    }

    .remove-item:hover {
        background-color: #d32f2f;
    }

    @media (max-width: 768px) {
        .modal-content {
            width: 95%;
            padding: 1.5rem;
        }

        .modal-buttons {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(styles);

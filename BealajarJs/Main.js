// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeNavigation();
    initializeOrderSystem();
    initializeContactForm();
    initializeAnimations();
    initializeResponsive(); // Add responsive initialization
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
        } else {
            navbar.style.backgroundColor = '#fff';
        }
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.toggle('active');
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
            // Close mobile menu after clicking
            document.querySelector('.nav-links').classList.remove('active');
        });
    });
}

// Order system functionality with responsive design
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
            <p>Item: ${itemName}</p>
            <p>Harga: ${price}</p>
            <div class="quantity-selector">
                <label>Jumlah:</label>
                <input type="number" min="1" value="1">
            </div>
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
    
    // Tambahkan event listener untuk tombol WhatsApp
    modal.querySelector('.whatsapp-order').addEventListener('click', () => {
        const quantity = modal.querySelector('input[type="number"]').value;
        const customerName = modal.querySelector('#customerName').value;
        const customerAddress = modal.querySelector('#customerAddress').value;
        
        if (!customerName || !customerAddress) {
            showErrorMessage('Mohon isi nama dan alamat Anda');
            return;
        }

        // Format pesan WhatsApp
        const message = `Halo, saya ingin memesan:%0A%0A` +
            `Item: ${itemName}%0A` +
            `Jumlah: ${quantity}%0A` +
            `Total Harga: ${price} x ${quantity}%0A%0A` +
            `Nama: ${customerName}%0A` +
            `Alamat: ${customerAddress}`;

        // Ganti nomor WhatsApp di bawah ini dengan nomor yang Anda inginkan
        const phoneNumber = '6289514656979'; // Format: kode negara tanpa tanda +
        const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
        
        // Buka WhatsApp di tab baru
        window.open(whatsappURL, '_blank');
        modal.remove();
    });

    modal.querySelector('.cancel-order').addEventListener('click', () => {
        modal.remove();
    });
}

// Contact form functionality with enhanced validation
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        if (validateForm(name, email, message)) {
            showSuccessMessage();
            this.reset();
        }
    });
}

function validateForm(name, email, message) {
    if (!name || !email || !message) {
        showErrorMessage('Mohon isi semua field yang diperlukan');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showErrorMessage('Mohon masukkan email yang valid');
        return false;
    }
    
    return true;
}

function showSuccessMessage() {
    showNotification('Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.', 'success');
}

function showErrorMessage(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Animations and visual effects with performance optimization
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

// Responsive design initialization
function initializeResponsive() {
    // Handle viewport changes
    window.addEventListener('resize', debounce(() => {
        adjustLayout();
    }, 250));

    adjustLayout();
}

// Helper function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function adjustLayout() {
    const isMobile = window.innerWidth <= 768;
    document.body.classList.toggle('mobile-view', isMobile);
}

// Add necessary styles with responsive design
const styles = document.createElement('style');
styles.textContent = `
    .order-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        max-width: 90%;
        width: 400px;
        margin: 0 1rem;
    }

    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem;
        border-radius: 4px;
        color: white;
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
    }

    .notification.success {
        background: #4CAF50;
    }

    .notification.error {
        background: #f44336;
    }

    .menu-toggle {
        display: none;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
    }

    @media (max-width: 768px) {
        .menu-toggle {
            display: block;
        }

        .nav-links {
            display: none;
            width: 100%;
            position: absolute;
            top: 100%;
            left: 0;
            background: white;
            padding: 1rem;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .nav-links.active {
            display: block;
        }

        .nav-links li {
            display: block;
            margin: 1rem 0;
        }

        .modal-content {
            width: 95%;
            margin: 0 auto;
        }
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
        transition: all 0.5s ease-in-out;
    }

    .menu-item.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .customer-info {
        margin: 1rem 0;
    }

    .customer-info input,
    .customer-info textarea {
        width: 100%;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    .customer-info textarea {
        height: 80px;
        resize: vertical;
    }

    .whatsapp-order {
        background-color: #25D366;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 0.5rem;
    }

    .whatsapp-order:hover {
        background-color: #128C7E;
    }
`;
document.head.appendChild(styles);

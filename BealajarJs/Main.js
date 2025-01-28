// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeNavigation();
    initializeOrderSystem();
    initializeContactForm();
    initializeAnimations();
});

// Navigation functionality
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Add scroll event listener for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        } else {
            navbar.style.backgroundColor = '#fff';
        }
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
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
            
            // Create order confirmation modal
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
            <button class="confirm-order">Konfirmasi Pesanan</button>
            <button class="cancel-order">Batal</button>
        </div>
    `;

    document.body.appendChild(modal);
    
    // Add event listeners for modal buttons
    modal.querySelector('.confirm-order').addEventListener('click', () => {
        const quantity = modal.querySelector('input').value;
        alert(`Terima kasih! Pesanan ${quantity}x ${itemName} akan segera diproses.`);
        modal.remove();
    });

    modal.querySelector('.cancel-order').addEventListener('click', () => {
        modal.remove();
    });
}

// Contact form functionality
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Validate form data
        if (validateForm(name, email, message)) {
            // Simulate form submission
            showSuccessMessage();
            this.reset();
        }
    });
}

function validateForm(name, email, message) {
    if (!name || !email || !message) {
        alert('Mohon isi semua field yang diperlukan');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Mohon masukkan email yang valid');
        return false;
    }
    
    return true;
}

function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = 'Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.';
    
    const contactForm = document.querySelector('.contact-form');
    contactForm.appendChild(successMessage);
    
    setTimeout(() => {
        successMessage.remove();
    }, 3000);
}

// Animations and visual effects
function initializeAnimations() {
    // Add animation to menu items on scroll
    const menuItems = document.querySelectorAll('.menu-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    menuItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.5s ease-in-out';
        observer.observe(item);
    });
}

// Add necessary styles
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
        max-width: 400px;
        width: 90%;
    }

    .success-message {
        background: #4CAF50;
        color: white;
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 4px;
        text-align: center;
    }
`;
document.head.appendChild(styles);

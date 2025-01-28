// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        navbar.style.backgroundColor = '#fff';
        navbar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    }
});

// Menu item hover animation
const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'scale(1.03)';
        item.style.transition = 'transform 0.3s ease';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'scale(1)';
    });
});

// Add to cart functionality
let cart = [];
menuItems.forEach(item => {
    const addButton = document.createElement('button');
    addButton.textContent = 'Pesan Sekarang';
    addButton.className = 'cta-button';
    addButton.style.margin = '1rem';
    
    addButton.addEventListener('click', () => {
        const name = item.querySelector('h3').textContent;
        const price = item.querySelector('.price').textContent;
        cart.push({ name, price });
        
        // Show notification
        const notification = document.createElement('div');
        notification.textContent = `${name} ditambahkan ke keranjang!`;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #2ecc71;
            color: white;
            padding: 1rem;
            border-radius: 5px;
            animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    });
    
    item.appendChild(addButton);
});

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(20px); }
    }
`;
document.head.appendChild(style);

// Contact form validation
const contactSection = document.querySelector('.contact-section');
const form = document.createElement('form');
form.className = 'contact-form';
form.innerHTML = `
    <input type="text" placeholder="Nama" required>
    <input type="email" placeholder="Email" required>
    <textarea placeholder="Pesan" required></textarea>
    <button type="submit" class="cta-button">Kirim Pesan</button>
`;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Terima kasih! Pesan Anda telah terkirim.');
    form.reset();
});

contactSection.querySelector('.contact-container').appendChild(form);

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});


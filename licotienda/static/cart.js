const CartConfig = {
    addToCart(name, price, image) {
        let cart = JSON.parse(localStorage.getItem('lalico_cart')) || [];
        cart.push({ name, price, image });
        localStorage.setItem('lalico_cart', JSON.stringify(cart));
        this.updateUI();
        
        // Basic visual feedback toast
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-3 rounded-2xl shadow-xl z-[100] transition-opacity duration-300 font-bold';
        toast.textContent = '¡Añadido al carrito!';
        document.body.appendChild(toast);
        setTimeout(() => toast.style.opacity = '0', 1500);
        setTimeout(() => toast.remove(), 2000);
    },
    
    removeFromCart(name) {
        let cart = this.getCart();
        const index = cart.findIndex(item => item.name === name);
        if (index > -1) {
            cart.splice(index, 1);
            localStorage.setItem('lalico_cart', JSON.stringify(cart));
            this.updateUI();
        }
    },

    getCart() {
        return JSON.parse(localStorage.getItem('lalico_cart')) || [];
    },

    updateUI() {
        let cart = this.getCart();
        
        // Update counters in Store top nav
        document.querySelectorAll('nav .absolute.top-1.right-1').forEach(el => {
            el.textContent = cart.length;
        });

        // Update counters in categories bottom nav
        document.querySelectorAll('nav .absolute.-top-1.-right-1.bg-red-500').forEach(el => {
            el.textContent = cart.length;
        });

        // Update floating cart button in Store
        const floatingCart = document.querySelector('.fixed.bottom-24.right-5 button');
        if (floatingCart) {
            const countSpan = floatingCart.querySelector('.flex.items-center.gap-3 .font-bold');
            const totalSpan = floatingCart.querySelector('span.font-extrabold.text-lg');
            if (countSpan) countSpan.textContent = `Ver mi carrito (${cart.length})`;
            
            let total = 0;
            let isCOP = false;
            cart.forEach(item => {
                let pText = item.price.replace('$', '').trim();
                if (pText.includes('.') && pText.split('.')[1].length === 3) {
                    isCOP = true;
                    total += parseFloat(pText.replace('.', ''));
                } else if (!pText.includes('.')) {
                    isCOP = true;
                    total += parseFloat(pText);
                } else {
                    total += parseFloat(pText);
                }
            });
            
            if (totalSpan) {
                if (isCOP || total > 1000) {
                    totalSpan.textContent = '$' + total.toLocaleString('es-CO');
                } else {
                    totalSpan.textContent = '$' + total.toFixed(2);
                }
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Hook up Store "Add" buttons
    document.querySelectorAll('.add-btn-pop').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const container = e.target.closest('.group');
            if (!container) return;
            const name = container.querySelector('h3').textContent.trim();
            const priceText = container.querySelector('.text-primary.font-extrabold').textContent.trim();
            const img = container.querySelector('img').src;
            CartConfig.addToCart(name, priceText, img);
        });
    });

    // 2. Hook up Categories "Add" buttons
    document.querySelectorAll('.bg-card-dark.rounded-2xl.p-3 .bg-primary').forEach(btn => {
        if(btn.querySelector('.material-icons-round') && btn.querySelector('.material-icons-round').textContent === 'add') {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const container = e.target.closest('.bg-card-dark');
                if (!container) return;
                const name = container.querySelector('.text-sm.font-bold:not(.text-primary)').textContent.trim();
                const priceText = container.querySelector('.text-primary.font-bold').textContent.trim();
                const img = container.querySelector('img').src;
                CartConfig.addToCart(name, priceText, img);
            });
        }
    });

    // 3. Make cart view buttons navigate to carrito.html
    const floatingCart = document.querySelector('.fixed.bottom-24.right-5 button');
    if (floatingCart) {
        floatingCart.addEventListener('click', () => {
            window.location.href = '/cart/';
        });
    }

    const navCarts = document.querySelectorAll('span.material-icons-round');
    navCarts.forEach(icon => {
        if(icon.textContent === 'shopping_cart') {
            const btn = icon.closest('button');
            if(btn && !btn.closest('.fixed.bottom-24')) { // prevent binding twice if floating cart is here
                btn.addEventListener('click', () => {
                   window.location.href = '/cart/';
                });
            }
        }
    });

    // 4. Hook up Store category filters
    const filterContainer = document.getElementById('category-filters');
    const storeGrid = document.getElementById('store-products-grid');
    if (filterContainer && storeGrid) {
        const btns = filterContainer.querySelectorAll('button');
        const cards = storeGrid.querySelectorAll('.group');

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-target');
                
                // Update active button styling
                btns.forEach(b => {
                   b.classList.remove('bg-primary', 'text-white', 'shadow-lg', 'shadow-primary/20');
                   b.classList.add('bg-white', 'dark:bg-neutral-800', 'text-slate-900', 'dark:text-white');
                });
                btn.classList.add('bg-primary', 'text-white', 'shadow-lg', 'shadow-primary/20');
                btn.classList.remove('bg-white', 'dark:bg-neutral-800', 'text-slate-900', 'dark:text-white');

                // Filter cards
                cards.forEach(card => {
                    if (target === 'Todos' || card.getAttribute('data-category') === target) {
                        card.style.display = 'flex';
                        setTimeout(() => card.style.opacity = '1', 50);
                    } else {
                        card.style.opacity = '0';
                        setTimeout(() => card.style.display = 'none', 300);
                    }
                });
            });
        });
    }

    // 5. Global bottom navigation router
    const bottomNav = document.querySelector('.fixed.bottom-0, .fixed.bottom-0.left-0.right-0');
    if (bottomNav) {
        bottomNav.querySelectorAll('button').forEach(btn => {
            const icon = btn.querySelector('.material-icons-round');
            if (icon) {
                const text = icon.textContent.trim();
                if (text === 'home' && !btn.hasAttribute('data-nav-bound')) {
                    btn.addEventListener('click', () => window.location.href = '/');
                    btn.setAttribute('data-nav-bound', 'true');
                } else if ((text === 'search' || text === 'explore') && !btn.hasAttribute('data-nav-bound')) {
                    btn.addEventListener('click', () => window.location.href = '/categories/');
                    btn.setAttribute('data-nav-bound', 'true');
                } else if (text === 'info' && !btn.hasAttribute('data-nav-bound')) {
                    btn.addEventListener('click', () => window.location.href = '/about/');
                    btn.setAttribute('data-nav-bound', 'true');
                }
            }
        });
    }

    // 6. Initialize UI on load
    CartConfig.updateUI();
});

window.CartConfig = CartConfig;

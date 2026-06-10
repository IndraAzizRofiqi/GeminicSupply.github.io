document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const sideMenu = document.getElementById('side-menu');

    if (menuBtn && sideMenu) {
        menuBtn.onclick = function() {
            // Jalankan animasi ikon hamburger jadi X
            menuBtn.classList.toggle('open');
            
            // Jalankan buka/tutup side menu
            if (sideMenu.style.width === "300px") {
                sideMenu.style.width = "0";
            } else {
                sideMenu.style.width = "300px";
            }
        };
    }
    
    // Jalankan hitungan keranjang setiap kali halaman selesai di-load
    updateCartCount();
});


let cart = JSON.parse(localStorage.getItem('geminic_cart')) || [];

// Fungsi untuk menambahkan produk ke dalam keranjang
function addToCart(id, name, price, image) {
    // Cek apakah barang tersebut sudah pernah dimasukkan ke keranjang
    const existingProduct = cart.find(item => item.id === id);

    if (existingProduct) {
        // Jika sudah ada, tambahkan jumlahnya (quantity)
        existingProduct.quantity += 1;
    } else {
        // Jika belum ada, masukkan data produk baru
        cart.push({
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }

    // Simpan perubahan ke memori browser
    saveCart();
    
    // Beri efek notifikasi sederhana
    alert(`${name} berhasil ditambahkan ke keranjang!`);
    updateCartCount();
}

// Fungsi menyimpan keranjang ke LocalStorage
function saveCart() {
    localStorage.setItem('geminic_cart', JSON.stringify(cart));
}

// Fungsi menghitung total jumlah item di navbar
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.innerText = totalItems;
    }
}


let currentModalProduct = null;
let currentQty = 1;

// Fungsi untuk membuka pop-up saat foto diklik
function openQtyModal(id, name, price, image) {
    currentModalProduct = { id, name, price, image };
    currentQty = 1; // reset ke angka 1 setiap buka pop-up
    
    // Update teks di dalam pop-up
    document.getElementById('modal-product-name').innerText = name;
    document.getElementById('modal-product-price').innerText = "IDR " + price.toLocaleString('id-ID');
    document.getElementById('qty-number').innerText = currentQty;
    
    // Munculkan pop-up dengan menambah class 'active'
    document.getElementById('qty-modal').classList.add('active');
}

// Pasang aksi tombol plus, minus, dan batal ketika dokumen selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    const minusBtn = document.getElementById('minus-btn');
    const plusBtn = document.getElementById('plus-btn');
    const cancelBtn = document.getElementById('cancel-modal-btn');
    const confirmBtn = document.getElementById('confirm-modal-btn');

    if(minusBtn && plusBtn && cancelBtn && confirmBtn) {
        // Tombol Minus diklik
        minusBtn.onclick = function() {
            if (currentQty > 1) {
                currentQty--;
                document.getElementById('qty-number').innerText = currentQty;
            }
        };

        // Tombol Plus diklik
        plusBtn.onclick = function() {
            currentQty++;
            document.getElementById('qty-number').innerText = currentQty;
        };

        // Tombol Batal diklik
        cancelBtn.onclick = function() {
            document.getElementById('qty-modal').classList.remove('active');
        };

        // Tombol Masukkan Keranjang diklik
        confirmBtn.onclick = function() {
            if (currentModalProduct) {
                // Cek apakah barang sudah ada di keranjang
                const existingProduct = cart.find(item => item.id === currentModalProduct.id);
                
                if (existingProduct) {
                    // Tambahkan quantity sesuai yang dipilih di pop-up
                    existingProduct.quantity += currentQty;
                } else {
                    // Masukkan sebagai data baru dengan quantity dari pop-up
                    cart.push({
                        full_id: currentModalProduct.id, // menjaga id tetap unik jika dibutuhkan
                        id: currentModalProduct.id,
                        name: currentModalProduct.name,
                        price: currentModalProduct.price,
                        image: currentModalProduct.image,
                        quantity: currentQty
                    });
                }
                
                saveCart();
                updateCartCount();
                alert(`${currentQty}x ${currentModalProduct.name} berhasil dimasukkan ke keranjang!`);
                
                // Tutup pop-up
                document.getElementById('qty-modal').classList.remove('active');
            }
        };
    }
});

// =================================================================
// FUNGSI BARU: FILTER PRODUK UNTUK HALAMAN SHOP.HTML
// =================================================================
function filterProducts(category) {
    // 1. Atur efek aktif/fokus pada tombol filter yang sedang diklik
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Ambil tombol yang memicu fungsi ini, lalu berikan class active
    if (event && event.target) {
        event.target.classList.add('active');
    }

    // 2. Lakukan penyaringan kartu produk di dalam grid
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const itemCategory = card.getAttribute('data-category');
        
        // Jika memilih 'all' atau kategori kartu cocok dengan tombol yang diklik
        if (category === 'all' || itemCategory === category) {
            card.style.display = 'block'; // Tampilkan produk
        } else {
            card.style.display = 'none';  // Sembunyikan produk
        }
    });
}
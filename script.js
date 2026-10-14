// === Variabel Global ===
const apiUrl = 'https://dummyjson.com/products';
let currentSkip = 0;
let currentLimit = 10;
let currentSearch = '';
let debounceTimer;

// === Mengambil Elemen DOM ===
const productContainer = document.getElementById('product-container');
const loadingIndicator = document.getElementById('loading-indicator');
const totalProductsEl = document.getElementById('total-products');
const averagePriceEl = document.getElementById('average-price');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const pageInfo = document.getElementById('page-info');
const limitSelect = document.getElementById('limitSelect');
const searchInput = document.getElementById('searchInput');
const noteForm = document.getElementById('noteForm');
const userNote = document.getElementById('userNote');
const noteError = document.getElementById('note-error');
const noteSuccess = document.getElementById('note-success');

// === Fungsi Utama: Ambil Data dari API ===
async function loadData() {
    try {
        // Tampilkan loading saat proses fetch dimulai (Challenge C=2)
        loadingIndicator.classList.remove('hidden');
        productContainer.innerHTML = ''; // Kosongkan data lama di layar

        // Tentukan URL berdasarkan apakah user sedang mencari atau tidak (Pagination Y=3)
        let fetchUrl = `${apiUrl}?limit=${currentLimit}&skip=${currentSkip}`;
        if (currentSearch !== '') {
            fetchUrl = `${apiUrl}/search?q=${currentSearch}&limit=${currentLimit}&skip=${currentSkip}`;
        }

        // Mulai ambil data
        const response = await fetch(fetchUrl);
        
        // Wajib ada: Cek apakah respon server OK atau Error (Syarat Soal Dosen)
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Jalankan fungsi untuk menampilkan data dan menghitung statistik
        renderData(data.products);
        updateAnalysis(data.products, data.total);
        updatePagination(data.total);

    } catch (error) {
        // Error handling jika internet putus atau server mati
        console.error("Gagal mengambil data:", error);
        productContainer.innerHTML = `<p class="error-msg">Gagal memuat data: ${error.message}</p>`;
    } finally {
        // Sembunyikan loading setelah data selesai ditarik (sukses/gagal)
        loadingIndicator.classList.add('hidden');
    }
}

// === Fungsi Tampilkan Data ke HTML ===
function renderData(products) {
    if (products.length === 0) {
        productContainer.innerHTML = '<p>Produk tidak ditemukan.</p>';
        return;
    }

    // Ubah data array menjadi elemen HTML
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-item';
        productCard.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>Harga: $${product.price}</p>
            <p>Kategori: ${product.category}</p>
        `;
        productContainer.appendChild(productCard);
    });
}

// === Fungsi Analisis Data Wajib ===
function updateAnalysis(products, total) {
    totalProductsEl.textContent = total;
    
    if (products.length > 0) {
        // Menghitung rata-rata harga pakai reduce()
        const totalPrice = products.reduce((sum, item) => sum + item.price, 0);
        const avgPrice = (totalPrice / products.length).toFixed(2);
        averagePriceEl.textContent = avgPrice;
    } else {
        averagePriceEl.textContent = '0';
    }
}

// === Fungsi Update Navigasi Pagination (Y=3) ===
function updatePagination(totalData) {
    const currentPage = (currentSkip / currentLimit) + 1;
    const totalPages = Math.ceil(totalData / currentLimit);
    
    pageInfo.textContent = `Halaman ${currentPage} dari ${totalPages || 1}`;
    
    // Matikan tombol jika berada di halaman awal atau akhir
    btnPrev.disabled = currentSkip === 0;
    btnNext.disabled = currentSkip + currentLimit >= totalData;
}

// === Kumpulan Event Listener ===

// 1. Klik Tombol Sebelumnya
btnPrev.addEventListener('click', () => {
    if (currentSkip >= currentLimit) {
        currentSkip -= currentLimit;
        loadData();
    }
});

// 2. Klik Tombol Selanjutnya
btnNext.addEventListener('click', () => {
    currentSkip += currentLimit;
    loadData();
});

// 3. Ubah Pilihan Jumlah Data
limitSelect.addEventListener('change', (e) => {
    currentLimit = parseInt(e.target.value);
    currentSkip = 0; // Kembali ke halaman 1
    loadData();
});

// 4. Pencarian menggunakan Debounce (Challenge C=2)
searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer); // Hapus timer lama saat user mengetik
    debounceTimer = setTimeout(() => { // Tunggu 500ms setelah selesai mengetik baru jalankan API
        currentSearch = e.target.value.trim();
        currentSkip = 0; // Kembali ke halaman 1 saat mencari
        loadData();
    }, 500); 
});

// 5. Validasi Form Minimal 30 Karakter (Z=7)
noteForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Cegah halaman reload saat disubmit
    
    const noteValue = userNote.value.trim();
    noteError.textContent = '';
    noteSuccess.textContent = '';
    
    if (noteValue.length < 30) {
        noteError.textContent = 'Error: Catatan minimal harus terdiri dari 30 karakter!';
    } else {
        noteSuccess.textContent = 'Berhasil! Catatan Anda telah disimpan.';
        userNote.value = ''; // Kosongkan isian
    }
});

// === Jalankan Aplikasi ===
// Tarik data saat web pertama kali dibuka
loadData();
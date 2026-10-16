# Dashboard Produk UMKM - PTS Pemrograman Web

**Nama:** Andi Muhammad Arsa  
**NIM:** 2440304037  
**Kelas:** Teknik Komputer  

---

## 1. Perhitungan Variasi Soal
Tiga digit terakhir NIM = **037**
- **X = 0** -> Dataset: **Products** (Dashboard Produk/UMKM)
- **Y = 3** -> Fitur Utama: **Pagination + pilihan jumlah data per halaman**
- **Z = 7** -> Form & Validasi: **Catatan minimal 30 karakter**
- **S = X + Y + Z** = 0 + 3 + 7 = 10
- **C = S mod 4** = 10 mod 4 = **2** -> Challenge: **Loading indicator + pencarian menggunakan debounce**

---

## 2. API Endpoint
- Base API: `https://dummyjson.com/products`
- Search API: `https://dummyjson.com/products/search?q={keyword}`

---

## 3. Jawaban 10 Pertanyaan Penjelasan Kode

1. **Alur sejak halaman dibuka sampai data REST API tampil:**
   Ketika halaman dibuka, event paling bawah memanggil fungsi `loadData()`. Fungsi ini menampilkan elemen loading, lalu memanggil `fetch()` ke URL DummyJSON. Setelah mendapat respon JSON, fungsi `renderData()` membentuk elemen HTML kartu produk, fungsi `updateAnalysis()` menghitung statistik harga, dan fungsi `updatePagination()` memperbarui tombol navigasi.

2. **Mengapa perlu memeriksa `response.ok` setelah `fetch()`?**
   Karena `fetch()` tidak akan menganggap status HTTP error (seperti 404 atau 500) sebagai *rejected/error*. Oleh karena itu, kita harus mengecek `response.ok`. Jika bernilai `false`, kita buat error buatan menggunakan `throw new Error()` agar ditangkap oleh blok `catch`.

3. **Proses mengubah data JSON menjadi elemen DOM:**
   Data JSON array `products` diloop menggunakan `forEach()`. Pada tiap iterasi, dibuat elemen `<div>` baru (`document.createElement('div')`), lalu properti seperti `product.thumbnail`, `product.title`, dan `product.price` dimasukkan ke dalam `innerHTML` elemen tersebut, kemudian dimasukkan ke kontainer utama via `appendChild()`.

4. **Penanganan jika internet terputus atau server error:**
   Aplikasi menggunakan struktur `try...catch...finally`. Jika terjadi gangguan jaringan, eksekusi kode akan melompat ke blok `catch`, mematikan loading indicator di blok `finally`, dan menampilkan pesan error merah di layar tanpa merusak seluruh tampilan web.

5. **Cara kerja fitur berdasarkan digit Y (Pagination & Limit):**
   Diatur oleh variabel `currentSkip` dan `currentLimit`. Ketika tombol Next/Prev diklik atau dropdown limit diubah, nilai `currentSkip` dan `currentLimit` diperbarui, lalu fungsi `loadData()` dipanggil ulang untuk mengambil potongan data dari API.

6. **Cara kerja validasi digit Z (Catatan min 30 karakter):**
   Ketika form disubmit, `e.preventDefault()` mencegah reload. Nilai textarea diambil dan dihitung panjang karakternya (`value.length`). Jika kurang dari 30 karakter, dibuat teks error pada elemen khusus di DOM. Input tidak valid tidak boleh diproses agar data yang masuk ke sistem tetap berkualitas dan sesuai aturan.

7. **Skenario penerapan localStorage (jika diterapkan):**
   LocalStorage dapat digunakan untuk menyimpan riwayat kata kunci pencarian terakhir pengguna atau preferensi jumlah data yang ditampilkan (`limit`), sehingga ketika halaman direload, pilihan limit pengguna tidak kembali ke default.

8. **Potongan kode penting (Input - Proses - Output):**
   ```javascript
   const totalPrice = products.reduce((sum, item) => sum + item.price, 0);
   const avgPrice = (totalPrice / products.length).toFixed(2);
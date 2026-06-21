# Manajemen Data Mahasiswa

Project web sederhana menggunakan **TypeScript + Express.js** untuk memenuhi tugas Manajemen Data Mahasiswa.

## Fitur

- Login username dan password.
- Validasi password salah dan bisa retry.
- CRUD data mahasiswa: tambah, tampil, edit, hapus.
- Penyimpanan dan pembacaan data dari file JSON (`data/students.json`).
- Import/export data JSON dan CSV.
- Validasi input menggunakan Regex.
- Error handling menggunakan `try-catch` dan `throw new Error()`.
- Kirim email OTP secara real time menggunakan SMTP + Nodemailer.
- GUI sederhana berbasis HTML/CSS/TypeScript.
- Searching: Linear Search, Sequential Search, Binary Search.
- Sorting: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Shell Sort.
- Konsep OOP: class, object, encapsulation, inheritance, polymorphism.
- Konsep pointer: simulasi pointer memakai reference object pada Linked List (`StudentNode.next`).

## Cara Menjalankan

1. Install Node.js.
2. Masuk ke folder project.
3. Install dependency:

```bash
npm install
```

4. Copy file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

5. Jalankan mode development:

```bash
npm run dev
```

6. Buka browser:

```text
http://localhost:3000
```

## Akun Login Default

```text
Username: admin
Password: Admin123!
```

Password default ini valid karena memenuhi regex: minimal 8 karakter, huruf besar, huruf kecil, angka, dan simbol.

## Cara Mengaktifkan Email OTP Real Time

Isi konfigurasi SMTP di file `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=email_kamu@gmail.com
SMTP_PASS=app_password_kamu
SMTP_FROM="Manajemen Mahasiswa <email_kamu@gmail.com>"
```

Catatan: Untuk Gmail, gunakan **App Password**, bukan password login Gmail biasa.

Jika SMTP belum diisi, OTP akan tampil di terminal sebagai mode demo.

## Struktur Folder

```text
manajemen-data-mahasiswa/
├── data/
│   ├── otps.json
│   └── students.json
├── public/
│   ├── index.html
│   └── style.css
├── src/
│   ├── algorithms/
│   │   ├── searching.ts
│   │   └── sorting.ts
│   ├── client/
│   │   └── app.ts
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.ts
├── sample-import.csv
├── sample-import.json
├── package.json
├── tsconfig.json
└── .env.example
```

## Konsep Pemrograman yang Dipakai

### Array

Data mahasiswa disimpan sementara sebagai array sebelum ditulis ulang ke file JSON.

### Pointer

TypeScript tidak punya pointer manual seperti C/C++. Project ini menerapkan konsep pointer melalui reference object pada Linked List:

```ts
class StudentNode {
  data: StudentRecord;
  next: StudentNode | null;
}
```

`next` berperan sebagai pointer ke node berikutnya.

### Function / Procedure

Contoh function:

- `linearSearchByName()`
- `binarySearchByNim()`
- `bubbleSort()`
- `mergeSort()`

### OOP

- `Person` sebagai abstract class.
- `Student` mewarisi `Person`.
- Encapsulation melalui `private` dan getter/setter.
- Polymorphism melalui method `getInfo()` yang di-override oleh `Student`.

## Algoritma dan Time Complexity

| Fitur | Algoritma | Time Complexity |
|---|---|---|
| Tampilkan semua data | Traversal array | O(n) |
| Tambah data | Cek duplikasi + push | O(n) |
| Edit data | findIndex | O(n) |
| Hapus data | filter | O(n) |
| Linear Search | Cari nama | O(n) |
| Sequential Search | Cari NIM | O(n) |
| Binary Search | Cari NIM pada data terurut | O(log n) |
| Bubble Sort | Sorting | O(n²) |
| Selection Sort | Sorting | O(n²) |
| Insertion Sort | Sorting | O(n²) |
| Merge Sort | Sorting | O(n log n) |
| Shell Sort | Sorting | O(n log n) sampai O(n²) |
| File I/O JSON | Baca/tulis seluruh file | O(n) |

## Build Production

```bash
npm run build
npm start
```

## Hosting Gratis

Project bisa dicoba di layanan hosting Node.js seperti Render. Saat deploy, gunakan:

```bash
Build command: npm install && npm run build
Start command: npm start
```

Untuk tugas kuliah, subdomain gratis bawaan hosting seperti `nama-project.onrender.com` biasanya sudah cukup. File I/O lokal cocok untuk demo, tetapi untuk produksi sebaiknya pakai database karena storage hosting gratis bisa bersifat sementara.

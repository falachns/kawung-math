# Kawung Math 🌸📐

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ffalachns%2Fkawung-math)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](https://opensource.org/licenses/MIT)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-emerald.svg)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Framework: Vanilla Web](https://img.shields.io/badge/Tech-HTML5%20%7C%20CSS3%20%7C%20JS-blue.svg)](https://developer.mozilla.org/)

**Kawung Math** adalah platform pembelajaran matematika interaktif berbasis **Ethno-STEAM** untuk siswa dan guru Sekolah Menengah Pertama (SMP / Fase D). Platform ini menjembatani konsep abstrak **transformasi geometri** (translasi, refleksi, rotasi, dan dilatasi) melalui keindahan dan keteraturan simetris motif **Batik Kawung** Nusantara.

---

## ✨ Fitur Utama

- 🔍 **Kawung Explore (Discovery Mode)**  
  Eksplorasi pra-formal untuk mengamati sumbu simetri (vertikal, horizontal, diagonal), titik pusat putaran $(0,0)$, dan keteraturan alami ornamen 4 kelopak Kawung.

- 🎛️ **Transform Sandbox**  
  Kanvas Kartesius interaktif dengan slider kendali waktu nyata (*real-time*) untuk memanipulasi:
  - **Translasi:** Pergeseran vektor $T(\Delta X, \Delta Y)$
  - **Rotasi:** Perputaran sudut $\theta$ ($0^\circ - 360^\circ$) berpusat di $(0,0)$
  - **Dilatasi:** Perubahan faktor skala $k$ ($0.3\times - 1.8\times$)
  - **Refleksi:** Pencerminan sumbu koordinat
  - **Rumus Dinamis:** Pembacaan matriks transformasi seketika

- 🎨 **Design Labs (Studio Batik Digital)**  
  Studio kreasi mandiri siswa untuk menyusun pengubinan (*tessellation*), memilih palet warna etnik (Sogan Solo, Pekalongan, Yogyakarta), dan mengekspor karya digital vektor SVG.

- 🏆 **Kawung Challenge**  
  Misi tergamifikasi bertingkat (*Teka-Teki Translasi*, *Cermin Refleksi Sumbu*, *Misi Sudut Rotasi*, dan *Tantangan Skala Dilatasi*) untuk mengasah logika spasial dan nalar kritis.

---

## 🏛️ Pendekatan Ethno-STEAM

| Pilar | Integrasi dalam Kawung Math |
|---|---|
| **Ethno (Budaya)** | Motif Batik Kawung sebagai obyek observasi simetri dan keteraturan seni Nusantara. |
| **Science & Math** | Transformasi geometri formal pada bidang Kartesius berstandar Kurikulum Merdeka SMP. |
| **Tech & Engineering** | Manipulasi grafis vektor SVG dinamis dan komputasi koordinat *real-time*. |
| **Arts (Seni Kreatif)** | Studio pembuatan motif ornamen simetris dan apresiasi estetika etnomatematika. |

---

## 🚀 Menjalankan Secara Lokal

Project ini dibangun murni menggunakan **Vanilla Web Technologies** (HTML5, CSS3, JavaScript ES6+) tanpa dependensi pihak ketiga atau build step kompleks.

### 1. Clone Repository
```bash
git clone https://github.com/falachns/kawung-math.git
cd kawung-math
```

### 2. Jalankan Local Server
Anda dapat menggunakan HTTP server bawaan Python, Node.js, atau Live Server di VS Code:

```bash
# Menggunakan Python 3
python3 -m http.server 8765

# Atau menggunakan npx serve
npx serve .
```

Buka browser di `http://localhost:8765`.

---

## 📁 Struktur Berkas

```
kawung-math/
├── .gitignore          # Konfigurasi ignore file lokal
├── favicon.svg         # Favicon vektor SVG motif Kawung
├── index.html          # Halaman web tunggal terpadu (HTML5 + CSS + JS)
├── LICENSE             # Lisensi Open Source MIT
├── README.md           # Dokumentasi resmi project
├── robots.txt          # Konfigurasi SEO crawler
├── sitemap.xml         # Peta situs untuk mesin pencari
└── vercel.json         # Pengaturan security headers & cache Vercel
```

---

## ♿ Aksesibilitas & Standar Desain

- **WCAG 2.1 AA Compliant:** Rasio kontras teks minimum $\ge 4.7:1$.
- **Navigasi Keyboard:** Dukungan penuh tombol `Tab`, `Enter`, `Space`, `Escape`, serta ring `:focus-visible`.
- **Motion Accessibility:** Dukungan `@media (prefers-reduced-motion: reduce)`.
- **Screen Reader Friendly:** Dilengkapi `aria-live`, `aria-valuenow`, `aria-label`, dan landmark HTML5 semantik.

---

## 📄 Lisensi

Project ini dirilis di bawah lisensi **[MIT License](LICENSE)**. Bebas digunakan untuk keperluan edukasi, pengajaran di kelas, riset akademis, maupun pengembangan lebih lanjut.

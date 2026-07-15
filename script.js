// =========================================================================
// 1. FUNGSI GLOBAL UNTUK POP-UP PREVIEW GAMBAR (LIGHTBOX)
// =========================================================================
function openPreview(imgUrl) {
    const modal = document.getElementById("previewModal");
    const modalImg = document.getElementById("modalImg");
    if (modal && modalImg) {
        modal.style.display = "block"; // Memunculkan modal pratinjau
        modalImg.src = imgUrl;         // Memasukkan URL gambar ke pop-up
    }
}

function closePreview() {
    const modal = document.getElementById("previewModal");
    if (modal) {
        modal.style.display = "none";  // Menyembunyikan modal pratinjau
    }
}

// Menutup jendela pratinjau otomatis jika pengguna mengklik area luar gambar (area gelap)
window.addEventListener("click", function(event) {
    const modal = document.getElementById("previewModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});


// =========================================================================
// 2. LOGIKA UTAMA SETELAH HALAMAN SELESAI DIMUAT (DOMContentLoaded)
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
    
    // --- A. FETCH DAN RENDER KATALOG ---
    fetch('katalog.json')
        .then(response => response.json())
        .then(data => {
            const catalogGrid = document.querySelector('.catalog-grid');
            let catalogHTML = '';
            
            data.forEach(item => {
                // Tampilkan label POPULAR jika statusnya true
                const popularBadge = item.populer ? `<span class="badge-popular">NEW</span>` : '';
                
                catalogHTML += `
                <div class="katalog-card">
                    <div class="katalog-img-wrapper" onclick="openPreview('${item.gambar}')" style="cursor: pointer;">
                        ${popularBadge}
                        <img src="${item.gambar}" alt="Tema ${item.nama}">
                    </div>
                    
                    <div class="katalog-info">
                        <h3 class="katalog-title">${item.nama}</h3>
                        
                        <div class="katalog-price-row">
                            <span class="badge-discount">${item.diskon}</span>
                            <span class="price-strike">${item.hargaAsli}</span>
                        </div>
                        <div class="price-final">${item.hargaDiskon}</div>
                        
                        <div class="katalog-actions">
                            <button class="btn-lihat" onclick="window.location.href='${item.linkPreview}'">Lihat Tema</button>
                            <button class="btn-pilih" onclick="window.location.href='${item.linkPesan}'">Pilih Tema</button>
                        </div>
                    </div>
                </div>`;
            });
            
            catalogGrid.innerHTML = catalogHTML;
        })
        .catch(error => console.error("Gagal memuat katalog:", error));

    // --- B. FETCH DAN RENDER PAKET HARGA ---
    fetch('paket_harga.json')
        .then(response => response.json())
        .then(data => {
            const pricingGrid = document.querySelector('.pricing-grid');
            let pricingHTML = '';

            data.forEach(item => {
                let fiturList = '';
                item.fitur.forEach(f => {
                    fiturList += `<li>${f}</li>`;
                });

                const popularClass = item.terlaris ? 'popular' : '';

                pricingHTML += `
                <div class="price-card ${popularClass}">
                    <h3>${item.paket}</h3>
                    <div class="price">${item.harga} <span>${item.durasi}</span></div>
                    <ul>
                        ${fiturList}
                    </ul>
                    <a href="#reservasi" class="cta-btn ${item.paket === 'Paket Basic' ? 'cta-btn-solid' : ''}" style="width: 100%; text-align: center; padding: 15px 0;">
                        ${item.linkTeks}
                    </a>
                </div>`;
            });

            pricingGrid.innerHTML = pricingHTML;
        })
        .catch(error => console.error("Gagal memuat paket harga:", error));

    // --- C. FETCH DAN RENDER FITUR UNGGULAN ---
    fetch('fitur.json')
        .then(response => response.json())
        .then(data => {
            const featureGrid = document.querySelector('.feature-grid');
            let featureHTML = '';

            data.forEach(item => {
                featureHTML += `
                <div class="feature-card">
                    <div class="icon">
                        <img src="${item.ikon}" alt="Ikon ${item.judul}" style="width: ${item.ukuranIkon}; height: ${item.ukuranIkon}; object-fit: contain;">
                    </div>
                    <div class="feature-text">
                        <h3>${item.judul}</h3>
                        <p>${item.deskripsi}</p>
                    </div>
                </div>`;
            });

            featureGrid.innerHTML = featureHTML;
        })
        .catch(error => console.error("Gagal memuat fitur:", error));


    // --- D. SCRIPT GOOGLE FORM SUBMISSION ---
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxpLM3m-JO5MjPzCu83gIJTZluHATFaIibBr8jWQUDrg83fLEXXOeK018s8BCgBrhMt/exec';
    const form = document.forms['submit-to-google-sheet'];
    const msg = document.getElementById('msg');

    if (form) {
        const btn = form.querySelector('button[type="submit"]');

        form.addEventListener('submit', e => {
            e.preventDefault();
            
            const btnOriginalText = btn.innerHTML;
            btn.innerHTML = "Mengirim...";
            
            fetch(scriptURL, { method: 'POST', body: new FormData(form)})
                .then(response => {
                    if (msg) msg.innerHTML = "Pesan terkirim! Tim kami akan segera merespons.";
                    form.reset();
                    btn.innerHTML = btnOriginalText;
                    
                    setTimeout(function(){
                        if (msg) msg.innerHTML = "*Layanan kami batasi hanya untuk 35 pasangan setiap kuartal demi menjaga standar dedikasi tertinggi pada setiap karya.";
                    }, 5000);
                })
                .catch(error => {
                    if (msg) msg.innerHTML = "Maaf, pesan gagal terkirim. Pastikan URL Apps Script sudah benar.";
                    btn.innerHTML = btnOriginalText;
                    console.error('Error!', error.message);
                });
        });
    }

    // --- E. FUNGSI TOGGLE MENU MOBILE ---
    const menuToggle = document.querySelector(".menu-toggle");
    const menuLinks = document.querySelector(".menu-links");

    if (menuToggle && menuLinks) {
        menuToggle.addEventListener("click", function () {
            menuLinks.classList.toggle("active");
        });

        const links = menuLinks.querySelectorAll("a");
        links.forEach(link => {
            link.addEventListener("click", function () {
                menuLinks.classList.remove("active");
            });
        });
    }
        
});
const cryptoContainer = document.getElementById('crypto-container');

async function fetchCrypto() {
    try {
        // API limitine takılmamak için her ihtimale karşı sorguyu optimize ettik
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6&page=1&sparkline=false', {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`API Hatası: ${response.status}`);
        }

        const data = await response.json();
        
        cryptoContainer.innerHTML = ''; 

        data.forEach(coin => {
            const isUp = coin.price_change_percentage_24h > 0;
            const card = `
                <div class="card">
                    <div class="coin-info">
                        <img src="${coin.image}" alt="${coin.name}" width="30">
                        <h3>${coin.name}</h3>
                    </div>
                    <div class="price">$${coin.current_price.toLocaleString()}</div>
                    <div class="change ${isUp ? 'up' : 'down'}">
                        ${isUp ? '▲' : '▼'} %${coin.price_change_percentage_24h.toFixed(2)}
                    </div>
                </div>
            `;
            cryptoContainer.innerHTML += card;
        });
        console.log("Güncellendi: " + new Date().toLocaleTimeString());
    } catch (error) {
        console.error("Hata detayı:", error);
        // Eğer hata verirse ekranda eski veri kalsın ama kullanıcıya ufak bir not gösterelim
        if (cryptoContainer.innerHTML.includes('Veriler yükleniyor')) {
            cryptoContainer.innerHTML = '<p style="color: #fb7185;">Şu an veri alınamıyor. API limiti dolmuş olabilir, lütfen birkaç dakika sonra tekrar deneyin.</p>';
        }
    }
}

// İlk açılışta çalıştır
fetchCrypto();

// API limitine takılmamak için süreyi 5 saniyeden 30 saniyeye çıkarıyoruz.
// Çünkü çok sık istek atarsan CoinGecko seni tamamen engelleyebilir.
setInterval(fetchCrypto, 30000);

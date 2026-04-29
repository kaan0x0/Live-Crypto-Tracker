const cryptoContainer = document.getElementById('crypto-container');

async function fetchCrypto() {
    try {
        // Veriyi çekiyoruz
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6&page=1&sparkline=false');
        const data = await response.json();
        
        cryptoContainer.innerHTML = ''; // Eski verileri temizle

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
        console.log("Veriler güncellendi: " + new Date().toLocaleTimeString());
    } catch (error) {
        console.error("Hata:", error);
    }
}

// Sayfa açılır açılmaz çalıştır
fetchCrypto();

// Her 5 saniyede bir arka planda veriyi yenile (Refresh istemiyorsan bunu kullan)
setInterval(fetchCrypto, 5000);

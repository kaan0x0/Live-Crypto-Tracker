const cryptoContainer = document.getElementById('crypto-container');
const dateElement = document.getElementById('date');

// Tarihi güncelle
dateElement.innerText = new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

async function fetchCrypto() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6&page=1&sparkline=false');
        const data = await response.json();
        
        cryptoContainer.innerHTML = '';

        data.forEach(coin => {
            const isUp = coin.price_change_percentage_24h > 0;
            const card = `
                <div class="card">
                    <div class="coin-info">
                        <img src="${coin.image}" alt="${coin.name}">
                        <h3>${coin.name} <span>(${coin.symbol.toUpperCase()})</span></h3>
                    </div>
                    <div class="price">$${coin.current_price.toLocaleString()}</div>
                    <div class="change ${isUp ? 'up' : 'down'}">
                        ${isUp ? '▲' : '▼'} ${coin.price_change_percentage_24h.toFixed(2)}%
                    </div>
                </div>
            `;
            cryptoContainer.innerHTML += card;
        });
    } catch (error) {
        cryptoContainer.innerHTML = '<p>Veri çekilemedi, API limiti dolmuş olabilir.</p>';
    }
}

fetchCrypto();
setInterval(fetchCrypto, 60000); // Dakikada bir güncelle
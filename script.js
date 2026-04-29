const cryptoContainer = document.getElementById('crypto-container');

async function fetchCrypto() {
    try {
        // Cache sorununu aşmak için URL sonuna her seferinde farklı bir sayı ekliyoruz (?t=...)
        const timestamp = new Date().getTime();
        const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,BNB,SOL,ARB,TIA&tsyms=USD&_=${timestamp}`;
        
        const response = await fetch(url);
        const result = await response.json();

        if (result.Response === "Error") {
            throw new Error(result.Message);
        }

        const data = result.RAW;
        cryptoContainer.innerHTML = ''; 

        for (const coin in data) {
            const coinData = data[coin].USD;
            const isUp = coinData.CHANGEPCT24HOUR > 0;
            
            const card = `
                <div class="card">
                    <div class="coin-info">
                        <img src="https://www.cryptocompare.com${coinData.IMAGEURL}" alt="${coin}" width="35">
                        <h3>${coin}</h3>
                    </div>
                    <div class="price">$${coinData.PRICE.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                    <div class="change ${isUp ? 'up' : 'down'}">
                        ${isUp ? '▲' : '▼'} %${coinData.CHANGEPCT24HOUR.toFixed(2)}
                    </div>
                </div>
            `;
            cryptoContainer.innerHTML += card;
        }
        console.log("Veriler başarıyla yenilendi: " + new Date().toLocaleTimeString());
    } catch (error) {
        console.error("Hata oluştu:", error);
        // Hata alsa bile kutuları tamamen silme, altına ufak bir not düş
        const errorNote = document.createElement('p');
        errorNote.style.color = '#fb7185';
        errorNote.innerText = "Yenileme hatası, sistem tekrar deniyor...";
        cryptoContainer.appendChild(errorNote);
    }
}

// Sayfa ilk açıldığında çalıştır
fetchCrypto();

// Her 15 saniyede bir güncelle (Çok daha güvenli bir süre)
setInterval(fetchCrypto, 15000);

const cryptoContainer = document.getElementById('crypto-container');

// Bu API daha hızlı ve limitleri daha geniş
async function fetchCrypto() {
    try {
        const response = await fetch('https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,BNB,SOL,ARB,TIA&tsyms=USD');
        const result = await response.json();
        const data = result.RAW;

        cryptoContainer.innerHTML = ''; 

        // Gelen veriyi döngüye sokuyoruz
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
        console.log("Veri çekildi: " + new Date().toLocaleTimeString());
    } catch (error) {
        console.error("Hata:", error);
        cryptoContainer.innerHTML = '<p>Bağlantı hatası, lütfen sayfayı yenileyin.</p>';
    }
}

// İlk yükleme
fetchCrypto();

// 10 saniyede bir güncelle (Bu API için 10 saniye çok güvenli)
setInterval(fetchCrypto, 10000);

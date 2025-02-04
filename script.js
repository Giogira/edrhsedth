let web3Modal;
let provider;
let walletAddress = null;

// Инициализация Web3Modal
async function initWeb3Modal() {
    web3Modal = new Web3Modal.default({
        cacheProvider: false,
        providerOptions: {
            walletconnect: {
                package: WalletConnectProvider.default,
                options: {
                    rpc: {
                        1: "https://mainnet.infura.io/v3/c6fd897b872540a8bfd41c24ab66e041", // Заменить на свой Infura ID
                    },
                },
            },
        },
    });
}

// Подключение кошелька
async function connectWallet() {
    try {
        provider = await web3Modal.connect();
        const web3Provider = new ethers.providers.Web3Provider(provider);
        const accounts = await web3Provider.listAccounts();

        if (accounts.length > 0) {
            walletAddress = accounts[0];
            updateWalletUI(walletAddress);
            updateBalance(web3Provider);
        }

        // Слушаем отключение
        provider.on("disconnect", () => {
            resetWalletUI();
        });
    } catch (error) {
        console.error("Ошибка подключения:", error);
    }
}

// Получение баланса кошелька
async function updateBalance(web3Provider) {
    if (!walletAddress) return;
    
    const balance = await web3Provider.getBalance(walletAddress);
    const ethBalance = ethers.utils.formatEther(balance);
    
    document.getElementById("wallet-info").innerText = `Баланс: ${parseFloat(ethBalance).toFixed(4)} ETH`;
}

// Обновление UI после подключения
function updateWalletUI(wallet) {
    document.getElementById("web3-connect").style.display = "none"; // Скрываем кнопку
    document.getElementById("wallet-info").innerText = `Кошелек: ${wallet.substring(0, 6)}...${wallet.slice(-4)}`;
}

// Сброс UI при отключении кошелька
function resetWalletUI() {
    document.getElementById("web3-connect").style.display = "block"; // Показываем кнопку
    document.getElementById("wallet-info").innerText = "Кошелек: не подключен";
}

// Открытие/закрытие виджета
function toggleSidebar(event) {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar.classList.contains("open")) {
        sidebar.classList.add("open");
        event.stopPropagation();
    }
}

// Закрытие виджета при клике вне него
document.addEventListener("click", (event) => {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar.contains(event.target)) {
        sidebar.classList.remove("open");
    }
});

window.addEventListener("load", async () => {
    await initWeb3Modal();
    displayNFTs(); // Добавлен вызов для загрузки NFT
});

// Отображение NFT
function displayNFTs() {
    const nftContainer = document.getElementById('nft-container');
    nftContainer.innerHTML = '';

    const nftData = [
        { image: 'https://i.seadn.io/s/raw/files/453c20524ce00125153fa398ccc28897.gif?auto=format&dpr=1&w=384', name: '$@!%@#', price: '0.05 ETH' },
        { image: 'https://i.seadn.io/s/raw/files/8b58e5a4d502bafbef302552387a3697.gif?auto=format&dpr=1&w=384', name: '!^#$!^', price: '0.1 ETH' },
        { image: 'https://i.seadn.io/s/raw/files/32fa10108106596ec2df657c9f419326.gif?auto=format&dpr=1&w=384', name: '%@@🎆🎍', price: '0.2 ETH' },
        { image: 'https://i.seadn.io/s/raw/files/c6ef03af52576825d53bba16307bea53.gif?auto=format&dpr=1&w=384', name: '^@#$@@', price: '0.15 ETH' },
        { image: 'https://i.seadn.io/s/raw/files/2a3d87119c56f9a67ce2bd39fd953a47.gif?auto=format&dpr=1&w=384', name: 'T#@234', price: '0.07 ETH' },
        { image: 'https://i.seadn.io/s/raw/files/d2249dcb017dc6fd8904ec9e40b75d97.gif?auto=format&dpr=1&w=384', name: 'verfe@#', price: '0.12 ETH' }
    ];

    nftData.forEach(nft => {
        const nftElement = document.createElement('div');
        nftElement.classList.add('nft-item');
        nftElement.innerHTML = `
            <img src="${nft.image}" alt="NFT">
            <div class="nft-info">
                <p><strong>${nft.name}</strong></p>
                <p>${nft.price}</p>
            </div>
        `;
        nftContainer.appendChild(nftElement);
    });
}

// Загрузка Web3Modal при старте
window.addEventListener("load", async () => {
    await initWeb3Modal();
});

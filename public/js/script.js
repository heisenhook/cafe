const socket = io('ws://localhost:8080');

var cartItems = [];
var catalogItems = [];
var catalogElements = [];

function insertCatalogItem(parameters) {
    const htmlCode = `
        <link rel="stylesheet" href="${parameters.stylesheetUrl}">

        <div class="catalogItem">
            <img src="${parameters.imageSrc}">
            
            <div class="itemInfo">
                <h3>
                    ${parameters.price}
                </h3>
                <span>
                    ${parameters.itemName}
                </span>
            </div>
        </div>
    `;

    const targetElement = document.getElementById(parameters.targetElementId);
    
    if (targetElement) {
        targetElement.innerHTML += htmlCode;
    } else {
        console.error('Target element not found');
    }
}

function insertCatalogItems() {
    for (let i = 0; i < catalogItems.length; i++) {
        insertCatalogItem({
            stylesheetUrl: 'styles/catalogItem.css',
            imageSrc: catalogItems[i].image ? catalogItems[i].image.imageData.url : '/img/null.png',
            price: (catalogItems[i].item.itemData.variations[0].itemVariationData.priceMoney && catalogItems[i].item.itemData.variations[0].itemVariationData.priceMoney.amount !== null) ? `$${(parseInt(catalogItems[i].item.itemData.variations[0].itemVariationData.priceMoney.amount.toString()) / 100).toFixed(2)}` : 'null',
            itemName: catalogItems[i].item.itemData.name,
            targetElementId: 'catalog',
        });
    }
}

function addToCart(id) {
    cartItems.push(catalogItems[id]);
}

function init() {
    fetch('http://localhost:3000/api/catalog')
        .then(response => response.json())
        .then(data => {
            catalogItems = data;
            insertCatalogItems();

            catalogElements = document.getElementsByClassName('catalogItem');
            for (let i = 0; i < catalogElements.length; i++) {
                catalogElements[i].addEventListener('click', () => addToCart(i));
            }
        })
        .catch(error => {
            console.error('failed to fetch catalog items: ', error);
        });
}


socket.on('connect', () => {
    console.log('connected to websocket server');
});

window.addEventListener('load', (e) => {
    init();
});

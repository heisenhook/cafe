const socket = io('ws://localhost:8080');

var cartItems = [];
var catalogItems = [];

fetch('http://localhost:3000/api/catalog')
    .then(response => response.json())
    .then(data => {
        catalogItems = data;
        console.log(catalogItems);
        // Call the sex function here after fetching and setting catalogItems
        insertCatalogItems();
    })
    .catch(error => {
        console.error('failed to fetch catalog items: ', error);
    });

function insertCatalogItem(parameters) {
    // Use template literals to insert parameters into the HTML code
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

    // Get a reference to the element where you want to insert the HTML
    const targetElement = document.getElementById(parameters.targetElementId);

    // Insert the HTML code into the target element
    if (targetElement) {
        targetElement.innerHTML += htmlCode;
    } else {
        console.error('Target element not found');
    }
}

function init() {
    catalogItems = document.getElementsByClassName('catalogItem');

    for (let i = 0; i < catalogItems.length; i++) {
        catalogItems[i].addEventListener('click', (e) => {
            console.log('clicked;');
        })
    }
}

function insertCatalogItems() {
    for (let i = 0; i <= catalogItems.length; i++) {
        insertCatalogItem({
            stylesheetUrl: 'styles/catalogItem.css',
            imageSrc: catalogItems[i].image ? catalogItems[i].image.imageData.url : '/img/null.png',
            price: (catalogItems[i].item.itemData.variations[0].itemVariationData.priceMoney && catalogItems[i].item.itemData.variations[0].itemVariationData.priceMoney.amount !== null) ? `$${(parseInt(catalogItems[i].item.itemData.variations[0].itemVariationData.priceMoney.amount.toString()) / 100).toFixed(2)}` : 'null',
            itemName: catalogItems[i].item.itemData.name,
            targetElementId: 'catalog', // replace with the actual target element ID
        });
    }
}

socket.on('connect', () => {
    console.log('connected to websocket server');
});

window.addEventListener('load', (e) => { init(); });
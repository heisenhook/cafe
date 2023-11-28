const socket = io('ws://localhost:8080');
var square = [];
var catalog = [];
var cart = {
    total : 0.00,
    items : [

    ],

    add : function(id) {
        for (let i = 0; i < square.length; i++) {
            if (square[i].type === "ITEM" && square[i].id == catalog[id]) {
                this.items.push({
                    id : square[i].id,
                    price : square[i].itemData.variations[0].itemVariationData.priceMoney.amount,
                    modifiers : square[i].itemData.modifierListInfo
                });
            }
        }

        buildCart(id);
    },

};

function getImageUrl(item) {
    let img = '/img/null.png';

    if (item.itemData.imageIds) {
        for (let i = 0; i < square.length; i++) {
            if (square[i].type === "IMAGE" && square[i].id === item.itemData.imageIds[0]) {
                img = square[i].imageData.url;
                break; // exit the loop once the image is found
            }
        }
    }

    return img;
}

function calculateCartTotal() {
    let total = 0.00;

    for (let i = 0; i < cart.items.length; i++) {
        total += parseInt(cart.items[i].price);
    }

    return total;
}

function buildCatalogItem(item) {
    let img = getImageUrl(item);

    let price = (item.itemData.variations[0].itemVariationData.priceMoney && item.itemData.variations[0].itemVariationData.priceMoney.amount !== null) ?
        `$${(parseInt(item.itemData.variations[0].itemVariationData.priceMoney.amount.toString()) / 100).toFixed(2)}` :
        'null';

    let name = item.itemData.name;

    return `
        <link rel="stylesheet" href="styles/catalogItem.css">
    
        <div class="catalogItem">
            <img src="${img}">
                
            <div class="itemInfo">
                <h3>${price}</h3>
                <span>${name}</span>
            </div>
        </div>
    `;
}

function buildCatalog() {
    for (let i = 0; i < square.length; i++) {
        if (square[i].type === "ITEM") {
            catalog.push(square[i].id);
            document.getElementById('catalog').innerHTML += buildCatalogItem(square[i]);
        }
    }

    for (let i = 0; i < document.getElementsByClassName('catalogItem').length; i++) {
        document.getElementsByClassName('catalogItem')[i].addEventListener('click', () => cart.add(i));
    }
}

function buildCartItem(item) {
    let img = getImageUrl(item);

    let name = item.itemData.name;

    return `
        <link rel="stylesheet" href="/styles/cartItem.css">
        <div class="cartItem">
            <div class="cartItemInfo">
                <img src="${img}">
                <span>${name}</span>
            </div>
        </div>
    `;
}

function modifyCartItem(id) {
    console.log(id);
}

function buildCart(id = -1) {
    if (id < 0) {
        document.getElementById('cart').innerHTML = '';

        for (let i = 0; i < cart.items.length; i++) {
            for (let j = 0; j < square.length; j++) {
                if (square[j].type === "ITEM" && square[j].id === cart.items[i].id) {
                    document.getElementById('cart').innerHTML += buildCartItem(square[j]);
                }
            }
        }
    
        for (let i = 0; i < document.getElementsByClassName('cartItem').length; i++) {
            document.getElementsByClassName('cartItem')[i].addEventListener('click', () => modifyCartItem(i));
        }
    
        cart.total = calculateCartTotal();
    }

    
}

function init() {
    fetch(`${window.location.origin}/api/catalog`)
        .then(response => response.json())
        .then(data => {
            square = data;
            buildCatalog();
        })
        .catch(error => {
            console.error('failed to fetch catalog items: ', error);
        });
}

socket.on('connect', () => {
    console.log('connected 2 websocket server');
});

window.addEventListener('load', (e) => {
    init();
});
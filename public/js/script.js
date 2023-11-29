// let hostname = 'localhost';
// if (window.location.hostname == 'learncpp.today') {
//     hostname == '66.94.112.161';
// } // can't think of any better solution, this might not even work!
// const socket = io.connect(`ws://${hostname}:8080`);
var square = [];
var catalog = [];
var cart = {
    total : 0.00,
    items : [

    ],

    add : function(id) {
        for (let i = 0; i < square.length; i++) { // loop until id is matched with catalogItem id
            if (square[i].type === "ITEM" && square[i].id == catalog[id]) {
                this.items.push({ // push square id, price & modifier data to obj
                    id : square[i].id,
                    price : square[i].itemData.variations[0].itemVariationData.priceMoney.amount,
                    modifiers : square[i].itemData.modifierListInfo
                });

                buildCart(square[i].id); // pass the square id of added item to buildCart(), prompting modifications to item
            }
        }
    },

};

function getItemIndice(id) {
    for (let i = 0; i < square.length; i++) { //
        if (square[i].type === "ITEM" && square[i].id == id) {
            return i;
        }
    }
}

function getImageUrl(item) {
    let img = '/img/null.png';

    // Check if item.itemData is defined before accessing its properties
    if (item.itemData && item.itemData.imageIds) {
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

function buildCart(id = null) {
    document.getElementById('cart').innerHTML = '';

    if (id === null) { // if no square id was passed, then render all items in list format
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
        return;
    }

    // if a square id was passed, render individual item w/ modification options
    let item = getItemIndice(id);

    if (item !== null && square[item].itemData.variations && square[item].itemData.variations.length > 0) {
        let name = square[item].itemData.name;
        
        // Check if variations[0] is defined before accessing its properties
        if (square[item].itemData.variations[0]) {
            let price = square[item].itemData.variations[0].itemVariationData.priceMoney.amount;
            let img = getImageUrl(item);
    
            let html = `
                <div class="modifyInfo">
                    <img class="modifyImage" src="${img}">
                    <div class="modifyText">
                        <h3 class="name">${name}</h3>
                        <h3 class="price">${price}</h3>
                    </div>
                </div>
                <div class="modifiers">
                    <div class="slider">
                        <h3>modifier name</h3>
                        <div class="bar">
                            <h4>0</h4>
                            <input type="range" min="0" max="5" value="0" class="value">
                            <h4>5</h4>
                        </div>
                    </div>
                </div>
                <div class="checkoutContainer">
                    <button>Save Item</button>
                </div>
            `;

            document.getElementById('cart').innerHTML = html;
        } else {
            console.error(`Variation for item with id ${id} is undefined or empty.`);
        }
    } else {
        console.error(`Unable to build cart item for id: ${id}`);
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

// socket.on('connect', () => {
//     console.log('connected 2 websocket server');
// });

window.addEventListener('load', (e) => {
    init();
});
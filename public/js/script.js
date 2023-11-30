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

    add : function(id) { // id: catalog index of square ID
        let item = square[getItemIndice(catalog[id])];

        let arr = getItemModifiers(item);
        let modifiers = [];

        if (arr && Array.isArray(arr) && arr.length > 0) {
            for (let i = 0; i < arr.length; i++) {
                modifiers.push({
                    id: arr[i],
                    value: 0,
                });
            }
        }

        this.items.push({ // push square id, price & modifier data to obj
            id : item.id,
            price : item.itemData.variations[0].itemVariationData.priceMoney.amount,
            modifiers,
        });

        this.total = calculateCartTotal();
        buildCart(this.items.length - 1); // pass the cart item indice to buildCart to render item modifications
    },

    save : function(id) { // id : cart item index
        let arr = document.getElementsByClassName('value');

        for (let i = 0; i < arr.length; i++) {
            cart.items[id].modifiers[i].value = arr[i].value;
        }

        buildCart();
    },

};

function formatPrice(x) {
    return x !== null ? `$${(parseInt(x) / 100).toFixed(2)}` : 'null';
}

function getItemIndice(id) { // id: square ID of item
    for (let i = 0; i < square.length; i++) {
        if (square[i].id == id) {
            return i;
        }
    }
}

function getItemModifiers(item) { // item: catalogItemObj
    if (item.itemData.modifierListInfo) {
        let arr = [];
        for (let i = 0; i < item.itemData.modifierListInfo.length; i++) {
            if (item.itemData.modifierListInfo[i].enabled) {
                arr.push(item.itemData.modifierListInfo[i].modifierListId);
            }
        }

        return arr;
    }
}

function getImageUrl(item) { // item: catalogItemObj
    let img = '/img/null.png';

    // check if item.itemData is defined before accessing its properties
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

function buildCatalogItem(item) { // item: catalogItemObj
    let img = getImageUrl(item);
    let price = formatPrice(item.itemData.variations[0].itemVariationData.priceMoney.amount);
    let name = item.itemData.name;

    return `
        <link rel="stylesheet" href="styles/catalogItem.css">
    
        <div class="catalogItem">
            <img class="catalogImage" src="${img}">
                
            <div class="itemInfo">
                <h3 class="itemPrice" >${price}</h3>
                <span class="itemName" >${name}</span>
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
                <img class="cartItemImage" src="${img}">
                <span class="cartItemName" >${name}</span>
            </div>
        </div>
    `;
}

function modifyCartItem(id) {
    console.log(id);
}

function buildCart(id = null) { // id: the indice of the item in cart
    document.getElementById('cart').innerHTML = '';

    if (id === null) { // if no cart indice was passed, then render all items in list format
        for (let i = 0; i < cart.items.length; i++) {
            for (let j = 0; j < square.length; j++) {
                if (square[j].type === "ITEM" && square[j].id === cart.items[i].id) {
                    document.getElementById('cart').innerHTML += buildCartItem(square[j]);
                }
            }
        }
        
        document.getElementById('cart').innerHTML += `
        <div class="checkoutContainer">
            <button id="checkoutBtn" class="checkoutButton">${formatPrice(cart.total)}</button>
        </div>
        `;
    
        for (let i = 0; i < document.getElementsByClassName('cartItem').length; i++) {
            document.getElementsByClassName('cartItem')[i].addEventListener('click', () => buildCart(i));
        }
    
        
        return;
    }

    // if an id was passed, render individual item w/ modification options
    let item = getItemIndice(cart.items[id].id);

    if (item !== null && square[item].itemData.variations && square[item].itemData.variations.length > 0) {
        let name = square[item].itemData.name;
        
        // check if variations[0] is defined before accessing its properties
        if (square[item].itemData.variations[0]) {
            let price = formatPrice(square[item].itemData.variations[0].itemVariationData.priceMoney.amount);
            let img = getImageUrl(square[item]);
            
            let mods = ``;
            let arr = getItemModifiers(square[item]);

            if (arr && Array.isArray(arr) && arr.length > 0) {
                for (let i = 0; i < arr.length; i++) {
                    mods += `
                    <div class="slider">
                        <h3 class="modifierName" >${square[getItemIndice(arr[i])].modifierListData.name}</h3>
                        <div class="bar">
                            <h4 class="range">0</h4>
                            <input type="range" min="0" max="${square[getItemIndice(arr[i])].modifierListData.modifiers.length}" value="${cart.items[id].modifiers[i].value}" class="value">
                            <h4 class="range">${square[getItemIndice(arr[i])].modifierListData.modifiers.length}</h4>
                        </div>
                    </div>
                    `;
                }
            }

            let html = `
                <div class="modifyInfo">
                    <img class="modifyImage" src="${img}">
                    <div class="modifyText">
                        <h3 class="name">${name}</h3>
                        <h3 class="price">${price}</h3>
                    </div>
                </div>
                <div class="modifiers">
                ${mods}
                </div>
                <div class="checkoutContainer">
                    <button id="saveBtn" class="checkoutButton">Save Item</button>
                </div>
            `;

            document.getElementById('cart').innerHTML = html;
            document.getElementById('saveBtn').addEventListener('click', () => { cart.save(id) });
        }
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
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

        if (modifiers.length < 1) {
            buildCart(); // why render modifications if there are none
            return;
        }

        buildCart(this.items.length - 1); // pass the cart item indice to buildCart to render item modifications
    },

    save : function(id) { // id : cart item index
        let arr = document.getElementsByClassName('value');

        for (let i = 0; i < arr.length; i++) {
            cart.items[id].modifiers[i].value = arr[i].value;
        }

        this.total = calculateCartTotal();
        buildCart();
    },

    delete : function(id) { // id: cart item index
        this.items.splice(id, 1);
        this.total = calculateCartTotal();
        buildCart();
    }

};

window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
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
    
        <div class="${window.mobileCheck() ? `catalogItem mCatalogItem` : `catalogItem`}">
            <img class="${window.mobileCheck() ? `catalogImage mCatalogImage` : `catalogImage`}" src="${img}">
                
            <div class="itemInfo">
                <h3 class="${window.mobileCheck() ? `itemPrice mItemPrice` : `itemPrice`}">${price}</h3>
                <span class="${window.mobileCheck() ? `itemName mItemName` : `itemName`}">${name}</span>
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
                <span class="cartItemName">${name}</span>
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

        checkoutBtn = document.getElementById('checkoutBtn');
        
        checkoutBtn.addEventListener('mouseover', () => {
            checkoutBtn.innerHTML = `Checkout`;
        });

        checkoutBtn.addEventListener('mouseout', () => {
            checkoutBtn.innerHTML = formatPrice(cart.total);
        });
        
        for (let i = 0; i < document.getElementsByClassName('cartItem').length; i++) {
            document.getElementsByClassName('cartItem')[i].addEventListener('click', () => buildCart(i));
        }
    
        
        return;
    }

    // if an id was passed, render individual item w/ modification options
    let content = document.getElementById('content');
    let item = getItemIndice(cart.items[id].id);
    content.classList.add('containerDisable');

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
                    // please ignore this
                    mods += `
                    <div class="slider">
                        <h3 class="${window.mobileCheck() ? `modifierName mModifierName` : `modifierName`}" >${square[getItemIndice(arr[i])].modifierListData.name}</h3>
                        <div class="${window.mobileCheck() ? `bar mBar` : `bar`}">
                            <h4 class="${window.mobileCheck() ? 'range mRange' : `range`}">0</h4>
                            <input type="range" min="0" max="${square[getItemIndice(arr[i])].modifierListData.modifiers.length}" value="${cart.items[id].modifiers[i].value}" class="${window.mobileCheck() ? 'value mValue' : `value`}">
                            <h4 class="${window.mobileCheck() ? 'range mRange' : `range`}">${square[getItemIndice(arr[i])].modifierListData.modifiers.length}</h4>
                        </div>
                    </div>
                    `;
                }
            }

            // and this
            let html = `
                <div class="${window.mobileCheck() ? `modifyInfo mModifyInfo` : `modifyInfo`}">
                    <img class="${window.mobileCheck() ? `modifyImage mModifyImage` : `modifyImage`}" src="${img}">
                    <div class="${window.mobileCheck() ? `modifyText mModifyText` : `modifyText`}">
                        <h3 class="${window.mobileCheck() ? `name mName` : `name`}">${name}</h3>
                        <h3 class="${window.mobileCheck() ? `price mPrice` : `price`}">${price}</h3>
                    </div>
                </div>
                <div class="modifiers">
                ${mods}
                </div>
                <div class="${window.mobileCheck() ? `checkoutContainer mCheckoutContainer` : `checkoutContainer`}">
                    <button id="saveBtn" class="${window.mobileCheck() ? `checkoutButton mCheckoutButton` : `checkoutButton`}">Save Item</button>
                    <button id="deleteBtn" class="${window.mobileCheck() ? `checkoutButton mCheckoutButton` : `checkoutButton`}">Delete</button>
                </div>
            `;

            document.getElementById('cart').innerHTML = html;
            document.getElementById('saveBtn').addEventListener('click', () => { content.classList.remove('containerDisable');; cart.save(id) });
            document.getElementById('deleteBtn').addEventListener('click', () => { content.classList.remove('containerDisable');; cart.delete(id) });
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

        if (window.mobileCheck()) {
            document.getElementById('cartToggle').addEventListener('click', () => {
                // Toggle the display between 'cart' and 'catalog'
                const content = document.getElementById('content');
                const cart = document.getElementById('cart');
    
                if (content.style.display !== 'none') {
                    // If catalog is currently visible, hide it and show the cart
                    content.style.display = 'none';
                    cart.style.display = 'flex';
                } else {
                    // If cart is currently visible, hide it and show the catalog
                    cart.style.display = 'none';
                    content.style.display = 'flex';
                }
            });
        }
}

// socket.on('connect', () => {
//     console.log('connected 2 websocket server');
// });

window.addEventListener('load', (e) => {
    init();
});

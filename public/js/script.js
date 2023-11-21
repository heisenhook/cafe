const socket = io('ws://localhost:8080');

var catalog = {
    items : [],
    elements : [],

    insertItems : function() {
        for (let i = 0; i < catalog.items.length; i++) {
            catalog.insertItem({
                stylesheetUrl: 'styles/catalogItem.css',
                imageSrc: catalog.items[i].image ? catalog.items[i].image.imageData.url : '/img/null.png',
                price: (catalog.items[i].item.itemData.variations[0].itemVariationData.priceMoney && catalog.items[i].item.itemData.variations[0].itemVariationData.priceMoney.amount !== null) ? `$${(parseInt(catalog.items[i].item.itemData.variations[0].itemVariationData.priceMoney.amount.toString()) / 100).toFixed(2)}` : 'null',
                itemName: catalog.items[i].item.itemData.name,
                targetElementId: 'catalog',
            });
        }
    },

    insertItem : function(parameters) {
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
    },
}

var cart = {
    items : [],
    elements : [],
    addToCart : function(id) {
        cart.items.push(catalog.items[id]);
        const targetElement = document.getElementById('cart');

        if (targetElement) {
            cart.innerHTML = '';
            for (let i = 0; i < cart.items.length; i++) {
                cart.innerHTML += `
                <link rel="stylesheet" href="/styles/cartItem.css">
                <div class="cartItem">
                    <div class="cartItemInfo">
                        <img src="${catalog.items[i].image ? catalog.items[i].image.imageData.url : '/img/null.png'}">
                        <span>${catalog.items[i].item.itemData.name}</span>
                    </div>
                    <a>X</a>
                </div>
                `
            }
        } else {
            console.error('target element not found');
        }
    }
}

function init() {
    fetch('http://localhost:3000/api/catalog')
        .then(response => response.json())
        .then(data => {
            catalog.items = data;
            catalog.insertItems();

            catalog.elements = document.getElementsByClassName('catalogItem');
            for (let i = 0; i < catalog.elements.length; i++) {
                catalog.elements[i].addEventListener('click', () => cart.addToCart(i));
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

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

        buildCart();
    },

};

function buildCart() {
    for (let i = 0; i < cart.items.length; i++) {
        console.log(`i ${i}`)
        for (let j = 0; j < square.length; j++) {
            console.log(`j ${j}`)
            if (square[j].type === "ITEM" && square[j].id == cart.items[i].id) {
                console.log(`true`)
                let img = '/img/null.png';

                // maybe make this a function rather than reusing it
                if (square[j].itemData.imageIds) {
                    for (let j = 0; j < square.length; j++) {
                        if (square[j].type === "IMAGE" && (square[j].id == square[i].itemData.imageIds[0])) {
                            img = square[j].imageData.url;
                        }
                    }
                }
                
                let name = square[j].itemData.name;
                
                document.getElementById('cart').innerHTML += `
                <link rel="stylesheet" href="/styles/cartItem.css">

                <div class="cartItem">

                    <div class="cartItemInfo">
                        <img src="${img}">
                        <span>${name}</span>
                    </div>
                    <a>X</a>

                </div>
                `;
            }
        }
    }
}

function buildCatalog() {
    for (let i = 0; i < square.length; i++) {
        if (square[i].type == "ITEM") {
            catalog.push(square[i].id)
            let img = '/img/null.png';

            if (square[i].itemData.imageIds) {
                for (let j = 0; j < square.length; j++) {
                    // this does not account for items with multiple images, too bad!
                    if (square[j].type === "IMAGE" && (square[j].id == square[i].itemData.imageIds[0])) {
                        img = square[j].imageData.url;
                    }
                }
            }

            // doesn't account for items with variable pricing, i don't think i'll be debating my barista on the price of my coffee anyways
            let price = (square[i].itemData.variations[0].itemVariationData.priceMoney && square[i].itemData.variations[0].itemVariationData.priceMoney.amount !== null) ? `$${(parseInt(square[i].itemData.variations[0].itemVariationData.priceMoney.amount.toString()) / 100).toFixed(2)}` : 'null';
            let name = square[i].itemData.name;

            document.getElementById('catalog').innerHTML += `
            <link rel="stylesheet" href="styles/catalogItem.css">
        
            <div class="catalogItem">
                <img src="${img}">
                    
                <div class="itemInfo">
                    <h3>
                        ${price}
                    </h3>
                    <span>
                        ${name}
                    </span>
                </div>
            </div>
            `;
        }
    }

    for (let i = 0; i < document.getElementsByClassName('catalogItem').length; i++) {
        document.getElementsByClassName('catalogItem')[i].addEventListener('click', () => cart.add(i));
    }
}

function init() {
    fetch('http://localhost:3000/api/catalog')
        .then(response => response.json())
        .then(data => {
            square = data;
            buildCatalog();
        })
        .catch(error => {
            console.error('failed to fetch catalog items: ', error);
        });
}

window.addEventListener('load', (e) => {
    init();
});

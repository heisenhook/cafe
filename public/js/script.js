const catalogItems = [];
const cartItems = [];

function init() {
    catalogItems = document.getElementsByClassName('catalogItem');

    for (let i = 0; i < catalogItems.length; i++) {
        catalogItems[i].addEventListener('click', (e) => {
            console.log('clicked;');
        })
    }
}

window.addEventListener('load', (e) => { init(); });
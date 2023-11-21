const socket = io('ws://localhost:8080');

var cartItems = [];
var catalogItems = [];

fetch('http://localhost:3000/api/catalog')
    .then(response => response.json())  // Corrected this line
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('failed to fetch catalog items: ', error);
});

function init() {
    catalogItems = document.getElementsByClassName('catalogItem');

    for (let i = 0; i < catalogItems.length; i++) {
        catalogItems[i].addEventListener('click', (e) => {
            console.log('clicked;');
        })
    }
}

socket.on('connect', () => {
    console.log('connected to websocket server');
});

window.addEventListener('load', (e) => { init(); });
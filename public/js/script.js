const socket = io('ws://localhost:8080');

var cartItems = [];
var catalogItems = [];

fetch('http://localhost:3000/api/catalog')
    .then(response => response.json())  // Corrected this line
    .then(data => {
        console.log(data);
        const sortedData = [];

        for (let i = 0; i < data.length; i++) {
          const currentItem = data[i];
        
          if (currentItem.type === 'ITEM') {
            const pair = {
              item: currentItem,
              image: null,
            };
        
            const imageId = currentItem.itemData.imageIds[0];
            const matchingImage = data.find(item => item.type === 'IMAGE' && item.id === imageId);
        
            if (matchingImage) {
              pair.image = matchingImage;
            }
        
            sortedData.push(pair);
          }
        }
        
        console.log(sortedData);
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
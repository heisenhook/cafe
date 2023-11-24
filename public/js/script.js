var square = [];
var catalog = [];
var cart = {

};

function buildCatalog() {
    for (let i = 0; i < square.length; i++) {
        if (square[i].type == "ITEM") {
            catalog.push(square[i].id)
            
        }
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

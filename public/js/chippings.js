const chippingsPrice = document.getElementById('price')
const chippings = document.getElementById('chippings')
let totalPrice;

chippings.addEventListener('change', handler)


function handler (){
  chippingsValue = this.value 
  instantPrice = chippingsValue * 6200
 totalPrice = instantPrice
  chippingsPrice.value = totalPrice
}

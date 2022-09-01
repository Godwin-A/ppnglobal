const price = document.getElementById('price')
const tonnes = document.getElementById('tonnes')
const inches = document.getElementById('inches')
const inchesValue = inches.value
const tonnesValue = tonnes.value

const inchesPrice = inches.addEventListener('change', function(){
 window.price = this.value;
 const totalPrice = window.tonnesPrice * window.price
 tonnes.hidden = false
 price.value = totalPrice
})
tonnes.addEventListener('change', function () {
 window.tonnesPrice = this.value;
const totalPrice = window.tonnesPrice * window.price
price.value = totalPrice
})
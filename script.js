products_dict = {
	detergente: { stock: 20, price: 200 },
	aceite: { stock: 1, price: 200 },
	azucar: { stock: 10, price: 200 },
	harina: { stock: 10, price: 200 },
	cerveza: { stock: 10, price: 200 },
};

function imprimirLista(){
  console.log("Lista de productos:");
  for (const key of Object.keys(products_dict)) {
    console.log(key);
  }
}

function esMayor(edad){
  if(edad>=18){
    return true
  } else{
    return false
  }
}

function existeProduct(lista,product){
  for (const key of Object.keys(lista)) {
    if(key === product){
      return true
    }
  }
  return false
}

imprimirLista()

eleccion = prompt(
	"Escriba el producto seleccionado escriba salir para terminar de comprar:"
);

let total = 0;

while (eleccion != "salir") {
  
	if (existeProduct(products_dict,eleccion) & products_dict[eleccion].stock > 0) {
    total = total + products_dict[eleccion].price
		products_dict[eleccion].stock = products_dict[eleccion].stock -1
	} else if (
		existeProduct(products_dict,eleccion) &
		products_dict[eleccion].stock <= 0
	) {
		console.log("no hay stock")
	} else {
		console.log("no existe el producto")
	}

  eleccion = prompt(
    "Escriba el producto seleccionado escriba salir para terminar de comprar:"
  );
}

console.log(`su total es de ${total}`);

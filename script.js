class Producto {
	constructor(nombre, categoria, precio) {
		this.nombre = nombre;
		this.precio = precio;
		this.categoria = categoria;
	}
}

let productos = [];
function agregarProducto(nombre, categoria, precio) {
	productos.push(new Producto(nombre, categoria, precio));
}

agregarProducto("arroz", "almacen", 200);
agregarProducto("aceite", "almacen", 100);
agregarProducto("vinagre", "almacen", 400);
agregarProducto("fideos", "almacen", 200);
agregarProducto("harina", "almacen", 500);
agregarProducto("detergente", "limpieza", 200);
agregarProducto("lavandina", "limpieza", 700);
agregarProducto("esponja", "limpieza", 200);

function eShop() {
	carrito = [];

	for (x of productos) {
		console.log(x.nombre);
	}

	let eleccion_usuario;

	while (eleccion_usuario != "salir") {
		eleccion_usuario = prompt("Ingresar nombre producto o escribe salir");
		let producto = productos.find(
			(elemento) => elemento.nombre === eleccion_usuario
		);
		if (producto != undefined) {
			carrito.push(producto);
			console.log("producto agregado al carrito");
		} else {
			console.log("el producto no existe");
		}
	}

	total = carrito.reduce((acumulador, elemento) => {
		return elemento.precio + acumulador;
	}, 0);

	console.log("a terminado su compra");
	console.log("el total de su compra es " + total);
}

eShop();

const productos = [];

class Producto {
	constructor(id, nombre, categoria, descripcion, precio, stock, imagen) {
		this.id = id;
		this.nombre = nombre;
		this.categoria = categoria;
		this.descripcion = descripcion;
		this.precio = precio;
		this.stock = stock;
		this.imagen = imagen;
	}

	restarStock() {
		this.stock = -1;
	}
}

class itemCarrito {
	constructor(producto_id, precio, cantidad) {
		this.producto_id = producto_id;
		this.producto_nombre;
		this.precio = precio;
		this.cantidad = cantidad;
		this.actualizarCantidad.bind(this);
	}

	actualizarCantidad(cantidad) {
		this.cantidad += cantidad;
	}
}

class Carrito {
	constructor(id) {
		this.id = id;
		this.itemsCarrito = [];
		this.agregarItem.bind(this);
		this.eliminarItem.bind(this);
		this.mostrarCarrito.bind(this);
		this.existe.bind(this);
	}

	agregarItem(itemCarrito) {
		const estaEnCarrito = carrito.existe(itemCarrito.producto_id);
		if (estaEnCarrito)
			return itemCarrito.actualizarCantidad(itemCarrito.cantidad);

		this.itemsCarrito.push(itemCarrito);
	}
	existe(producto_id) {
		return (
			this.itemsCarrito.filter((item) => item.producto_id == producto_id)[0] !=
			undefined
		);
	}
	eliminarItem(producto_id) {
		this.itemsCarrito = [...this.itemsCarrito].filter(
			(item) => item.producto_id != producto_id
		);
	}
	mostrarCarrito() {
		return this.itemsCarrito;
	}
}

const item1 = new itemCarrito(0, 200, 1);
const item2 = new itemCarrito(1, 300, 1);
const carrito = new Carrito();

carrito.agregarItem(item1);
carrito.agregarItem(item1);
carrito.agregarItem(item2);

carrito.mostrarCarrito();

function agregarProducto(
	id,
	nombre,
	categoria,
	descripcion,
	precio,
	stock,
	imagen
) {
	productos.push(
		new Producto(id, nombre, categoria, descripcion, precio, stock, imagen)
	);
}

agregarProducto(
	0,
	"thor",
	"heroes",
	"dddddddddddddrwerddddddddddd",
	200,
	190,
	"imagen0.jpg"
);
agregarProducto(
	1,
	"iron man",
	"heroes",
	"ddddddddqwdddddddddddd",
	300,
	10,
	"imagen0.jpg"
);
agregarProducto(
	2,
	"banda",
	"llaveros",
	"dddddddddddrddd",
	100,
	2,
	"imagen0.jpg"
);
agregarProducto(
	3,
	"redonda",
	"macetas",
	"dddrdddddddddddddddd",
	1200,
	5,
	"imagen0.jpg"
);
agregarProducto(
	4,
	"cuadrada",
	"macetas",
	"ddddddrdddddddrddddddddddd",
	123,
	7,
	"imagen0.jpg"
);
agregarProducto(
	5,
	"algo",
	"regalos",
	"dddrdddddddddddd",
	2354,
	8,
	"imagen0.jpg"
);
agregarProducto(
	6,
	"deadpool",
	"mates",
	"ddddddrdddddddd",
	34,
	19,
	"imagen0.jpg"
);
agregarProducto(
	7,
	"asdfasd",
	"mates",
	"dddddddrddddddd",
	666,
	199,
	"imagen0.jpg"
);

document.addEventListener(
	"DOMContentLoaded",
	function () {
		actualizarVistaProductos();
		actualizarVistaCarrito();
	},
	false
);

document.querySelectorAll(".categoria").forEach((item) => {
	item.addEventListener("click", (event) => {
		actualizarVistaProductos(event.target.value);
	});
});

function agregarCarrito(id) {
	let producto = productos.filter((producto) => {
		return producto.id === id;
	});

	cartItem = new itemCarrito(producto.id, producto.precio, 1);

	carrito.agregarItem(cartItem);
	let json = JSON.stringify(carrito.itemsCarrito);

	localStorage.setItem("carrito", json);
}

// localStorage.clear()

function templateCardProductos(id, nombre, descripcion, precio, stock, imagen) {
	let html = `
	<div class="card" style="width: 18rem;">
  <img class="card-img-top" src='./img/imagen${id}.jpg' alt="Card image cap">
  <div class="card-body">
    <h5 class="card-title">${nombre}</h5>
    <p class="card-text">${descripcion}</p>
		<div class="precio">Precio: ${precio}</div>
		<div class="stock">Stock: ${stock}</div>
    <a href="#" class="btn btn-primary" onclick=agregarCarrito(${id})>COMPRAR</a>
  </div>
</div>`;
	return html;
}

function templateCardCarrito(id, nombre, descripcion, precio, stock, imagen) {
	let html = `
	<div class="card" style="width: 18rem;">
  <img class="card-img-top" src='./img/imagen${id}.jpg' alt="Card image cap">
  <div class="card-body">
    <h5 class="card-title">${nombre}</h5>
    
		
		<div class="stock">Stock: ${stock}</div>
    
  </div>
</div>`;
	return html;
}

function actualizarVistaProductos(categoria) {
	let contenedor = document.querySelector(".lista_productos");
	if (categoria) {
		contenedor.innerHTML = "";
		let productosCategoria = productos.filter((producto) => {
			return producto.categoria === categoria;
		});

		for (let producto of productosCategoria) {
			let html = templateCardProductos(
				producto.id,
				producto.nombre,
				producto.descripcion,
				producto.precio,
				producto.stock,
				producto.imagen
			);
			contenedor.innerHTML += html;
		}
	} else {
		for (let producto of productos) {
			let html = templateCardProductos(
				producto.id,
				producto.nombre,
				producto.descripcion,
				producto.precio,
				producto.stock,
				producto.imagen
			);
			contenedor.innerHTML += html;
		}
	}
}

function actualizarVistaCarrito() {
	let json = JSON.stringify(carrito.itemsCarrito);

	localStorage.setItem("carrito", json);
	let contenedor = document.querySelector(".lista_carrito");
	contenedor.innerHTML = `<h1 class="titulo-carrito">Carrito</h1>`;
	let carritoLS = localStorage.getItem("carrito");
	let parseCarritoLS = JSON.parse(carritoLS);

	if (parseCarritoLS.length > 0) {
		for (let producto of parseCarritoLS) {
			let html = templateCardCarrito(
				producto.id,
				producto.nombre,
				producto.descripcion,
				producto.precio,
				producto.stock,
				producto.imagen
			);
			contenedor.innerHTML += html;
		}
	} else {
		let html = `
		<h2>No tiene productos en su carrito</h2>`;

		contenedor.innerHTML = html;
	}
}

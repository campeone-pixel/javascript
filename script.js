const productos = [];

class Producto {
	constructor(
		numero_id,
		nombre,
		categoria,
		descripcion,
		precio,
		stock,
		imagen
	) {
		this.numero_id = numero_id;
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
	constructor(producto_id, nombre, precio, cantidad, imagen) {
		this.producto_id = producto_id;
		this.nombre = nombre;
		this.precio = precio;
		this.cantidad = cantidad;
    this.imagen = imagen;
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
		this.copiarLocalStorage.bind(this);
		this.eliminarItem.bind(this);
		this.mostrarCarrito.bind(this);
		this.existe.bind(this);
	}

  copiarLocalStorage(itemCarrito){
    this.itemsCarrito.push(itemCarrito);
  }

	agregarItem(itemCarrito) {
		const estaEnCarrito = carrito.existe(itemCarrito.producto_id);

		if (estaEnCarrito) {
			let item = carrito.itemsCarrito.filter((item) => {
				return item.producto_id === itemCarrito.producto_id;
			});
			
			item[0].actualizarCantidad(1);
			let json = JSON.stringify(carrito.itemsCarrito);

			localStorage.setItem("carrito", json);
		} else {
			this.itemsCarrito.push(itemCarrito);
			let json = JSON.stringify(carrito.itemsCarrito);

			localStorage.setItem("carrito", json);
		}
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

const carrito = new Carrito();

function agregarProducto(
	numero_id,
	nombre,
	categoria,
	descripcion,
	precio,
	stock,
	imagen
) {
	productos.push(
		new Producto(
			numero_id,
			nombre,
			categoria,
			descripcion,
			precio,
			stock,
			imagen
		)
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
	"imagen1.jpg"
);
agregarProducto(
	2,
	"banda",
	"llaveros",
	"dddddddddddrddd",
	100,
	2,
	"imagen2.jpg"
);
agregarProducto(
	3,
	"redonda",
	"macetas",
	"dddrdddddddddddddddd",
	1200,
	5,
	"imagen3.jpg"
);
agregarProducto(
	4,
	"cuadrada",
	"macetas",
	"ddddddrdddddddrddddddddddd",
	123,
	7,
	"imagen4.jpg"
);
agregarProducto(
	5,
	"algo",
	"regalos",
	"dddrdddddddddddd",
	2354,
	8,
	"imagen5.jpg"
);
agregarProducto(
	6,
	"deadpool",
	"mates",
	"ddddddrdddddddd",
	34,
	19,
	"imagen6.jpg"
);
agregarProducto(
	7,
	"asdfasd",
	"mates",
	"dddddddrddddddd",
	666,
	199,
	"imagen7.jpg"
);

document.addEventListener(
	"DOMContentLoaded",
	function () {
		actualizarVistaProductos();
    copiarCarritoLocal()
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
	let productoAgregar = productos.filter((producto) => {
		return producto.numero_id === id;
	});

	let { numero_id, nombre, precio,imagen } = productoAgregar[0];

	let item = new itemCarrito(numero_id, nombre, precio, 1,imagen);

	carrito.agregarItem(item);
	actualizarVistaCarrito();
}



function templateCardProductos(
	numero_id,
	nombre,
	descripcion,
	precio,
	stock,
	imagen
) {
	let html = `
	<div class="card" style="width: 18rem;">
  <img class="card-img-top" src='./img/${imagen}' alt="Card image cap">
  <div class="card-body">
    <h5 class="card-title">${nombre}</h5>
    <p class="card-text">${descripcion}</p>
		<div class="precio">Precio: ${precio}</div>
		<div class="stock">Stock: ${stock}</div>
    <a href="#" class="btn btn-primary" onclick=agregarCarrito(${numero_id})>COMPRAR</a>
  </div>
</div>`;
	return html;
}

function templateCardCarrito(numero_id, nombre, cantidad, imagen) {
	let html = `
	<div class="card" style="width: 18rem;">
  <img class="card-img-top" src='./img/${imagen}' alt="Card image cap">
  <div class="card-body">
    <h5 class="card-title">${nombre}</h5>
    
		
		<div class="stock">Cantidad: ${cantidad}</div>
    
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
				producto.numero_id,
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
				producto.numero_id,
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

function copiarCarritoLocal(){
  let carritoLS = localStorage.getItem("carrito");
	if (carritoLS === null) {
		localStorage.setItem("carrito", JSON.stringify(carrito.itemsCarrito));
	} else {
		let parseCarritoLS = JSON.parse(carritoLS);

		for (let itemParse of parseCarritoLS) {
     
			let item = new itemCarrito(
				itemParse.producto_id,
				itemParse.nombre,
				itemParse.precio,
				itemParse.cantidad,
        itemParse.imagen
			);
			
     
			carrito.copiarLocalStorage(item);
		}
		
	}
}

function actualizarVistaCarrito() {
	let contenedor = document.querySelector(".lista_carrito");
	contenedor.innerHTML = `<h1 class="titulo-carrito">Carrito</h1>`;



	if (carrito.itemsCarrito.length > 0) {
		for (let producto of carrito.itemsCarrito) {
			let html = templateCardCarrito(
				producto.numero_id,
				producto.nombre,
				producto.cantidad,
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

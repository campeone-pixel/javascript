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
    this.existe.bind(this);
    this.cantidadItems();
    this.subtotal();
    this.total();
  }

  copiarLocalStorage(itemCarrito) {
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

  cantidadItems() {
    return this.itemsCarrito.length;
  }
  subtotal() {
    const len = this.itemsCarrito.reduce((acumulador, producto) => {
      return acumulador + producto.precio * producto.cantidad;
    }, 0);

    return len;
  }
  total() {
    return this.itemsCarrito.reduce((acumulador, producto) => {
      return acumulador + producto.precio * producto.cantidad;
    }, 20);
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
    copiarCarritoLocal();
    actualizarIconoCarrito();
  },
  false
);

function copiarCarritoLocal() {
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

function agregarCarrito(id) {
  let productoAgregar = productos.filter((producto) => {
    return producto.numero_id === id;
  });

  let { numero_id, nombre, precio, imagen } = productoAgregar[0];

  let item = new itemCarrito(numero_id, nombre, precio, 1, imagen);

  carrito.agregarItem(item);
  actualizarIconoCarrito();
  actualizarVistaDetalle(id);

  swal({
    title: "Se agrego al carrito",
    text: "Queres seguir comprando?",
    icon: "success",
    buttons: ["Ir al carrito", "Seguir comprando!"],
    
  }).then((willDelete) => {
    if (willDelete) {
      actualizarVistaProductos();
    } else {
      actualizarVistaCarrito();
    }
  });
}

function actualizarVistaProductos(categoria) {
  let contenedor = document.querySelector(".main-section");
  const containerCards = document.createElement("div");
  containerCards.className = "aside-cards";
  if (categoria) {
    contenedor.innerHTML = "";
    let productosCategoria = productos.filter((producto) => {
      return producto.categoria === categoria;
    });

    for (let producto of productosCategoria) {
      let html = plantillaTarjetaProducto(
        producto.numero_id,
        producto.nombre,
        producto.descripcion,
        producto.precio,
        producto.stock,
        producto.imagen
      );
      containerCards.innerHTML += html;
    }
  } else {
    contenedor.innerHTML = "";
    for (let producto of productos) {
      let html = plantillaTarjetaProducto(
        producto.numero_id,
        producto.nombre,
        producto.descripcion,
        producto.precio,
        producto.stock,
        producto.imagen
      );
      containerCards.innerHTML += html;
    }
  }

  const asideElement = document.createElement("aside");
  asideElement.className = "aside-store";
  asideElement.innerHTML = plantillaCategoriasAside();

  console.log(asideElement);

  contenedor.appendChild(asideElement);
  contenedor.appendChild(containerCards);

  document.querySelectorAll(".categoria").forEach((item) => {
    item.addEventListener("click", (event) => {
      actualizarVistaProductos(event.target.value);
    });
  });

  document.querySelectorAll(".ver-detalle").forEach((item) => {
    item.addEventListener("click", (event) => {
      actualizarVistaDetalle(event.target.id);
    });
  });
}

function actualizarVistaCarrito() {
  let contenedor = document.querySelector(".main-section");
  contenedor.innerHTML = ``;
  contenedor.innerHTML = plantillaCarritoProductos(
    carrito.cantidadItems(),
    carrito.subtotal(),
    carrito.total()
  );
  let rowListaProductos = document.querySelector(".lista-productos");

  if (carrito.itemsCarrito.length > 0) {
    for (let producto of carrito.itemsCarrito) {
      const producto_detalles = document.createElement("div");
      producto_detalles.classList.add("producto", "card", "mb-3", "mb-lg-0");
      producto_detalles.innerHTML = plantillaProductosCarrito(
        producto.nombre,
        producto.cantidad,
        producto.precio,
        producto.imagen
      );
      rowListaProductos.appendChild(producto_detalles);
    }
  } else {
    let html = `
		<h2>No tiene productos en su carrito</h2>`;

    contenedor.innerHTML = html;
  }

  actualizarIconoCarrito();
}

function actualizarIconoCarrito() {
  icon = document.querySelector(".icono-carrito");
  icon.removeChild(icon.lastChild);
  contenedorContador = document.createElement("span");
  contenedorContador.innerText = carrito.cantidadItems();
  icon.appendChild(contenedorContador);
}

function actualizarVistaDetalle(numero_id) {
  let contenedor = document.querySelector(".main-section");
  contenedor.innerHTML = ``;

  let producto = productos.filter((producto) => {
    return producto.numero_id === Number(numero_id);
  })[0];

  let html = plantillaDetalleProducto(
    producto.numero_id,
    producto.nombre,
    producto.categoria,
    producto.descripcion,
    producto.precio,
    producto.stock,
    producto.imagen
  );

  contenedor.innerHTML += html;

  actualizarIconoCarrito();
}

function plantillaCategoriasAside() {
  let html = `  
  <h3 id="titulo-categoria">CATEGORIAS</h3>
<ul class="lista-categorias">
  <li class="categoria" id="HEROES">
    <button href="" value="heroes">HEROES</button>
  </li>
  <li class="categoria" id="LLAVEROS">
    <button href="" value="llaveros">LLAVEROS</button>
  </li>
  <li class="categoria" id="MACETAS">
    <button href="" value="macetas">MACETAS</button>
  </li>
  <li class="categoria" id="REGALOS">
    <button href="" value="regalos">REGALOS</button>
  </li>
  <li class="categoria" id="MATES">
    <button href="" value="mates">MATES</button>
  </li>
</ul>
`;
  return html;
}

function plantillaDetalleProducto(
  numero_id,
  nombre,
  categoria,
  descripcion,
  precio,
  stock,
  imagen
) {
  let html = `      <section class="section-details">
      <div class="container my-5">
          <div class="row">
              <div class="col-md-5">
                  <div class="main-img">
                      <img class="img-fluid" src="./img/${imagen}" alt="ProductS">
                  </div>
              </div>
              <div class="col-md-7">
                  <div class="main-description px-2">
                      <div class="category text-bold">
                          Category: ${categoria}
                      </div>
                      <div class="product-title text-bold my-3">
                          ${nombre}
                      </div>
                      <div class="price-area my-4">
                          
                          <p class="new-price text-bold mb-1"> Precio: ${precio}</p>
                          <p class="new-price text-bold mb-1"> Stock: ${stock}</p>
                       
  
                      </div>
                      <div class="buttons d-flex my-5">
                         
                          <div class="block">
                              <button class="shadow btn custom-btn" onClick=agregarCarrito(${numero_id})>Add to cart</button>
                          </div>
  
                          <div class="block quantity">
                              <input type="number" class="form-control" id="cart_quantity" value="1" min="0" max=${stock} placeholder="Enter email" name="cart_quantity">
                          </div>
                      </div>
                  </div>
                  <div class="product-details my-4">
                      <p class="details-title text-color mb-1">Product Details</p>
                      <p class="description">${descripcion}</p>
                  </div>
             
              </div>
          </div>
      </div>
        `;
  return html;
}

function plantillaTarjetaProducto(
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
         
      <a href="#" class="ver-detalle btn btn-primary" id= ${numero_id} >VER DETALLE</a>
    </div>
  </div>`;
  return html;
}

function plantillaCarritoProductos(cantidad_item, subtotal, total) {
  let html = `<section class="section-carrito h-100 h-custom" style="background-color: #eee">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col">
          <div class="card">
            <div class="card-body p-4">


              <div class="row ">
                <div  class="col-lg-7 lista-productos">
                  <h5 class="mb-3">
                    <a href="#!" class="text-body"
                      ><i class="fas fa-long-arrow-alt-left me-2"></i>Continuar comprando</a
                    >
                  </h5>
                  <hr />
  
                  <div
                    class="d-flex justify-content-between align-items-center mb-4"
                  >
                    <div>
                      <p class="mb-1">Carrito de compra</p>
                      <p class="mb-0">Tienes ${cantidad_item} productos en tu carrito</p>
                    </div>
                 
                  </div>
                </div>
                <div class="col-lg-5">
                  <div class="card bg-primary text-white rounded-3">
                    <div class="card-body">
                      <div
                        class="d-flex justify-content-between align-items-center mb-4"
                      >
                        <h5 class="mb-0">Datos de la tarjeta</h5>
                        
                      </div>
  
                      <p class="small mb-2">Tipo de tarjeta</p>
                      <a href="#!" type="submit" class="text-white"
                        ><i class="fab fa-cc-mastercard fa-2x me-2"></i
                      ></a>
                      <a href="#!" type="submit" class="text-white"
                        ><i class="fab fa-cc-visa fa-2x me-2"></i
                      ></a>
                      <a href="#!" type="submit" class="text-white"
                        ><i class="fab fa-cc-amex fa-2x me-2"></i
                      ></a>
                      <a href="#!" type="submit" class="text-white"
                        ><i class="fab fa-cc-paypal fa-2x"></i
                      ></a>
  
                      <form class="mt-4">
                        <div class="form-outline form-white mb-4">
                          <input
                            type="text"
                            id="typeName"
                            class="form-control form-control-lg"
                            siez="17"
                            placeholder="Nombre y apellido"
                          />
                          <label class="form-label" for="typeName"
                            >Nombre del dueño</label
                          >
                        </div>
  
                        <div class="form-outline form-white mb-4">
                          <input
                            type="text"
                            id="typeText"
                            class="form-control form-control-lg"
                            siez="17"
                            placeholder="1234 5678 9012 3457"
                            minlength="19"
                            maxlength="19"
                          />
                          <label class="form-label" for="typeText"
                            >Numero de la tarjeta</label
                          >
                        </div>
  
                        <div class="row mb-4">
                          <div class="col-md-6">
                            <div class="form-outline form-white">
                              <input
                                type="text"
                                id="typeExp"
                                class="form-control form-control-lg"
                                placeholder="MM/YYYY"
                                size="7"
                                id="exp"
                                minlength="7"
                                maxlength="7"
                              />
                              <label class="form-label" for="typeExp"
                                >Vencimiento de la tarjeta</label
                              >
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-outline form-white">
                              <input
                                type="password"
                                id="typeText"
                                class="form-control form-control-lg"
                                placeholder="&#9679;&#9679;&#9679;"
                                size="1"
                                minlength="3"
                                maxlength="3"
                              />
                              <label class="form-label" for="typeText">Cvv</label>
                            </div>
                          </div>
                        </div>
                      </form>
  
                      <hr class="my-4" />
  
                      <div class="d-flex justify-content-between">
                        <p class="mb-2">Subtotal</p>
                        <p class="mb-2">${subtotal}</p>
                      </div>
  
                      <div class="d-flex justify-content-between">
                        <p class="mb-2">Envio</p>
                        <p class="mb-2">$20.00</p>
                      </div>
  
                      <div class="d-flex justify-content-between mb-4">
                        <p class="mb-2">Total(Incl. taxes)</p>
                        <p class="mb-2">${total}</p>
                      </div>
  
                      <button type="button" class="btn btn-info btn-block btn-lg">
                        <div class="d-flex justify-content-between">
                          <span>${total}</span>
                          <span
                            >Checkout
                            <i class="fas fa-long-arrow-alt-right ms-2"></i
                          ></span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  `;
  return html;
}

function plantillaProductosCarrito(titulo, cantidad, precio, imagen) {
  let html = `     <div class="card-body">
  <div class="d-flex justify-content-between">
    <div class="d-flex flex-row align-items-center">
      <div>
        <img
          src="./img/${imagen}"
          class="img-fluid rounded-3" alt="Shopping item" style="width: 65px;">
      </div>
      <div class="ms-3">
        <h5>${titulo}</h5>
        
      </div>
    </div>
    <div class="d-flex flex-row align-items-center">
      <div style="width: 50px;">
        <h5 class="fw-normal mb-0">${cantidad}</h5>
      </div>
      <div style="width: 80px;">
        <h5 class="mb-0">${precio}</h5>
      </div>
      <a href="#!" style="color: #cecece;"><i class="fas fa-trash-alt"></i></a>
    </div>
  </div>
</div>
`;
  return html;
}

// const len = carrito.itemsCarrito.reduce((acumulador, producto) => {
//   return acumulador + producto.precio * producto.cantidad;
// }, 0);

// console.log(len);

// lista= [1,2,4,5,6,7]
// const listanumer = lista.reduce((acumulador, Numero) => {
//   return acumulador + Numero;
// }, 0);

// const [ uno, dos ]= carrito.itemsCarrito.map(item=> item.precio);

// console.log(carrito.itemsCarrito);

// const listaasd = carrito.itemsCarrito
// console.log(carrito.itemsCarrito.filter((item) => {
//   return item.producto_id === 0;
// }))

// carrito.itemsCarrito.forEach((item)=>console.log(item))

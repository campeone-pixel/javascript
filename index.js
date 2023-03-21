


// creo la clase de itemCarrito para poder crear los productos que forman parte de un carrito

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

// creo la clase de carrito para poder agrupar los distintos productos 
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

      item[0].actualizarCantidad(itemCarrito.cantidad);
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

  vaciarCarrito(){
    this.itemsCarrito = []
  }
}


// Inicializo el carrito
const carrito = new Carrito();



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

function actualizarIconoCarrito() {
  icon = document.querySelector(".icono-carrito");
  icon.removeChild(icon.lastChild);
  contenedorContador = document.createElement("span");
  contenedorContador.innerText = carrito.cantidadItems();
  icon.appendChild(contenedorContador);
}

// ---------------------------------------------------
// funciones que se disparan segun eleccion del usuario

function agregarCarrito(id) {
  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((json) => {
      const {
        id: producto_id,
        title,
        category,
        description,
        price,
        image,
      } = json.find((producto) => {
        return producto.id === Number(id);
      });

      const cantidad = Number(document.getElementById("cart_quantity").value);
      console.log(cantidad);
      let item = new itemCarrito(producto_id, title, price, cantidad, image);

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
    });
}

function comprar() {
  swal({
    title: "Se realizo la compra con exito",

    icon: "success",
    button: "Volver al Ecommerce",
  }).then((volver) => {
    if (volver) {
      localStorage.clear();
      carrito.vaciarCarrito()
      actualizarIconoCarrito();
      actualizarVistaProductos();
      
    } else {
    }
  });
}



document.addEventListener(
  "DOMContentLoaded",
  function () {
    actualizarVistaProductos();
    copiarCarritoLocal();
    actualizarIconoCarrito();
  },
  false
);

// ---------------------------------------------------------------------------------
// funciones para las distintas vistas

function actualizarVistaProductos(categoria) {
  actualizarIconoCarrito();

  let contenedor = document.querySelector(".main-section");
  const containerCards = document.createElement("div");

  containerCards.className = "containerListaProductos";
  if (categoria != undefined) {
    contenedor.innerHTML = "";
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((json) => {
        const listaProductos = json.filter((producto) => {
          return producto.category === categoria;
        });

        listaProductos.forEach(
          ({ title, category, id, image, price }) => {
            let html = plantillaTarjetaProducto(
              id,
              title,
              
              price,
              image
            );
            containerCards.innerHTML += html;
          }
        );
        document.querySelectorAll(".ver-detalle").forEach((item) => {
          item.addEventListener("click", (event) => {
            actualizarVistaDetalle(event.target.id);
          });
        });
      });
  } else {
    contenedor.innerHTML = "";

    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((json) => {
        json.forEach(({ title, category, id, image, price }) => {
          let html = plantillaTarjetaProducto(
            id,
            title,
           
            price,
            image
          );
          containerCards.innerHTML += html;
        });
        document.querySelectorAll(".ver-detalle").forEach((item) => {
          item.addEventListener("click", (event) => {
            actualizarVistaDetalle(event.target.id);
          });
        });
      });
  }

  contenedor.appendChild(containerCards);

  document.querySelectorAll(".categoria").forEach((item) => {
    item.addEventListener("click", (event) => {
      actualizarVistaProductos(event.target.getAttribute("value"));
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

function actualizarVistaDetalle(id) {
  let contenedor = document.querySelector(".main-section");
  contenedor.innerHTML = ``;

  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((json) => {
      const {
        id: numero_id,
        title: nombre,
        category: categoria,
        description: descripcion,
        price: precio,
        image: imagen,
      } = json.find((producto) => {
        return producto.id === Number(id);
      });

      let html = plantillaDetalleProducto(
        numero_id,
        nombre,
        categoria,
        descripcion,
        precio,
        imagen
      );

      contenedor.innerHTML += html;
    });

  actualizarIconoCarrito();
}

// ----------------------------------------------------------------------------------
// Plantillas para las distintas vistas

function plantillaDetalleProducto(
  numero_id,
  nombre,
  categoria,
  descripcion,
  precio,
  imagen
) {
  let html = `      <section class="section-details">
      <div class="container my-5">
          <div class="row">
              <div class="col-md-5">
                  <div class="main-img">
                      <img class="img-fluid" src="${imagen}" alt="ProductS">
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
                          
                          <p class="new-price text-bold mb-1"> Precio: ${precio.toFixed(
                            2
                          )}</p>
                          
                       
  
                      </div>
                      <div class="buttons d-flex my-5">
                         
                          <div class="block">
                              <button class="shadow btn custom-btn" onClick=agregarCarrito(${numero_id})>Add to cart</button>
                          </div>
  
                          <div class="block quantity">
                              <input type="number" class="form-control" id="cart_quantity" value="1" min="0"  placeholder="Enter email" name="cart_quantity">
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
  
  precio,
  imagen
) {
  let html = `
    <div class="card productosLista" style="width: 18rem;">
    <div class="card-img-top">
    <img  class="imagenProducto" src='${imagen}' alt="Card image cap">
    </div>
    <div class="card-body">
      <h5 class="card-title">${nombre}</h5>
     
      
      <div class="precio">Precio: ${precio.toFixed(2)}</div>
      
         
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
                    onClick=actualizarVistaProductos()><i class="fas fa-long-arrow-alt-left me-2" ></i>Continuar comprando</a
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
                        <p class="mb-2">${subtotal.toFixed(2)}</p>
                      </div>
  
                      <div class="d-flex justify-content-between">
                        <p class="mb-2">Envio</p>
                        <p class="mb-2">$20.00</p>
                      </div>
  
                      <div class="d-flex justify-content-between mb-4">
                        <p class="mb-2">Total(Incl. taxes)</p>
                        <p class="mb-2">${total.toFixed(2)}</p>
                      </div>
  
                      <button type="button" onClick=comprar() class="btn btn-info btn-block btn-lg">
                        <div class="d-flex justify-content-between">
                          <span>${total.toFixed(2)} </span>
                          &nbsp;
                          <span
                            > Pagar
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
          src="${imagen}"
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
        <h5 class="mb-0">${precio.toFixed(2)}</h5>
      </div>
      <a href="#!" style="color: #cecece;"><i class="fas fa-trash-alt"></i></a>
    </div>
  </div>
</div>
`;
  return html;
}

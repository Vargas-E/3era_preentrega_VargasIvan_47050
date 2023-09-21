let selectedProducts = [];
const selectedTags = [];
let purchaseFinished = false;


const products = [
  {
    id: 0,
    name: "americano",
    image: "./assets/images/products/americano.webp",
    price: 400,
    tags: ["hot", "high_caffeine"],
    desc: "This brew is becoming a favourite amongst coffee connoisseurs looking for a bold, strong cup",
    quantity: 1,
  },
  {
    id: 1,
    name: "cortado",
    image: "./assets/images/products/cortado.webp",
    price: 400,
    tags: ["hot", "high_caffeine"],
    desc: "Cortado coffee is made with lightly steamed milk, no froth or foam. The steamed milk on top reduces the acidity of the coffee and creates a micro-foam which doesn’t separate from the espresso, giving it a strong and rich flavour.",
    quantity: 1,
  },
  {
    id: 2,
    name: "cafe au lait",
    image: "./assets/images/products/cafe_au_lait.webp",
    price: 450,
    tags: ["hot", "high_caffeine"],
    desc: "The Café au Lait is made using brewed coffee and steamed milk, in a typical ratio of one part coffee to one part steamed milk",
    quantity: 1,
  },
  {
    id: 3,
    name: "drip coffee",
    image: "./assets/images/products/drip_coffee.webp",
    price: 500,
    tags: ["hot", "high_caffeine"],
    desc: "Drip coffee is clean-bodied with a rounder, more simplistic flavour profile. It’s often praised due to its mellow and less intense flavour as it’s less concentrated than espresso.",
    quantity: 1,
  },
  {
    id: 4,
    name: "cold brew",
    image: "./assets/images/products/cold_brew.webp",
    price: 500,
    tags: ["cold", "high_caffeine"],
    desc: "Cold brew coffee is made by slowly steeping coarsely ground coffee beans in room temperature water for at least six hours",
    quantity: 1,
  },
  {
    id: 5,
    name: "decaf",
    image: "./assets/images/products/decaf.webp",
    price: 450,
    tags: ["hot", "no_caffeine"],
    desc: "Decaf coffee is made from regular coffee beans that go through a process to remove the majority of the caffeine.",
    quantity: 1,
  },
  {
    id: 6,
    name: "flat white",
    image: "./assets/images/products/flat_white.webp",
    price: 500,
    tags: ["hot", "no_caffeine"],
    desc: "A flat white is a blend of micro-foamed milk poured over a single or double shot of espresso. This microfoam is steamed milk infused with air, to create a smooth and velvety texture and creamy taste.",
    quantity: 1,
  },
  {
    id: 7,
    name: "irish coffee",
    image: "./assets/images/products/irish.webp",
    price: 700,
    tags: ["hot", "no_caffeine", "alcoholic"],
    desc: "Irish coffee has four main ingredients: coffee, Irish whiskey, sugar and cream.",
    quantity: 1,
  },
  {
    id: 8,
    name: "macchiato",
    image: "./assets/images/products/macchiato.webp",
    price: 650,
    tags: ["cold", "no_caffeine"],
    desc: "The macchiato is an espresso coffee drink, topped with a small amount of foamed or steamed milk to allow the taste of the espresso to still shine through.",
    quantity: 1,
  },
  {
    id: 9,
    name: "instant coffee",
    image: "./assets/images/products/instant_coffee.webp",
    price: 250,
    tags: ["hot", "no_caffeine"],
    desc: "Instant coffee is the dehydrated version of our favourite drink, readily available with the same great taste. Not to mention, it is quick and easy to make. In a rush? This is what you want.",
    quantity: 1,
  },
  {
    id: 10,
    name: "frapuccino",
    image: "./assets/images/products/frapuccino.webp",
    price: 750,
    tags: ["cold", "no_caffeine"],
    desc: "Frapuccino based on coffee. Sweet and creamy combination of coffee, milk and ice served cold.",
    quantity: 1,
  },
  {
    id: 10,
    name: "mocha frapuccino",
    image: "./assets/images/products/mocha_frapuccino.webp",
    price: 750,
    tags: ["cold", "no_caffeine"],
    desc: "coffee based frapuccino. Delicious mixture of coffee, milk and chocolate, blended with ice, with a whipped cream and mocha syrup finish.",
    quantity: 1,
  },
  {
    id: 11,
    name: "strawberry frapuccino",
    image: "./assets/images/products/strawberry_frapuccion.webp",
    price: 750,
    tags: ["cold", "no_caffeine"],
    desc: "Strawberry based frapuccino. Delicious mixture of strawberries and milk , blended with ice, with a whipped cream and strawberry syrup finish.",
    quantity: 1,
  },
];

class Product {
  constructor(product) {
    this.id = product.id;
    this.name = product.name;
    this.image = product.image;
    this.price = product.price;
    this.tags = product.tags;
    this.desc = product.desc;
    this.quantity = product.quantity;
  }

  add() {
    this.quantity += 1;
    this.changeCounter();
  }

  substract() {
    if (this.quantity > 1) {
      this.quantity -= 1;
    }
    this.changeCounter();
  }

  changeCounter() {
    document.getElementById(this.name + " " + "counter").innerHTML =
      this.quantity;
  }

  resetCounter() {
    this.quantity = 1;
    this.changeCounter();
  }

  addToCart() {
    const productInCart = selectedProducts.find((e) => e.name == this.name);
    if (productInCart) {
      selectedProducts = selectedProducts.map((e) =>
        e.name == this.name ? { ...e, quantity: this.quantity + e.quantity } : e
      );
    } else {
      selectedProducts.push({ ...this });
    }
    this.resetCounter();
    updateCart();
  }
}

let filteredProducts = products.map((e) => new Product(e));

const getCoffeeList = () => {
  let adder = "";
  for (const product of filteredProducts) {
    const index = filteredProducts.indexOf(product);
    const html = `<span class="coffeeCard">
    <div class="coffeeProductImageContainer">
        <img class="coffeeImage" alt=${product.name} src=${product.image} />
        <div class="coffeeProductImageDesc">
            <p>
                ${product.desc}
            </p>
        </div>
    </div>
    <div class="coffeeDesc">
        <div class="quantitySelectorContainer">
            <div class="productType">
                <button onclick="filteredProducts[${index}].substract()" class="coffeeButton coffeeButtonProductsPage">
                    <
                </button>
            </div>
            <div id="${product.name} counter" class="itemCounter">
                ${product.quantity}
            </div>
            <div class="productType">
                <button onclick="filteredProducts[${index}].add()" class="coffeeButton coffeeButtonProductsPage">
                    >
                </button>
            </div>
        </div>
        <div>${product.name.toUpperCase()}</div>
        <div>$ ${product.price}</div>
    </div>
    <div class="productType">
        <button onclick="filteredProducts[${index}].addToCart()" class="coffeeButton coffeeButtonProductsPage">Add to
            cart</button>
    </div>
</span>`;
    adder += html;
  }
  document.getElementById("coffeeProductsContainer").innerHTML = adder;
};

const addProducts = (product) => {
  const productInCart = selectedProducts.find(product.name);
  if (productInCart) {
    productInCart.quantity += product.quantity;
  } else {
    selectedProducts.push(product);
  }
  updateCart();
};

const updateCart = () => {
  let newCart = selectedProducts
    .map(
      (e, i) => `<div class='itemInCart'>
                <div class="itemText">
                  <div><b>Item:</b> ${e.name} (${e.quantity})</div>
                  <div><b>Total:</b> $${e.quantity * e.price}</div>
                </div>
                <button class="coffeeButton--square" onclick="deleteItemFromCart(${i})"><img class="deleteIcon" src="./assets/images/delete_icon.png" alt="delete icon"></button>
              </div>`
    )
    .join("");
  const tag = document.getElementById("cartItems");
  tag.innerHTML = newCart;
};

const deleteItemFromCart = (index) => {
  selectedProducts = selectedProducts.filter((e, i) => i != index);
  updateCart();
};

const changeFilter = () => {
  const filterSelect = document.getElementById("filterSelect");
  const filter = filterSelect.value;
  if (filter == "all") {
    filteredProducts = products.map((e) => new Product(e));
  } else {
    filteredProducts = products
      .filter((e) => e.tags.includes(filter))
      .map((a) => new Product(a));
  }
  getCoffeeList();
};

const orderProducts = () => {
  const orderSelect = document.getElementById("orderSelect");
  const order = orderSelect.value;
  if (order == "byPriceUp") {
    filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
  }
  if (order == "byPriceDown") {
    filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
  }
  if (order == "byDefault") {
    filteredProducts = products.map((e) => new Product(e));
  }
  getCoffeeList();
};

const finishPurchase = () => {
  purchaseFinished = true;
  bodyHandler();
};

const returnToProducts = () => {
  purchaseFinished = false;
  selectedProducts = [];
  bodyHandler();
};

const formatPurchase = () => {
  const formatted = selectedProducts
    .map(
      (e) =>
        `<div class="purchasedItem"><div>Product: <b>${
          e.name
        }</b></div><div>Quantity: <b>${
          e.quantity
        }</b></div><div>Full cost of product: <b>$${
          e.quantity * e.price
        }</b></div></div><hr class="solid"></hr>`
    )
    .join("");
  const fullPrice = selectedProducts.reduce(
    (acc, a) => acc + a.price * a.quantity,
    0
  );
  return (
    formatted +
    `<div class="purchasedItem"><b>Full cost of purchase: $${fullPrice}</b></div>`
  );
};

const bodyHandler = () => {
  if (purchaseFinished == false) {
    document.getElementById(
      "bodyHandler"
    ).innerHTML = `                <form class="productsForm">
    <label for="filterSelect"><b>Filter by:</b></label>
    <select name="order" id="filterSelect" onchange="changeFilter()">
        <option value="all">Show all</option>
        <option value="hot">Filter by hot beverages</option>
        <option value="cold">Filter by cold beverages</option>
    </select>
    <label for="orderSelect"><b>Order by:</b></label>
    <select name="order" id="orderSelect" onchange="orderProducts()">
        <option value="byDefault">By default</option>
        <option value="byPriceUp">Price (higher price first)</option>
        <option value="byPriceDown">Precio (lower price first)</option>
    </select>
    <div id="cartItems"></div>
    <button class="coffeeButton finishProducts" onclick="finishPurchase()">Finish purchase</button>
</form>
<article id="coffeeProductsContainer" class="coffeeList">
</article>`;
    getCoffeeList();
  } else {
    if (selectedProducts.length == 0) {
      document.getElementById(
        "bodyHandler"
      ).innerHTML = `<div class='finishContainer'><div class="finishTitle">Your cart is empty! Go back and order something!</div><div class="buttonRight">
      <button onclick="returnToProducts()" class="coffeeButton">Return to products</button>
    </div></div>`;
    } else {
      const selectedProductsFormatted = formatPurchase();
      document.getElementById(
        "bodyHandler"
      ).innerHTML = `<div class='finishContainer'>
          <div class="finishTitle">
            <h4>Thank you for choosing us! Your purchase was successful!</h4>
          <div>
          <div class="itemsInCart">
            <h5>Tus Productos:</h5>
            <div class="purchasedProductsList">
              ${selectedProductsFormatted}
            </div>
          </div>
          <div class="buttonRight">
            <button onclick="returnToProducts()" class="coffeeButton">Return to products</button>
          </div>
        </div>`;
    }
  }
};

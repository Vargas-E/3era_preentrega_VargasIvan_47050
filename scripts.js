class User {
  constructor(user) {
    this.name = user.name;
    this.password = user.password;
    this.purchaseHistory = user.purchaseHistory;
    this.currentCart = user.currentCart;
    this.age = user.age;
    this.lastLoginTs = user.lastLoginTs;
  }
}

const selectedTags = [];
let purchaseFinished = false;
let historyPage = false;
let loggedUser = !!JSON.parse(localStorage.getItem("loggedUser"))
  ? new User(JSON.parse(localStorage.getItem("loggedUser")))
  : null;

let users = !!JSON.parse(localStorage.getItem("users"))
  ? JSON.parse(localStorage.getItem("users")).map((e) => new User(e))
  : [];

let selectedProducts = [];

let products;


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

    Toastify({
      text: `${this.name} (${this.quantity}) added to cart!`,
      duration: 1500,
      gravity: "bottom",
      style: {
        background: "#1e1e1e",
      },
    }).showToast();
    this.resetCounter();
    updateCart();
  }
}

let filteredProducts;

const getCoffeeList = () => {
  let adder = "";
  for (const product of filteredProducts) {
    const index = filteredProducts.indexOf(product);
    const html = coffeeCardHtml(product, index);
    adder += html;
  }
  document.getElementById("coffeeProductsContainer").innerHTML = adder;
  for (const product of filteredProducts) {
    const index = filteredProducts.indexOf(product);
    const substract = document.getElementById(product.id + "substract");
    const add = document.getElementById(product.id + "add");
    const addToCart = document.getElementById(product.id + "addToCart");
    substract.addEventListener("click", () =>
      filteredProducts[index].substract()
    );
    add.addEventListener("click", () => filteredProducts[index].add());
    addToCart.addEventListener("click", () => {
      filteredProducts[index].addToCart();
    });
  }
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
  let newCart = selectedProducts.map((e, i) => productInCart(e, i)).join("");
  const tag = document.getElementById("cartItems");
  tag.innerHTML = newCart;
  for (const productInCart of selectedProducts) {
    const deleteButton = document.getElementById(productInCart.id);
    deleteButton.addEventListener("click", () =>
      deleteItemFromCart(productInCart.id)
    );
  }
};

const deleteItemFromCart = (id) => {
  selectedProducts = selectedProducts.filter((e, i) => e.id != id);
  updateCart();
};

const changeFilter = () => {
  const filterSelect = document.getElementById("filterSelect");
  const filter = filterSelect.value;
  if (filter == "all") {
    filteredProducts = filteredProductsHandler();
  } else {
    filteredProducts = filteredProductsHandler().filter((e) =>
      e.tags.includes(filter)
    );
  }
  getCoffeeList();
};

const orderProducts = () => {
  const orderSelect = document.getElementById("orderSelect");
  const order = orderSelect.value;
  if (order == "byPriceUp") {
    filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
  }
  if (order == "byPriceDown") {
    filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
  }
  if (order == "byDefault") {
    filteredProducts = filteredProductsHandler();
  }
  getCoffeeList();
};

const finishPurchase = () => {
  Swal.fire({
    title: "This will finish your purchase!",
    text: "Press finish to end your purchase",
    showCancelButton: true,
    confirmButtonColor: "#1e1e1e",
    cancelButtonColor: "#1e1e1e",
    confirmButtonText: "Yes, I'm done!",
    background: "#d2b48c",
  }).then((result) => {
    if (result.isConfirmed) {
      purchaseFinished = true;
      loggedUser = {
        ...loggedUser,
        purchaseHistory: [
          ...loggedUser.purchaseHistory,
          { dateOfPurchase: new Date(), products: selectedProducts },
        ],
        currentCart: [],
      };
      users = users.map((e) => (e.name != loggedUser.name ? e : loggedUser));
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
      bodyHandler();
    }
  });
};

const returnToProducts = () => {
  purchaseFinished = false;
  selectedProducts = [];
  window.scrollTo(0, 0);
  bodyHandler();
};

const formatPurchase = () => {
  const formatted = selectedProducts.map((e) => formatPurchaseHtml(e)).join("");
  const fullPrice = selectedProducts.reduce(
    (acc, a) => acc + a.price * a.quantity,
    0
  );
  return (
    formatted +
    `<div class="purchasedItem"><b>Full cost of purchase: $${fullPrice}</b></div>`
  );
};

const formatPurchasePrevious = (b) => {
  const formatted = b.map((e) => formatPurchaseHtml(e)).join("");
  const fullPrice = b.reduce((acc, a) => acc + a.price * a.quantity, 0);
  return (
    formatted +
    `<div class="purchasedItem"><b>Full cost of purchase: $${fullPrice}</b></div>`
  );
};

const bodyHandler = () => {
  if (historyPage == true) {
    document.getElementById("bodyHandler").innerHTML = purchaseHistorHtml();
    const historyButton = document.getElementById("purchaseHistoryButton");
    historyButton.setAttribute("disabled", "true");
    historyButton.style["color"] = "#bd1d15";
    historyButton.style.cursor = "auto";
    const goBackToProductsButton = document.getElementById(
      "returnToProductsHistory"
    );
    goBackToProductsButton.addEventListener("click", () => {
      historyPage = false;
      if (purchaseFinished == true) {
        purchaseFinished = false;
        selectedProducts = [];
      }
      bodyHandler();
      updateCart();
      window.scrollTo(0, 0);
      historyButton.removeAttribute("disabled");
      historyButton.style.removeProperty("color");
      historyButton.style.cursor = "pointer";
    });
  } else {
    if (purchaseFinished == false) {
      document.getElementById("bodyHandler").innerHTML = bodyHtml();
      const finishPurchaseButton = document.getElementById("finishPurchase");
      finishPurchaseButton.addEventListener("click", (e) => {
        e.preventDefault(), finishPurchase();
      });
      getCoffeeList();
    } else {
      if (selectedProducts.length == 0) {
        document.getElementById("bodyHandler").innerHTML = emptyCartHtml();
      } else {
        const selectedProductsFormatted = formatPurchase();
        document.getElementById("bodyHandler").innerHTML = purchaseFinishedHtml(
          selectedProductsFormatted
        );
      }
      const goBackToProductsButton =
        document.getElementById("returnToProducts");
      goBackToProductsButton.addEventListener("click", () =>
        returnToProducts()
      );
    }
  }
};

const headerHandler = () => {
  document.getElementById("headerHandler").innerHTML = headerHTML();
  const logoutButton = document.getElementById("logoutButton");
  logoutButton.addEventListener("click", () => handleLogout());
  const purchaseHistoryButton = document.getElementById(
    "purchaseHistoryButton"
  );
  purchaseHistoryButton.addEventListener("click", () => {
    historyPage = true;
    bodyHandler();
  });
};

const handleLogout = () => {
  Swal.fire({
    title: "Are you sure you want to log out?",
    text: "Your cart will be saved when you login next time!",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#1e1e1e",
    cancelButtonColor: "#1e1e1e",
    confirmButtonText: "Yes",
    background: "#d2b48c",
    iconColor: "#1e1e1e",
  }).then((result) => {
    if (result.isConfirmed) {
      const newUsers = users.map((e) =>
        e.name != loggedUser.name ? e : { ...e, currentCart: purchaseFinished == true ? [] : selectedProducts }
      );
      localStorage.setItem("users", JSON.stringify(newUsers));
      purchaseFinished = false;
      loggedUser = null;
      users = newUsers;
      localStorage.removeItem("loggedUser");
      selectedProducts = [];
      historyPage = false;
      handleLogin();
      document.getElementById("headerHandler").innerHTML = "";
    }
  });
};

const checkLoginStatus = () => {
  if (!loggedUser) {
    return false;
  } else {
    if (new Date() - new Date(loggedUser?.lastLoginTs) > 3600000) {
      return false;
    } else {
      return true;
    }
  }
};

const handleLogin = async () => {
  const check = checkLoginStatus();
  document.getElementById("mainHandler").innerHTML = mainBody();
  if (check) {
    products = await fetch("./products.json")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return data;
      });
    filteredProducts = filteredProductsHandler();
    // localStorage.setItem(
    //   "loggedUser",
    //   JSON.stringify({ ...loggedUser, lastLoginTs: new Date() })
    // );
    headerHandler();
    bodyHandler();
    Toastify({
      text: `Welcome ${loggedUser.name}`,
      duration: 3000,
      gravity: "bottom",
      style: {
        background: "#1e1e1e",
      },
    }).showToast();
    selectedProducts = !!loggedUser?.currentCart ? loggedUser?.currentCart : [];
    updateCart();
  } else {
    document.getElementById("bodyHandler").innerHTML = login();
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = users.find(
        (a) => a.name == e.target[0].value && a.password == e.target[1].value
      );
      if (user) {
        loggedUser = new User({ ...user, lastLoginTs: new Date() });
        handleLogin();
      } else {
        const errorTag = document.getElementById("loginError");
        errorTag.innerHTML = `<div>Wrong password or username</div>`;
        setTimeout(() => {
          errorTag.innerHTML = "";
        }, 2000);
      }
    });
    const registerButton = document.getElementById("registerButton");
    registerButton.addEventListener("click", () => handleRegister());
  }
};

const handleRegister = () => {
  document.getElementById("bodyHandler").innerHTML = register();
  const registerForm = document.getElementById("registerForm");
  const loginButton = document.getElementById("loginButton");
  loginButton.addEventListener("click", () => handleLogin());
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const validate = validateRegister(
      e.target[0].value,
      e.target[1].value,
      e.target[2].value,
      e.target[3].value
    );
    if (validate == true) {
      loggedUser = new User({
        name: e.target[0].value,
        password: e.target[2].value,
        purchaseHistory: [],
        age: e.target[1].value,
        currentCart: [],
        lastLoginTs: new Date(),
      });
      users.push(loggedUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
      handleLogin();
    } else {
      const errorTag = document.getElementById("registerError");
      errorTag.innerHTML = `<div>${validate}</div>`;
      setTimeout(() => {
        errorTag.innerHTML = "";
      }, 2000);
    }
  });
};

const validateRegister = (name, age, password, password2) => {
  if (users.find((e) => e.name == name)) {
    return "Name already in use";
  }
  if (password != password2) {
    return "Password repeat doesn't match";
  }
  return true;
};

const filteredProductsHandler = () => {
  return loggedUser?.age > 21
    ? products.map((e) => new Product(e))
    : products
        .filter((e) => !e.tags.includes("alcoholic"))
        .map((a) => new Product(a));
};

// HTMLS
const coffeeCardHtml = (product, index) => {
  return `<span class="coffeeCard">
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
                <button id=${
                  product.id + "substract"
                }  class="coffeeButton coffeeButtonProductsPage">
                    <
                </button>
            </div>
            <div id="${product.name} counter" class="itemCounter">
                ${product.quantity}
            </div>
            <div class="productType">
                <button id=${
                  product.id + "add"
                }  class="coffeeButton coffeeButtonProductsPage">
                    >
                </button>
            </div>
        </div>
        <div class="productName">${product.name.toUpperCase()}</div>
        <div>$ ${product.price}</div>
    </div>
    <div class="productType">
        <button id=${
          product.id + "addToCart"
        } class="coffeeButton coffeeButtonProductsPage">Add to
            cart</button>
    </div>
</span>`;
};

const productInCart = (e, i) => {
  return `<div class='itemInCart'>
            <div class="itemText">
              <div><b>Item:</b> ${e.name} (${e.quantity})</div>
              <div><b>Total:</b> $${e.quantity * e.price}</div>
            </div>
            <button id=${
              e.id
            } class="coffeeButton--square"><img class="deleteIcon" src="./assets/images/delete_icon.png" alt="delete icon"></button>
          </div>`;
};

const bodyHtml = () => {
  return `<form class="productsForm">
            <label for="filterSelect"><b>Filter by:</b></label>
            <select name="order" id="filterSelect" onchange="changeFilter()">
                <option value="all">Show all</option>
                <option value="hot">Filter by hot beverages</option>
                <option value="cold">Filter by cold beverages</option>
                ${
                  loggedUser?.age > 21
                    ? `<option value="alcoholic">Filter by alcohol beverages</option>`
                    : ""
                }
                ${
                  loggedUser?.age < 21
                    ? `<option value="non_alcoholic">Filter by non alcohol beverages</option>`
                    : ""
                }
            </select>
            <label for="orderSelect"><b>Order by:</b></label>
            <select name="order" id="orderSelect" onchange="orderProducts()">
                <option value="byDefault">By default</option>
                <option value="byPriceUp">Price (higher price first)</option>
                <option value="byPriceDown">Precio (lower price first)</option>
            </select>
            <div id="cartItems"></div>
            <button id="finishPurchase" class="coffeeButton finishProducts">Finish purchase</button>
          </form>
          <article id="coffeeProductsContainer" class="coffeeList">
          </article>`;
};

const emptyCartHtml = () => {
  return `<div class='finishContainer'>
            <div class="finishTitle">Your cart is empty! Go back and order something!</div>
            <div class="buttonRight">
              <button id="returnToProducts" class="coffeeButton">
                Return to products
              </button>
            </div>
          </div>`;
};

const purchaseFinishedHtml = (selectedProductsFormatted) => {
  return `<div class='finishContainer'>
            <div class="finishTitle">
              <h4>Thank you for choosing us! Your purchase was successful!</h4>
            <div>
            <div class="itemsInCart">
              <h5>Your purchase:</h5>
              <div class="purchasedProductsList">
                ${selectedProductsFormatted}
              </div>
            </div>
            <div class="buttonRight">
              <button id="returnToProducts" class="coffeeButton">Return to products</button>
            </div>
          </div>`;
};

const formatPurchaseHtml = (e) => {
  return `<div class="purchasedItem">
            <div>Product: <b>${e.name}</b></div>
            <div>Quantity: <b>${e.quantity}</b></div>
            <div>Full cost of product: <b>$${e.quantity * e.price}</b></div>
          </div>
          <hr class="solid"></hr>`;
};

const promptBody = () => {
  return `<div></div>`;
};

const mainBody = () => {
  return `<section class="primaryImageContainer">
            <img class="centerImage" src="./assets/images/coffee_central_image.webp" />
            <div class="centerImageText">
                <img class="logoInBanner" src="./assets/images/coffee_logo.webp" />
                <div>The most delicious coffee in town, now just one click away</div>
            </div>
          </section>
          <section class="homeBody">
            <div id="bodyHandler" class="productOptionsFormContainer">
            </div>
          </section>
          <a href="#" class="float">
            <div>
                ^
                <span class="tooltipText">GO TO TOP</span>
            </div>
          </a>`;
};

const login = () => {
  return `<section class="genericContainer ">
  <div class="title">Login</div>
  <form class="inputContainer" id="loginForm">
    <label for="fname">Username:</label>
    <input type="text" id="fname" name="fname" />
    <label for="lname">Password:</label>
    <input type="text" id="lname" name="lname" />
    <input class="coffeeButton extraMargin" type="submit" />
  </form>
  <div class="errorMessage" id="loginError"></div>
  <div class="signLink" id="registerButton">Dont have an account? Sign up here</div>
</section>;`;
};

const register = () => {
  var list = [];
  for (var i = 12; i <= 100; i++) {
    list.push(i);
  }
  return `<section class="genericContainer">
  <div class="title">Register</div>
  <form class="inputContainer" id="registerForm">
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" />
    <label for="age">Age:</label>

    <select name="age" id="ageSelect" >
    ${list.map((e) => `<option value=${e}>${e}</option>`).join("")}
    </select>
    <label for="password">Password:</label>
    <input type="text" id="password" name="password" />
    <label for="password2">Repeat password:</label>
    <input type="text" id="password2" name="password2" />
    <input class="coffeeButton extraMargin"type="submit" />
    <div class="errorMessage" id="registerError"></div>
  </form>
  <div class="signLink" id="loginButton">Already have an account? Sign in here</div>
</section>;`;
};

const headerHTML = () => {
  return `<nav class="navbar navbar-dark navbar-expand-md navBar">
            <img class="logo" src="./assets/images/coffee_logo.webp">
            <button class="navbar-toggler sand" data-bs-toggle="collapse" data-bs-target="#navbar">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="navbar-collapse collapse" id="navbar">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <button class="nav-link logout" id="purchaseHistoryButton">History</button>
                    </li>
                </ul>
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <button class="nav-link logout" id="logoutButton">Logout</button>
                    </li>
                </ul>

            </div>
          </nav>`;
};

const purchaseHistorHtml = () => {
  return `<div class='finishContainer'>
  <div class="finishTitle">
    <h4>Your previous purchases:</h4>
  </div>
  ${previousPurchasesListHandler()}
  <div class="buttonRight">
    <button id="returnToProductsHistory" class="coffeeButton">Return to products</button>
  </div>
</div>`;
};

const formatDate = (crudeDate) => {
  const date = new Date(crudeDate);
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1;
  let dd = date.getDate();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  const formattedDate = dd + "/" + mm + "/" + yyyy;
  return formattedDate;
};

const previousPurchasesListHandler = () => {
  if (loggedUser.purchaseHistory.length == 0) {
    return `<div>No purchases yet!</div>`;
  } else {
    return loggedUser.purchaseHistory
      .map(
        (e, i) =>
          `<div class="previousPurchaseContainer">
          <button class="btn btn-primary previousPurchaseButton" type="button" data-bs-toggle="collapse" data-bs-target="#${i}" aria-expanded="false" aria-controls="${i}">
            Date of purchase: ${formatDate(Date.parse(e.dateOfPurchase))}
          </button>
          <div class="collapse itemsInCart" id="${i}">
          <div class="card card-body">
            ${formatPurchasePrevious(e.products)}
          </div>
        </div>
      </div>`
      )
      .join("");
  }
};

window.onload = () => {
  handleLogin()
};

window.addEventListener("beforeunload", () => {
  if (selectedProducts.length > 0 && purchaseFinished == false) {
    loggedUser = { ...loggedUser, currentCart: selectedProducts };
    localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
    localStorage.setItem(
      "users",
      JSON.stringify(
        users.map((e) => (e.name != loggedUser.name ? e : loggedUser))
      )
    );
  }
  if (purchaseFinished == true) {
    loggedUser = {...loggedUser, currentCart: []}
    localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
    localStorage.setItem(
      "users",
      JSON.stringify(
        users.map((e) => (e.name != loggedUser.name ? e : loggedUser))
      )
    );
  }
});

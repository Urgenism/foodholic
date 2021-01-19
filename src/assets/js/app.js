import { v4 as uuidv4 } from "uuid";
import $ from "jquery";
import "bootstrap/js/dist/modal";

function init() {
  const addItemBtn = document.getElementById("js-addItem");
  const addedItemsList = document.getElementById("js-addedItemsList");
  const modalFoodSelectEl = document.getElementById("js-modalFoodSelect");
  const modalQuantityEl = document.getElementById("js-modalQuantity");
  const modalSubTotalEl = document.getElementById("js-modalSubTotal");
  const minusEl = document.getElementById("js-minusOperator");
  const plusEl = document.getElementById("js-plusOperator");
  const subTotalEl = document.getElementById("js-subTotal");
  const grandTotalEl = document.getElementById("js-grandTotal");
  const deliveryChargeEl = document.getElementById("js-deliveryCharge");
  const couponEl = document.getElementById("js-couponApplied");

  let data = {
    food: [
      {
        id: 1,
        food: "Red N hot(Thin Crust Pizza)",
        price: 25,
        quantity: 1,
      },
      {
        id: 2,
        food: "Chicken Burger",
        price: 15.09,
        quantity: 1,
      },
      {
        id: 3,
        food: "Cheesy Veg sandwich",
        price: 52.99,
        quantity: 1,
      },
    ],
    addedFood: [
      {
        id: uuidv4(),
        food: "Red N hot(Thin Crust Pizza)",
        ingredients: [
          "Red Sauce",
          "Ricotta",
          "Smoked Ham",
          "Garlic",
          "BBQ Sauce Drizzle",
        ],
        sizes: ["L", "M"],
        price: 25,
        quantity: 2,
      },
      {
        id: uuidv4(),
        food: "Chicken Burger",
        price: 15.09,
        quantity: 2,
      },
      {
        id: uuidv4(),
        food: "Cheesy Veg sandwich",
        price: 52.99,
        quantity: 1,
      },
    ],
    deliveryCharge: 15.0,
    couponApplied: 10.0,
    newlyAddedFood: null,
  };

  // DATA  CONTROLLER
  const addItems = () => {
    if (data.newlyAddedFood) {
      data.addedFood.push(data.newlyAddedFood);
      data.newlyAddedFood = null;
      resetItemModalUI();
      mapDataToUI();
      $("#item-modal").modal("hide");
    }
  };

  const increaseDecreaseQuantity = (operation) => {
    if (!data.newlyAddedFood) return;
    if (operation === "decrease" && data.newlyAddedFood.quantity === 1) return;
    let quantity = data.newlyAddedFood.quantity;
    quantity = operation === "decrease" ? --quantity : ++quantity;
    data.newlyAddedFood.quantity = quantity;
    updateItemModalUI();
  };

  const removeAddedItem = (e) => {
    const targetElement = e.target;
    if (targetElement.id === "js-removeAddedItem") {
      const targetElementId = targetElement.dataset.id;

      const updatedAddedFood = data.addedFood.filter(
        (item) => item.id !== targetElementId
      );
      data.addedFood = updatedAddedFood;
      mapDataToUI();
    }
  };

  // UI CONTROLLER
  const updateItemModalUI = () => {
    if (data.newlyAddedFood) {
      const { quantity, price } = data.newlyAddedFood;
      modalQuantityEl.textContent = quantity;
      const subTotal = (quantity * price).toFixed(2);
      modalSubTotalEl.textContent = `$${subTotal}`;
    }
  };

  const resetItemModalUI = () => {
    modalQuantityEl.textContent = 1;
    modalFoodSelectEl.value = "choose";
    modalSubTotalEl.textContent = "$0.00";
  };

  const mapDataToUI = () => {
    if (!data.addedFood) return;

    addedItemsList.innerHTML = null;
    data.addedFood.map((item) => {
      const listItemElement = document.createElement("li");
      listItemElement.classList.add("added-items__item");
      listItemElement.innerHTML = newlyAddedItemTemplate(item);
      addedItemsList.append(listItemElement);
    });

    const allElementsTotalPrice = data.addedFood
      .map((item) => item.quantity * item.price)
      .reduce((prevEl, nextEl) => {
        return prevEl + nextEl;
      }, 0);
    const grandTotal =
      allElementsTotalPrice + data.deliveryCharge - data.couponApplied;

    deliveryChargeEl.textContent = `$${data.deliveryCharge}`;
    couponEl.textContent = `-$${data.couponApplied}`;
    subTotalEl.textContent = `$${allElementsTotalPrice.toFixed(2)}`;
    grandTotalEl.textContent = `$${grandTotal.toFixed(2)}`;
  };

  const newlyAddedItemTemplate = (data) => {
    const { quantity, price, food, ingredients, sizes, id } = data;
    const subTotal = (price * quantity).toFixed(2);

    const ingredientsList = document.createElement("div");
    ingredientsList.classList.add("added-items__ingredients");

    const sizesList = document.createElement("div");
    sizesList.classList.add("added-items__size");

    if (ingredients) {
      ingredients.map((item) => {
        const ingredientEl = document.createElement("span");
        ingredientEl.textContent = item;
        ingredientsList.append(ingredientEl);
      });
    }

    if (sizes) {
      sizes.map((item) => {
        const sizeEl = document.createElement("span");
        sizeEl.textContent = item;
        sizesList.append(sizeEl);
      });
    }

    return `
    <div class="added-items__details">
      <img
        src="./assets/img/abstract-business-code-270348.jpg"
        alt="user image"
        class="added-items__img img-fluid"
      />
      <div class="added-items__info">
        <div class="added-items__head">
          <h6 class="added-items__title">${food}</h6>
          ${sizes ? sizesList.outerHTML : ""}
        </div>
        ${ingredients ? ingredientsList.outerHTML : ""}
        <div class="added-items__amount">
          <span class="added-items__amount-num">$${price}</span>
          <button class="button button--ghost">Edit</button>
        </div>
      </div>
    </div>
    <div class="added-items__quantity">
      <div class="added-items__quantity-detail">
        <span class="added-items__quantity-operator">-</span>
        <span class="added-items__quantity-num">${quantity}</span>
        <span class="added-items__quantity-operator">+</span>
      </div>
      <span class="added-items__quantity-label">Quantity</span>
    </div>
    <div class="added-items__price">
      <div class="added-items__price-number">${subTotal}</div>
      <div class="added-items__price-label">Subtotal</div>
    </div>
    <span class="added-items__cancel-button" data-id=${id} role="button" id="js-removeAddedItem"
      >X</span
    >`;
  };

  // EVENT LISTENERS
  minusEl.addEventListener("click", () => {
    increaseDecreaseQuantity("decrease");
  });

  plusEl.addEventListener("click", () => {
    increaseDecreaseQuantity("increase");
  });

  modalFoodSelectEl.addEventListener("change", (e) => {
    const selectedFoodId = +e.target.value;
    const selectedFood = data.food.find((item) => item.id === selectedFoodId);
    data.newlyAddedFood = Object.assign(
      {},
      ...[selectedFood, { id: uuidv4() }]
    );
    console.log(data, "data");
    updateItemModalUI();
  });
  addItemBtn.addEventListener("click", addItems);
  addedItemsList.addEventListener("click", removeAddedItem);

  // THIS EVENT WILL RUN AFTER MODAL GET CLOSED
  $("#item-modal").on("hidden.bs.modal", function () {
    resetItemModalUI();
  });

  mapDataToUI();
}

init();

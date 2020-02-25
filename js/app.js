class App {
  constructor() {
    this.components = null;
    this.usedIngredients = [];

    this.plate = document.querySelector('.plate');
    this.componentsList = document.querySelector('.components-list');
    this.usedIngredientsList = document.querySelector('.used-ingredients__list');
    
    /* initialization of the project */
    this.init();
  }
  init = async () => {
    this.components = await this.fetchComponents();
    
    /* rendering */
    this.renderComponents();

    /* adding listeners */
    this.componentsList.addEventListener('click', this.addIngredient);
    this.usedIngredientsList.addEventListener('click', this.removeIngredient);
  }
  fetchComponents = async () => {
    const res = await fetch('../js/data/components.json');
    const components = await res.json();

    return components;
  }
  addIngredient = (event) => {
    const target = event.target;

    if(!target.closest('.components-ingredient')) return;

    const categoryId = target.getAttribute('data-category-id');
    const ingredientId = target.getAttribute('data-ingredient-id');
    const currentIngredient = this.components.categories[categoryId].ingredients[ingredientId];
    
    /* search ingredients */
    const foundItem = this.usedIngredients.find(item => item.title == currentIngredient.title);
    
    if(!foundItem) {
      this.usedIngredients.push(currentIngredient);
    }

    this.renderIngredients();
  }
  removeIngredient = () => {
    const target = event.target;

    if(!target.closest('.used-ingredient')) return;

    const usedIngredientId = target.getAttribute('data-used-ingredient-id');

    this.usedIngredients.splice(usedIngredientId, 1);

    this.renderIngredients();
  }
  renderIngredients = () => {
    /* clean previous html markup */
    this.plate.innerHTML = '<img src="images/foundation/foundation_2.png" alt="Основа">';
    this.usedIngredientsList.innerHTML = '';

    this.usedIngredients.forEach((ingredient, index) => {
      /* rendering list used ingredients */
      this.usedIngredientsList.innerHTML += `
        <div class="used-ingredients__item used-ingredient">
        ${ingredient.title}
        <div class="delete-btn" data-used-ingredient-id="${index}">-</div>
        </div>
      `;

      /* rendering ingredient in plate */
      this.plate.innerHTML += `
        <img src="images/ingredients/${ingredient.src}.png" alt="${ingredient.title}">
      `;
    });
  }
  renderComponents() {
    this.components.categories.forEach((category, id) => {
      this.componentsList.innerHTML += `
        <div class="components__item" data-category-id="${id}">
          ${category.title}
          <ul>
            ${category.ingredients.map((ingredient, index) => `
            <li class="components-ingredient" data-category-id="${id}" data-ingredient-id="${index}">
              ${ingredient.title}
            </li>
            `).join('')}
          </ul>
        </div>
      `;
    });
  }
}
new App();
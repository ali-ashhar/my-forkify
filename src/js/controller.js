import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resaultView from './views/resaultView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODEL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const controllRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    // 1)render spinner
    recipeView.renderSpinner();

    resaultView.update(model.loadSearchResaultPage());
    bookmarksView.update(model.state.bookMarks);

    // 2)load recipe from id
    await model.loadRecipe(id);
    // 3)render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

// if (module.hot) {
//   module.hot.accept();
// }

const controlSearchResault = async function () {
  try {
    // 1)load search spinner
    resaultView.renderSpinner();

    // 2)get search from view
    const quary = searchView.getQuery();
    if (!quary) return;
    // 3)get resault from api
    await model.loadSearchRecipe(quary);
    // render result
    resaultView.render(model.loadSearchResaultPage());
    // 4)render pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (page) {
  resaultView.renderSpinner();
  // render new result
  resaultView.render(model.loadSearchResaultPage(page));
  // render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update recipe servings
  model.updateServings(newServings);
  // update the view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
  // update pagination
};

const controllAddBookmark = function () {
  // 1) add/remove bookmark
  if (!model.state.recipe.bookMarked) {
    model.addbookMarks(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  // 2) update recipe view
  recipeView.update(model.state.recipe);
  // 3) render book mark
  bookmarksView.render(model.state.bookMarks);
};
const controlRenderBookmark = function () {
  bookmarksView.render(model.state.bookMarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show spinner
    addRecipeView.renderSpinner();

    // Upload recipe
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookMarks);

    // Change ID on browser
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window afther time out
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('error from addrecipe upload!');
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addBookmarkHandler(controlRenderBookmark);
  recipeView.addRenderHandler(controllRecipe);
  recipeView.addClickHandler(controlServings);
  recipeView.addClickHandlerForBookmark(controllAddBookmark);
  searchView.addSearchHandler(controlSearchResault);
  paginationView.addClickHandler(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookMarksView from './views/bookMarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODEL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import { MODEL_CLOSE_SEC } from './config.js';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    //0.update result voew to mark selected search result
    resultView.update(model.getSearchResultsPage());

    //1. Loading the recipe
    await model.loadRecipe(id);
    //3. updating the bookmarks view
    bookMarksView.update(model.state.bookmarks);
    //2 rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    alert(error);
    console.error(error);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();
    //1) get search query
    const query = searchView.getQuery();
    if (!query) throw error;
    //2) load search Results
    await model.loadSearchResults(`${query}`);
    //3)render search results
    // resultView.render(model.state.search.results);
    resultView.render(model.getSearchResultsPage());
    //4) render initial pagination
    paginationView.render(model.state.search);
  } catch (error) {
    resultView.renderError();
  }
};

const controlPagination = function (gotoPage) {
  //1)render New results
  resultView.render(model.getSearchResultsPage(gotoPage));
  //2) render new  pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update the recipe servings ( in state)
  model.updateServings(newServings);
  // update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1. Add/remove Bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //2. update recipe view
  recipeView.update(model.state.recipe);
  //3. render the bookmark view
  bookMarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookMarksView.render(model.state.bookmarks);
};

const controlAddRecipes = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();

    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render Recipe
    recipeView.render(model.state.recipe);

    //sucsess Message
    addRecipeView.renderMessage();

    //render bookmark view
    bookMarksView.render(model.state.bookmarks);

    //change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error);
  }
};

const newFeature = function () {
  console.log('welcome to the Website');
};

const init = function () {
  bookMarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipes);
  newFeature();
};

init();

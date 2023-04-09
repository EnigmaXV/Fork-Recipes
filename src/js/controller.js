import * as model from "./model.js";
import icons from "url:../img/icons.svg"; // Parcel 2
import "regenerator-runtime/runtime";
import "core-js/stable";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import aaddRecipeView from "./views/addRecipeView.js";
import { async, mark } from "regenerator-runtime";
import addRecipeView from "./views/addRecipeView.js";

const recipeContainer = document.querySelector(".recipe");

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

////////////////////////////////
const controlRecipes = async function () {
  try {
    recipeView.renderSpinner();
    const hashValue = window.location.hash.slice(1);
    console.log(hashValue);
    if (!hashValue) return;

    await model.loadRecipe(hashValue);

    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};
////////////////////////////////
const controlSearchResults = async () => {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    console.log(query);
    if (!query) return;
    await model.loadSearchResaults(query);
    resultsView.render(model.getSearchResultsPage(1));
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
    resultsView.renderError();
  }
};
////////////////////////////////
const controlPagniation = pageToGo => {
  resultsView.render(model.getSearchResultsPage(pageToGo));
  //render initial pagination
  paginationView.render(model.state.search);
};
//////////////////////////////
const controlServings = newServings => {
  model.updateServings(newServings);
  recipeView.render(model.state.recipe);
};
const controlAddBookmarks = () => {
  if (!model.state.recipe.bookmarked) {
    model.addBookmarks(model.state.recipe);
  } else {
    model.removeBookmarks(model.state.recipe.id);
  }
  // model.addBookmarks(model.state.recipe); //TEST
  console.log(model.state.recipe);
  recipeView.render(model.state.recipe);
  //Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async uploadedrecipe => {
  try {
    aaddRecipeView.renderSpinner();
    await model.uploadRecipe(uploadedrecipe);
    recipeView.render(model.state.recipe);
    recipeView.renderMessage();
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, 2000);
  } catch (err) {
    addRecipeView.renderError(err.message);
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, 2000);
  }
};

const init = () => {
  recipeView.addHandlerRedner(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagniation);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmarks);
  bookmarksView.addHandlerBookmark(controlBookmarks);
  addRecipeView.addHandlerShowWindow(controlAddRecipe);
  addRecipeView.addHandlerHideWindow(controlAddRecipe);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

import { async } from "regenerator-runtime";
import { updateServings } from "../../../18-forkify/starter/src/js/model";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    resultsPerPage: 10,
    page: 1,
  },
  bookmarks: [],
};

//Fetch data from API
export const loadRecipe = async id => {
  try {
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    );
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status}) `);
    console.log(data);
    let { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      ...(recipe.key && { key: recipe.key }),
    };
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
////////////////////////////////////////
export const loadSearchResaults = async query => {
  try {
    state.search.query = query;
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes?search=${query}`
    );
    const data = await res.json();
    state.search.results = data.data.recipes.map(el => {
      return {
        id: el.id,
        title: el.title,
        publisher: el.publisher,
        sourceUrl: el.source_url,
        image: el.image_url,
      };
    });
    state.search.page = 1;

    if (!res.ok) throw new Error(`${data.message} (${res.status}) `);
    console.log(data);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
////////////////////////////////////////
export const getSearchResultsPage = (page = state.search.page) => {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};
////////////////////////////////////////
export const updateServings = newServings => {
  state.recipe.ingredients.forEach(el => {
    el.quantity = (el.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};
///////////////////////////////////////
//Storing Bookmarks in local storage
const saveBookmarks = () => {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmarks = recipe => {
  //Add bookmark
  state.bookmarks.push(recipe);
  //mark cuurent recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  saveBookmarks();
};
//////////////////////////////////////
export const removeBookmarks = id => {
  //Remove bookmark
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);
  //mark cuurent recipe as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  saveBookmarks();
};
const init = () => {
  const storage = localStorage.getItem("bookmarks");
  if (!storage) return;
  state.bookmarks = JSON.parse(storage);
};
init();

export const uploadRecipe = async newRecipe => {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map(ing => {
        const ingArr = ing[1].split(",").map(el => el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            "Wrong ingredient fromat! Please use the correct format :)"
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(recipe);
    const api_key = " ad3a73de - d751 - 4695 - a024 - c43c175d503b";
    const res = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/?key=${api_key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipe),
      }
    );
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    const data = await res.json();
    console.log(data);
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    // addBookmarks(state.recipe);
  } catch (err) {
    throw err;
  }
};

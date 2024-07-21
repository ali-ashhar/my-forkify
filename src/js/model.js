import { API_URL, RES_PER_PAGE, API_KEY } from './config';
import { AJEX } from './helper';

export const state = {
  recipe: {},
  search: {
    quary: '',
    resault: [],
    page: 1,
    resaultPage: RES_PER_PAGE,
  },
  bookMarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
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
};

export const loadRecipe = async function (id) {
  try {
    //fetch data from api recipe
    const data = await AJEX(`${API_URL}${id}?key=${API_KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookMarks.some(bookmark => bookmark.id === id))
      state.recipe.bookMarked = true;
    else state.recipe.bookMarked = false;
  } catch (err) {
    // console.error(`${err} ✋✋✋`);
    throw `from load ${err} ✋✋✋`;
  }
};

export const loadSearchRecipe = async function (quary) {
  try {
    //fetch data from api search
    state.search.quary = quary;
    const data = await AJEX(`${API_URL}?search=${quary}&key=${API_KEY}`);
    state.search.resault = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    // console.error(`${err} ✋✋✋`);
    throw `from load search ${err} ✋✋✋`;
  }
};

export const loadSearchResaultPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resaultPage;
  const end = page * state.search.resaultPage;

  return state.search.resault.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

export const addbookMarks = function (recipe) {
  // add bookmark
  state.bookMarks.push(recipe);
  // mark current recipe
  if (recipe.id === state.recipe.id) state.recipe.bookMarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // delete bookmark
  const index = state.bookMarks.findIndex(el => el.id === id);
  state.bookMarks.splice(index, 1);
  // mark current recipe as NOT bookmarkrd
  if (id === state.recipe.id) state.recipe.bookMarked = false;

  persistBookmarks();
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookMarks));
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Worng format for ingredients! \n please try again with ,, format'
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

    const data = await AJEX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addbookMarks(state.recipe);
  } catch (err) {
    throw err;
  }
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookMarks = JSON.parse(storage);
};

init();

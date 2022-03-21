import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import paginationView from './views/paginationView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config.js';

const recipeContainer = document.querySelector('.recipe');
if (module.hot) {
    module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function() {
    try {
        const id = window.location.hash.slice(1);

        if (!id) return;
        //1. loading the recipe
        recipeView.renderSpinner();
        resultsView.update(model.getSearchResultsPage());

        await model.loadRecipe(id);
        // console.log(model.state.recipe);
        //2.rendering the recipe
        bookmarksView.render(model.state.bookmarks);
        recipeView.render(model.state.recipe);
    } catch (err) {
        recipeView.renderError();
    }
};
const controlSearchResults = async function() {
    try {
        model.state.search.page = 1;
        resultsView.renderSpinner();
        //1.Get search query
        const query = searchView.getQuery();
        if (!query) return;

        //2.Load search results
        await model.loadSearchResults(query);
        console.log(model.state.search.page);
        //resultsView.render(model.state.search.results);
        // console.log(model.getSearchResultsPage(1));
        resultsView.render(model.getSearchResultsPage());

        //render initial pagination buttons
        paginationView.render(model.state.search);
    } catch (err) {
        console.log(err);
    }
};
const controlPagination = function(goToPage) {
    //console.log('pag control');

    resultsView.render(model.getSearchResultsPage(goToPage));

    //render initial pagination buttons
    paginationView.render(model.state.search);
    // console.log(model.state.search.page);
};
const controlServings = function(newServings) {
    //update the recipe servings in state
    model.updateServings(newServings);
    //update the recipe view
    // recipeView.render(model.state.recipe);
    recipeView.update(model.state.recipe);
};

const controlAddBookmark = function() {
    //1. add or remove bookmarks
    if (!model.state.recipe.bookmarked) {
        model.addBookmark(model.state.recipe);
    } else {
        model.deleteBookmark(model.state.recipe.id);
    }
    //console.log(model.state.recipe);
    recipeView.update(model.state.recipe);

    bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function(newRecipe) {
    //console.log(newRecipe);
    addRecipeView.renderSpinner();
    try {
        await model.uploadRecipe(newRecipe);
        console.log(model.state.recipe);

        recipeView.render(model.state.recipe);
        bookmarksView.render(model.state.bookmarks);
        //success message
        addRecipeView.renderMessage();

        //change ID in URL
        window.history.pushState(null, '', `#${model.state.recipe.id}`);
        setTimeout(function() {
            addRecipeView.toggleWindow();
        }, MODAL_CLOSE_SEC * 1000);
        //addRecipeView.toggleWindow()
    } catch (err) {
        addRecipeView.renderError(err.message);
    }
};
const init = function() {
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
    addRecipeView.addHandlerUpload(controlAddRecipe);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
};
init();
//window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
bookmarksView.render(model.state.bookmarks);
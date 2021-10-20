var spoonacularKey = "b001ab9cdead48548a5c255abdff6adb";

var getFoodRecipes = function(searchedFood) {
    var apiURL = "https://api.spoonacular.com/recipes/complexSearch?query=" + searchedFood + "&addRecipeInformation=true&apiKey=" + spoonacularKey;
    console.log(apiURL);
    fetch(apiURL).then(function(response) {
        response.json().then(function(data) {
            console.log(data);
        });
    })
}

var getCocktailRecipes = function(searchedCocktail) {
    var apiURL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + searchedCocktail + "&apiKey=1";
    console.log(apiURL);
    fetch(apiURL).then(function(response) {
        response.json().then(function(data) {
            console.log(data);
        });
    })
}

var searchedFood = "Chicken";
var searchedCocktail = "Margarita";

getFoodRecipes(searchedFood);
getCocktailRecipes(searchedCocktail);
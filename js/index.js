// $("body").css("overflow","hidden")

$(document).ready(() => {
  search("s","").then(() => {
    $(".loading-screen").fadeOut(500)
    $("body").css("overflow", "auto")

  })
})

function hideSideBar() {
  let innerNavWidth = $(".innerNav").outerWidth()
  $(".sideBar").animate({ left: - innerNavWidth }, 700)

  $(".hide-show-icon").removeClass("fa-x");
  $(".hide-show-icon").addClass("fa-align-justify");

  for (let i = 0; i < 5; i++) {
    $(".links").eq(i).animate({ top: "400px" })
  }
}
hideSideBar()


function showSideBar() {
  $(".sideBar").animate({ left: 0 }, 500)

  $(".hide-show-icon").removeClass("fa-align-justify");
  $(".hide-show-icon").addClass("fa-x");

  for (let i = 0; i < 5; i++) {
    $(".links").eq(i).animate({ top: "0" }, (i + 5) * 100)
  }
}


$(".navIcon").click(() => {
  if ($(".sideBar").css("left") == "0px") {
    hideSideBar();
  } else {
    showSideBar();
  }
});

//............................................................................................................

$("#searchInputs").hide();

$("#search").click(() => {
  hideSideBar();
  $("#searchInputs").show();
  $(".api-data, #mealDetails").html("")
})

async function search(key, mealName) {
  let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?${key}=${mealName}`);
  let finalJson = await apiResponse.json();
  if (mealName){
    displayMeals(finalJson.meals)
  }
  else{
    displayMeals(finalJson.meals.slice(0,20)) 
  }
}



$("#searchByName").on("keyup", function () {
  hideSideBar();
  let term = $("#searchByName").val()
  search("s", term)
  console.log("Name");

});


$("#searchByFirstLetter").on("keyup", function () {
  hideSideBar();
  let term = $("#searchByFirstLetter").val()
  search("f", term)
  console.log("letter");
});

//............................................................................................................

function displayMeals(array) {
  let cartoona = "";

  for (let i = 0; i < array.length; i++) {
    cartoona += `
      <div class="mealCard col-md-3 p-3" onclick="displayMealInfo(${array[i].idMeal});">
        <div class="position-relative overflow-hidden rounded-3">
            <img class="w-100 " src="${array[i].strMealThumb}" alt="">
            <div class="overlay bg-light bg-opacity-50 d-flex justify-content-center align-items-center">
                <h2 class="text-black text-center p-2">${array[i].strMeal}</h2>
            </div>
        </div>
      </div>
      `
  }
  $(".api-data").html(cartoona)
}

//............................................................................................................



function getMealIngredient(array) {
  let lis = "";
  
  for (let i = 1; i < 21; i++) {
    
    if (array[0][`strIngredient${i}`]) {
      lis += `
      <li class="recipes p-2 rounded-3 m-2">${array[0][`strMeasure${i}`]} ${array[0][`strIngredient${i}`]}</li>
        `
    }

  }
  $(".recipesList").html(lis)
}


function getMealTags(array) {
  let lis = "";
  let tagsArr = array[0].strTags.split(",")
  for (let i = 0; i < tagsArr.length; i++) {
    
    if (array[0].strTags) {
      lis += `
      <li class="bg-danger-subtle p-2 rounded-3 m-2 text-danger">${tagsArr[i]}</li>
        `
    }

  }
  $(".tagList").html(lis)
}




function getMealInfo (array) {

  $("main").html(`
  <section id="mealDetails" class="container mt-5"></section>
  `)

  $("#mealDetails").html(`
  <div class="row text-light">
    <div class="col-md-4 rounded mealImg">
        <div class="rounded-4 overflow-hidden">
            <img src="${array[0].strMealThumb}" alt="" class="w-100">
        </div>
        <h2 class="text-center mt-3">${array[0].strMeal}</h2>
    </div>

    <div class="col-md-8">
        <div class="mealInfo">
            <h2>Instructions</h2>
            <p>${array[0].strInstructions}</p>
            <h2>Area : ${array[0].strArea}</h2>
            <h2>Category : ${array[0].strCategory}</h2>
        </div>
        <div>
            <h2 class="mb-3">Recipes :</h2>
            <ul class="list-unstyled d-flex g-3 flex-wrap recipesList"></ul>
        </div>
        <div>
            <h2 class="mb-3">Tags :</h2>
            <ul class="tagList list-unstyled d-flex g-3 flex-wrap"></ul>
        </div>
        <div class="mealSrc">
            <a href="${array[0].strSource}" class="btn btn-success px-3 ms-2" target="_blank">Source</a>
            <a href="${array[0].strYoutube}" class="btn btn-danger px-3 m-2" target="_blank">Youtube</a>
        </div>
    </div>
  </div>
`);

getMealTags(array);
getMealIngredient(array);

}

async function displayMealInfo(mealId) {
  let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
  let finalJson = await apiResponse.json();
  getMealInfo(finalJson.meals)
  
  $("#searchInputs").html("")
}

//............................................................................................................

$("#categories").click(function () { 
  $("#searchInputs, #mealDetails, .api-data").html("")
  hideSideBar();
  getCategories();
  
});

async function getCategories() {
  $("loading-screen").fadeIn(300)
  let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
  let finalJson = await apiResponse.json();
  displayCategories(finalJson.categories)
}



function displayCategories(array) {
  let cartoona = "";

  for (let i = 0; i < array.length; i++) {
    cartoona += `
      <div class="mealCard col-md-3 p-3" onclick="displayCategoryMeals('${array[i].strCategory}');">
        <div class="position-relative overflow-hidden rounded-3">
            <img class="w-100 " src="${array[i].strCategoryThumb}" alt="">
            <div class="overlay bg-light bg-opacity-50 d-flex justify-content-center align-items-center">
                <h2 class="text-black text-center p-2">${array[i].strCategory}</h2>
            </div>
        </div>
      </div>
      `
  }
  $(".api-data").html(cartoona)
}

async function displayCategoryMeals(strCategory) {
  let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${strCategory}`);
  let finalJson = await apiResponse.json();
  displayMeals(finalJson.meals)
}

//............................................................................................................
$("#area").click(function () { 
  $("#searchInputs, #mealDetails, .api-data").html("")
  hideSideBar();
  getArea();
  
});

async function getArea() {
  let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
  let finalJson = await apiResponse.json();
  console.log(finalJson.meals);
  displayArea(finalJson.meals)
}



function displayArea(array) {
  let cartoona = "";

  for (let i = 0; i < array.length; i++) {
    cartoona += `
    <div onclick=" displayAreaMeals('${array[i].strArea}')" class="rounded-2 text-center cursor-pointer col-md-3 text-light p-3">
    <i class="fa-solid fa-house-laptop fa-4x"></i>
    <h3>${array[i].strArea}</h3>
    </div>
      `
  }
  $(".api-data").html(cartoona)
}

async function displayAreaMeals(strArea) {
  let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${strArea}`);
  let finalJson = await apiResponse.json();
  displayMeals(finalJson.meals)
}


// async function getAreaMeals(area) {
//   rowData.innerHTML = ""
//   $(".inner-loading-screen").fadeIn(300)

//   let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
//   response = await response.json()


//   displayMeals(response.meals.slice(0, 20))
//   $(".inner-loading-screen").fadeOut(300)

// }
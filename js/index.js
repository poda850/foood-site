$("body").css("overflow","hidden")

$(document).ready(() => {
  hideSideBar()
  search("s","")
    $(".loading-screen").fadeOut(1000,function() {
      $(".loading-screen").remove()
    })

    $("body").css("overflow", "auto")

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

  let tags = array[0].strTags?.split(",")
  if (!tags) tags = []

  let tagsStr = ''
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
  }
   $(".tagList").html(tagsStr)
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

//............................................................................................................


$("#ingredients").click(function () { 

  $("#searchInputs, #mealDetails, .api-data").html("")
  hideSideBar();
  getIngredients();
  
});

async function getIngredients() {
  let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
  let finalJson = await apiResponse.json();
  console.log(finalJson.meals.slice(0, 20));
  displayIngredients(finalJson.meals.slice(0, 20))
}


function displayIngredients(array) {
  let cartoona = "";

  for (let i = 0; i < array.length; i++) {
    cartoona += `
    <div class="col-md-3">
      <div onclick="displayIngredientsMeal('${array[i].strIngredient}')" class="rounded-2 text-center cursor-pointer text-light">
              <i class="fa-solid fa-drumstick-bite fa-4x"></i>
              <h3>${array[i].strIngredient}</h3>
              <p>${array[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
      </div>
    </div>
      `
  }
  $(".api-data").html(cartoona)
}

async function displayIngredientsMeal(ingredients) {
  let apiResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`);
  let finalJson = await apiResponse.json();
  displayMeals(finalJson.meals)
}

//............................................................................................................
$("#contact").click(function () { 

  $("#searchInputs, #mealDetails, .api-data").html("")
  hideSideBar();
  showContacts();
  
});


function showContacts() {
  $("main").html(`<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `)
  submitBtn = document.getElementById("submitBtn")


  document.getElementById("nameInput").addEventListener("focus", () => {
    nameInputTouched = true
  })

  document.getElementById("emailInput").addEventListener("focus", () => {
    emailInputTouched = true
  })

  document.getElementById("phoneInput").addEventListener("focus", () => {
    phoneInputTouched = true
  })

  document.getElementById("ageInput").addEventListener("focus", () => {
    ageInputTouched = true
  })

  document.getElementById("passwordInput").addEventListener("focus", () => {
    passwordInputTouched = true
  })

  document.getElementById("repasswordInput").addEventListener("focus", () => {
    repasswordInputTouched = true
  })
}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;




function inputsValidation() {
  if (nameInputTouched) {
    if (nameValidation()) {
      document.getElementById("nameAlert").classList.replace("d-block", "d-none")

    } else {
      document.getElementById("nameAlert").classList.replace("d-none", "d-block")

    }
  }
  if (emailInputTouched) {

    if (emailValidation()) {
      document.getElementById("emailAlert").classList.replace("d-block", "d-none")
    } else {
      document.getElementById("emailAlert").classList.replace("d-none", "d-block")

    }
  }

  if (phoneInputTouched) {
    if (phoneValidation()) {
      document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
    } else {
      document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

    }
  }

  if (ageInputTouched) {
    if (ageValidation()) {
      document.getElementById("ageAlert").classList.replace("d-block", "d-none")
    } else {
      document.getElementById("ageAlert").classList.replace("d-none", "d-block")

    }
  }

  if (passwordInputTouched) {
    if (passwordValidation()) {
      document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
    } else {
      document.getElementById("passwordAlert").classList.replace("d-none", "d-block")

    }
  }
  if (repasswordInputTouched) {
    if (repasswordValidation()) {
      document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
    } else {
      document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")

    }
  }


  if (nameValidation() &&
    emailValidation() &&
    phoneValidation() &&
    ageValidation() &&
    passwordValidation() &&
    repasswordValidation()) {
    submitBtn.removeAttribute("disabled")
  } else {
    submitBtn.setAttribute("disabled", true)
  }
}

function nameValidation() {
  return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
}

function emailValidation() {
  return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
}

function phoneValidation() {
  return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
}

function ageValidation() {
  return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
}

function passwordValidation() {
  return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
}

function repasswordValidation() {
  return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}
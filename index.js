document.addEventListener("DOMContentLoaded", () => {
  const burgerMenuDiv = document.getElementById('burger-menu');
  const orderList = document.getElementById('order-list');
  const newBurgerForm = document.getElementById('custom-burger');
  const burgerName = document.getElementById('burger-name');
  const burgerDescription = document.getElementById('burger-description');
  const burgerImage = document.getElementById('burger-image');
  const editForm = document.getElementById('edit-burger')
  const editBurgerName = document.getElementById('edit-burger-name');
  const editBurgerDescription = document.getElementById('edit-burger-description');
  const editBurgerImage = document.getElementById('edit-burger-image');
  const editFormSubmitButton = document.getElementById('submit-button-on-edit-form');

  // fetch all burgers, change to json, return good data and call render
  function getAllBurgers() {
    fetch('http://localhost:3000/burgers')
    .then(function(badBurgerData) {
      return badBurgerData.json()
    }).then(function(jsonBurgers) {
      renderAllBurgers(jsonBurgers)
    })
  }

  // use json burgers to get all, create HTML for each burger
  function renderAllBurgers(jsonBurgers) {
    burgerMenuDiv.innerHTML = ''
    jsonBurgers.forEach(burger => {
      burgerMenuDiv.innerHTML += `
      <div class="burger" id=${burger.id}>
        <h3 class="burger_title" id=${burger.id}>${burger.name}</h3>
          <img src=${burger.image}>
          <p class="burger_description">
            What a Good Burger!
          </p>
          <button class="button" data-id=${burger.id}>Add to Order</button>
          <button class="button" data-id=${burger.id}>Edit Burger</button>
          <button class="button" data-id=${burger.id}>Remove From Menu</button>
      </div>
      `
    })
  }

  // add event listener to the menu div and append burger name to order list
  // first find the id (based on the specific button clicked)
  // then find the div with that id
  // then find the burger name within that div
  burgerMenuDiv.addEventListener('click', function(e) {
    if (e.target.innerText === 'Add to Order') {
      let wantedId = parseInt(e.target.dataset.id)
      let wantedDiv = document.getElementById(`${wantedId}`)
      let wantedBurgerName = wantedDiv.firstChild.nextSibling.innerText
      orderList.innerHTML += `
      <li>${wantedBurgerName}</li>
      `
    } else if (e.target.innerText === 'Remove From Menu') {
      let wantedId = parseInt(e.target.dataset.id)
      deleteThisBurga(wantedId)
    } else if (e.target.innerText === 'Edit Burger') {
      let wantedId = parseInt(e.target.dataset.id)
      let wantedDiv = document.getElementById(`${wantedId}`)
      let wantedBurgerName = wantedDiv.firstChild.nextSibling.innerText
      let wantedBurgerDescription = wantedDiv.firstChild.nextSibling.nextElementSibling.nextElementSibling.innerText
      let wantedBurgerImage = wantedDiv.firstChild.nextSibling.nextElementSibling.src
      editBurgerName.value = wantedBurgerName
      editBurgerDescription.value = wantedBurgerDescription
      editBurgerImage.value = wantedBurgerImage
      // editThisBurga(wantedId)
      editForm.addEventListener('submit', (e)=> {
        e.preventDefault()
        // editThisBurga(wantedId)
        fetch(`http://localhost:3000/burgers/${wantedId}`, {
          method: 'PATCH',
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({name: editBurgerName.value, description: editBurgerDescription.value, url: editBurgerImage.value})
        }).then(getAllBurgers)
      })
    }
  })

  // add event listener to new burger form
  newBurgerForm.addEventListener('submit', (e) => {
    e.preventDefault()
    fetch('http://localhost:3000/burgers', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({name: burgerName.value, description: burgerDescription.value, url: burgerImage.value})
      }).then(function(resp) {
        return resp.json()
      }).then(function(jsonData) {
        console.log(jsonData)
      }).then(getAllBurgers)
  })

  // delete fetch request
  // this is called when the delete button is clicked
  function deleteThisBurga(wantedId) {
    fetch(`http://localhost:3000/burgers/${wantedId}`, {
      method: 'DELETE'
    }).then(getAllBurgers)
  }

  // patch fetch request
  // this is called when the edit button is clicked
  // function editThisBurga(wantedId) {
    // console.log('in edit')
    // debugger
    // fetch(`http://localhost:3000/burgers/${wantedId}`, {
    //   method: 'DELETE'
    // }).then(getAllBurgers)
  // }

  getAllBurgers()

})

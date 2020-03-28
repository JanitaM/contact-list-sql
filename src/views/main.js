// Variables
const submitBtn = document.getElementById("submit-btn"),
  contactList = document.getElementById("contact-list"),
  search = document.getElementById("search"),
  name = document.getElementById("name"),
  phone = document.getElementById("phone"),
  email = document.getElementById("email"),
  editBtn = document.querySelector(".edit-btn"),
  findAndUpdateBtn = document.getElementById("find-btn"),
  updateContainer = document.getElementById("update-container"),
  currentName = document.querySelector(".current-name"),
  currentPhone = document.querySelector(".current-phone"),
  currentEmail = document.querySelector(".current-email"),
  newName = document.getElementById("new-name"),
  newPhone = document.getElementById("new-phone"),
  newEmail = document.getElementById("new-email"),
  updateBtn = document.getElementById("update-btn"),
  cancelBtn = document.getElementById("cancel-btn"),
  addContactBtn = document.getElementById("add-contact-btn"),
  logOutBtn = document.getElementById("log-out-btn");

// Load all event listeners 
loadEventListeners();

function loadEventListeners() {
  // Display Contacts In Database
  document.addEventListener('DOMContentLoaded', getAllDatabaseContacts);
  // Add Contact Event
  submitBtn.addEventListener("click", addContact);
  // Delete Event (Target Contact List)
  contactList.addEventListener("click", deleteContact);
  // Search Contacts (UI) Event
  search.addEventListener("keyup", filterContacts);
  // Search Contacts (Database) Event
  findAndUpdateBtn.addEventListener("click", getOneContactName);
  // Save New Contact Info
  updateBtn.addEventListener("click", compareAndUpdateContactInfo);
  // Cancel Update
  cancelBtn.addEventListener("click", cancelUpdate);
  // Show Add Contact Container
  addContactBtn.addEventListener("click", showContactContainer);
  // Fetch Logged Out HTML Page
  logOutBtn.addEventListener("click", logOut);
}

// Class Constructor
// Contact List
class Contact {
  constructor(name, phone, email) {
    this.name = name;
    this.phone = phone;
    this.email = email;
  }
}

// Functions
// This is loading on all pages...
function getAllDatabaseContacts() {
  fetch("http://localhost:3000/contacts")
    .then(response => response.json())
    .then(displayDataOnUI)
    .catch(error => console.log(error.message));
}

function displayDataOnUI(contact) {
  for (let person in contact) {
    listItem = document.createElement('tr');
    listItem.className = "list-item";
    listItem.innerHTML = `
    <td class="data-value">${contact[person].name}</td>
    <td class="data-value">${contact[person].phone}</td>
    <td class="data-value">${contact[person].email}</td>
    <td><button class="delete-btn">Delete</button></td>
  `;
    contactList.appendChild(listItem);
  }
}

function showContactContainer() {
  document.getElementById("contact-container").style.display = "block";
}

function addContact(e) {
  if (name.value === "" || phone.value === "" || email.value === "") {
    alertMessage("Please Enter All Values", "error");
  } else {
    // Instantiate and save to contact variable
    const contact = new Contact(name.value, phone.value, email.value.toLowerCase());

    addNewContactToUI(contact);
    addNewContactToDatabase(contact);
    clearInputs();
    alertMessage("Contact Added", "success");
    document.getElementById("contact-container").style.display = "none";
  }

  e.preventDefault();
}

const addNewContactToUI = (contact) => {
  listItem = document.createElement('tr');
  listItem.className = "list-item";
  listItem.innerHTML = `
  <td class="data-value">${contact.name}</td>
  <td class="data-value">${contact.phone}</td>
  <td class="data-value">${contact.email}</td>
  <td><button class="delete-btn">Delete</button></td>
`;
  contactList.appendChild(listItem);
}

const clearInputs = () => {
  name.value = "";
  phone.value = "";
  email.value = "";
  newName.value = "";
  newPhone.value = "";
  newEmail.value = "";
}

function addNewContactToDatabase(contact) {
  fetch("http://localhost:3000/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contact)
  })
    .then(response => response.json())
    .then(contact => console.log("Contact Added", contact))
    .catch(error => console.log("Error", error));
}

function deleteContact(e) {
  if (e.target.className === "delete-btn") {
    let nameOfContactToDelete = e.target.parentElement.parentElement.firstChild.nextSibling.innerHTML;

    deleteContactFromDatabase(nameOfContactToDelete);

    e.target.parentElement.parentElement.remove();
    alertMessage("Contact Removed", "success");
  }

  e.preventDefault();
}

const deleteContactFromDatabase = contact => {
  fetch(`http://localhost:3000/contact?name=${contact}`, {
    method: "DELETE"
  })
    .then(response => response.json())
    .then(result => {
      console.log("Contact Deleted");
      return result;
    })
    .catch(error => console.log("Error", error));
}

function filterContacts(e) {
  const text = e.target.value.toLowerCase();
  document.querySelectorAll(".list-item").forEach(contact => {
    let item = contact.firstChild.nextSibling.innerHTML;
    // index.of returns -1 if it's NOT a match
    if (item.toLowerCase().indexOf(text) == -1) {
      // Hide it
      contact.style.display = "none";
    } else {
      // Show it
      contact.style.display = "table-row";
    }
  });
}

function getOneContactName(e) {
  let contact = search.value;
  if (contact === "") {
    alertMessage("Enter a name in database", "error");
  } else {
    getOneContactFromDatabase(contact);
  }

  e.preventDefault();
}

function getOneContactFromDatabase(contact) {
  fetch(`http://localhost:3000/contact?name=${contact}`, {
    method: "GET",
    redirect: "follow"
  })
    .then(response => response.json())
    .then(result => {
      updateContainer.style.display = "block";
      displayContactToUpdate(result);
    })
    .catch(error => {
      console.log("error", error.message);
      updateContainer.style.display = "none";
      alertMessage("Contact not found. Please confirm contact is in the contact list.", "error");
    });
}

function displayContactToUpdate(result) {
  currentName.innerHTML = result[0].name;
  currentPhone.innerHTML = result[0].phone;
  currentEmail.innerHTML = result[0].email;
}

function compareAndUpdateContactInfo() {
  if (newName.value === "" && newPhone.value === "" && newEmail.value === "") {
    alertMessage("Please enter at least one field.", "error");
    return;
  }

  let newValues = {};

  if (currentName.innerHTML !== newName.value && newName.value !== "" && newName.value !== null && newName.value !== undefined) {
    newValues.name = newName.value;
  }

  if (currentPhone.innerHTML !== newPhone.value && newPhone.value !== "" && newPhone.value !== null && newPhone.value !== undefined) {
    newValues.phone = newPhone.value;
  }

  if (currentEmail.innerHTML !== newEmail.value && newEmail.value !== "" && newEmail.value !== null && newEmail.value !== undefined) {
    newValues.email = newEmail.value;
  }

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(newValues);

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(`http://localhost:3000/contact?name=${currentName.innerHTML}`, requestOptions)
    .then(response => response.text())
    .then(result => console.log('Contact Updated'))
    .catch(error => console.log('error', error));

  clearInputs();
  updateContainer.style.display = "none";
  location.reload();
}

function cancelUpdate() {
  location.reload();
}

const alertMessage = (message, className) => {
  alertDiv = document.createElement('div');
  alertDiv.className = `${className} .u-full-width`;
  alertDiv.innerHTML = `${message}`;
  const container = document.querySelector(".container");
  container.insertBefore(alertDiv, document.querySelector(`.message`));
  setTimeout(() => document.querySelector(`.${className}`).remove(), 2000);
}

function logOut() {
  var myHeaders = new Headers();

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch("http://localhost:3000/logout", requestOptions)
    .then(response => response.text())
    // .then(result => document.querySelector(".main-container").innerHTML = result)
    .then(result)
    .catch(error => console.log('error', error));
}


function signIn() {
  var myHeaders = new Headers();

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch("http://localhost:3000/signin", requestOptions)
    .then(response => response.text())
    // .then(result => document.querySelector(".main-container").innerHTML = result)
    .then(result)
    .catch(error => console.log('error', error));
}

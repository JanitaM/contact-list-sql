// const con = require("../../server"); //why doesn't this import??
const path = require("path");
const mysql = require("mysql2/promise");

const con = mysql.createPool({
  host: process.env.AWS_HOST,
  user: process.env.AWS_USER,
  password: process.env.AWS_PASSWORD
});

// GET ALL CONTACTS Request
const getAllContacts = async (request, response) => {
  try {
    console.log("GET ALL CONTACTS");
    const result = await con.query(`SELECT * FROM contactList.contacts`);
    let contactMap = {};
    result[0].map(contact => contactMap[contact.id] = contact);
    response.send(contactMap);
  } catch (error) {
    console.log(error);
    response.status(500).send(error.message);
  }
}

// GET ONE Request
const getContact = async (request, response) => {
  try {
    console.log("GET ONE CONTACT");
    const result = await con.query(`SELECT name, phone, email FROM contactList.contacts WHERE contacts.name='${request.query.name}'`);
    response.send(result[0]);
  } catch (error) {
    console.log(error);
    response.status(500).send(error.message);
  }
}

// POST Request
const postContact = async (request, response) => {
  try {
    console.log("POST CONTACT");
    const created = await con.query(`INSERT INTO contactList.contacts (name, phone, email) VALUES ('${request.body.name}', '${request.body.phone}', '${request.body.email}')`);
    response.send(created);
  } catch (error) {
    console.log(error);
    response.status(500).send(error.message);
  }
}

// PUT Request
const putContact = async (request, response) => {
  try {
    console.log("PUT CONTACT");
    let queryStart = `UPDATE contactList.contacts SET `
    let queryParams = "";
    let queryEnd = ` WHERE contacts.name='${request.query.name}'`

    if (request.body.name) {
      queryParams += `name='${request.body.name}'`;
    }
    if (request.body.name && request.body.phone) {
      queryParams = queryParams + `, phone='${request.body.phone}'`;
    } else if (!request.body.name && request.body.phone) {
      queryParams = queryParams + `phone='${request.body.phone}'`;
    }
    if (!request.body.email) {
      queryParams;
    } else if (request.body.name || request.body.phone && request.body.email) {
      queryParams = queryParams + `, email='${request.body.email}'`;
    } else if (!request.body.name && !request.body.phone && request.body.email) {
      queryParams = queryParams + `email='${request.body.email}'`;
    }

    const result = await con.query(`${queryStart}${queryParams}${queryEnd}`);
    response.send(result[0]);
  } catch (error) {
    console.log(error);
    response.status(500).send(error.message);
  }
}

// DELETE Request 
const deleteContact = async (request, response) => {
  try {
    console.log("DELETE CONTACT");
    const result = await con.query(`DELETE FROM contactList.contacts WHERE contacts.name='${request.query.name}'`);
    response.send(result[0]);
  } catch (error) {
    console.log(error);
    response.status(500).send(error.message);
  }
}

// GET logout.html
const getLogout = async (request, response) => {
  try {
    console.log("SEND LOG OUT PAGE");
    response.sendFile(path.join(__dirname + "/../views/logout.html"));
  } catch (error) {
    console.log(error);
    response.status(500).send(error.message);
  }
}

// GET signin.html
const getSignin = async (request, response) => {
  try {
    console.log("SEND SIGN IN PAGE");
    response.sendFile(path.join(__dirname, "/../views/signin.html"));
  } catch (error) {
    console.log(error);
    response.status(500).send(error.message);
  }
}

module.exports = { getAllContacts, getContact, postContact, putContact, deleteContact, getLogout, getSignin };
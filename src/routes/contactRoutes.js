const {
  getAllContacts,
  postContact,
  putContact,
  getContact,
  deleteContact,
  getLogout,
  getSignin
} = require("../controllers/contactController");

const routes = app => {
  app.route("/contacts")
    .get(getAllContacts);

  app.route("/contact")
    .post(postContact)
    .put(putContact)
    .get(getContact)
    .delete(deleteContact);

  app.route("/logout")
    .get(getLogout);

  app.route("/signin")
    .get(getSignin);
}

module.exports = { routes }
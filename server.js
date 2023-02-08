// load .env data into process.env
require("dotenv").config();

// Web server config
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const cookieparser = require("cookie-parser");

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cookieparser());

// Set the view engine to ejs
app.set("view engine", "ejs");

// Serve the ejs files from a "views" folder
app.set("views", path.join(__dirname, "views"));

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require("./routes/users-api");
const widgetApiRoutes = require("./routes/widgets-api");
const usersRoutes = require("./routes/users");
const itemsRoutes = require("./routes/items");
const favouritesRoutes = require("./routes/favourites");
const messagesRoutes = require("./routes/messages");
const adminRoutes = require("./routes/admin");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use("/api/users", userApiRoutes);
app.use("/api/widgets", widgetApiRoutes);
app.use("/users", usersRoutes);
// Note: mount other resources here, using the same pattern above
app.use("/items", itemsRoutes);
app.use("/favourites", favouritesRoutes);
app.use("/messages", messagesRoutes);
app.use("/admin", adminRoutes);

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  res.redirect("items");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

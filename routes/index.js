var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");
const journeyModel = require("../models/journey");
const userModel = require("../models/users");

var city = [
  "Paris",
  "Marseille",
  "Nantes",
  "Lyon",
  "Rennes",
  "Melun",
  "Bordeaux",
  "Lille",
];
var date = [
  "2018-11-20",
  "2018-11-21",
  "2018-11-22",
  "2018-11-23",
  "2018-11-24",
];

/* GET home page. */
router.get("/", (req, res, next) => res.render("index"));

router.post("/sign-up", async (req, res, next) => {
  req.session.email = req.body.email;
  req.session.password = req.body.password;
  req.session.name = req.body.name;
  req.session.firstName = req.body.firstName;

  let newClient = new userModel({
    name: req.body.name,
    firstName: req.body.firstName,
    email: req.body.email,
    password: req.body.password,
  });

  await newClient.save();
  res.render("index");
});

router.post("/sign-in", async (req, res, next) => {
  let client = await userModel.find({
    email: req.body.email,
    password: req.body.password,
  });
  for (let i = 0; i < client.length; i++) {
    client[i].email === req.body.email &&
    client[i].password === req.body.password
      ? res.redirect("/homepage")
      : res.render("index");
  }
  res.render("index");
});

router.get("/homepage", (req, res, next) => res.render("home"));

router.post("/homepage", async (req, res, next) => {
  req.session.date = req.body.date;
  req.session.departure = req.body.departure;
  req.session.arrival = req.body.arrival;

  let trajet = await journeyModel.find({
    departure: req.session.departure,
    arrival: req.session.arrival,
  });

  dateFormat = function (date) {
    let newDate = new Date(date);
    let dateFormated =
      newDate.getDate() +
      "/" +
      newDate.getMonth() +
      "/" +
      newDate.getFullYear();
    return dateFormated;
  };

  trajet.map((el) => {
    dateFormat(el.date) === dateFormat(req.session.date)
      ? res.redirect("/available")
      : res.redirect("/error");
  });
});

router.get("/available", async (req, res, next) => {
  let traj = await journeyModel.find({
    departure: req.session.departure,
    arrival: req.session.arrival,
  });
  res.render("available", { traj: traj });
});

router.get("/error", (req, res, next) => {
  res.render("errorpage");
});

router.get("/tickets", async (req, res, next) => {
  let id = req.query.pos;
  if (req.session.newTraj === undefined) {
    req.session.newTraj = [];
  }

  let traj = await journeyModel.findOne({ _id: id });
  req.session.newTraj.push(traj);
  res.render("tickets", { traj: req.session.newTraj });
});

router.get("/deconnection", (req, res, next) => {
  req.session.destroy();
  res.render("index");
});

// Remplissage de la base de donnée, une fois suffit
router.get("/save", async function (req, res, next) {
  // How many journeys we want
  var count = 300;

  // Save  ---------------------------------------------------
  for (var i = 0; i < count; i++) {
    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))];
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))];

    if (departureCity != arrivalCity) {
      var newUser = new journeyModel({
        departure: departureCity,
        arrival: arrivalCity,
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime: Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });

      await newUser.save();
    }
  }
  res.render("index");
});

// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.get("/result", function (req, res, next) {
  // Permet de savoir combien de trajets il y a par ville en base
  for (i = 0; i < city.length; i++) {
    journeyModel.find(
      { departure: city[i] }, //filtre

      function (err, journey) {
        console.log(
          `Nombre de trajets au départ de ${journey[0].departure} : `,
          journey.length
        );
      }
    );
  }
  res.render("index", { title: "Express" });
});

module.exports = router;

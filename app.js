require("dotenv").config();

const express = require("express");

const https = require("https");

const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  console.log(req.body.cityName);

  const query = req.body.cityName;

  const unit = "imperial";

  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&APPID=" +
    process.env.API_KEY +
    "&units=" +
    unit;

  https.get(url, function (response) {
    console.log(response.statusCode);

    response.on("data", function (data) {

      const weatherData = JSON.parse(data);

      const temp = weatherData.main.temp

      const weatherDescription = weatherData.weather[0].description

      const icon = weatherData.weather[0].icon

      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.write(
        "<h1>Success!</h1>"
        );

      res.write(
        "<h2>The weather in " + query + " is currently " + weatherDescription + ".</h2>"
      );

      res.write(
        "<h2>The temperature in " +
          query +
          " is " +
          temp +
          " degrees Fahrenheit.</h2>"
      );

      console.log(weatherDescription);

      console.log(temp);

      res.write("<img src=" + imageURL + ">");

      res.send();
    });
  });

  console.log("Post Received!");
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server is running on port 3000.");
});

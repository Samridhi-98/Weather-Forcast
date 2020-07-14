const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
const ejs = require("ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

var data = {
  temp:"-",
  weatherDescription:"-",
  imageURL:"stylesheets/icons/unknown.png",
  location:"_",
  country:""
};

app.get("/",function(req,res){
  res.render("main.ejs",{weather:data});
});

app.post("/",function(req,res)
{
    const query=req.body.cityName;
    const appid="7293d36ef861c22b6af25c4e9dfb4a38";
    const url="https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + appid +"&units=metric";
    https.get(url,function(response){
      console.log(response.statusCode);
    response.on("data",function(data){
        const weatherData=JSON.parse(data);
        data.temp=Math.floor(weatherData.main.temp);
        data.weatherDescription=weatherData.weather[0].description;
        data.location = weatherData.name;
        data.country = weatherData.sys.country;
        const icon = weatherData.weather[0].icon;
        data.imageURL="stylesheets/icons/"+ icon +".png";
        res.render("main.ejs",{weather:data});
      });
    });
});

app.listen(5000,function(){
  console.log("Server is running on port 5000.");
});

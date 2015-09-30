/**
 * An app that sends you notification every morning about the weather of that day. 
 * Created by Samman Bikram Thapa on one sitting listening to Under Pressure by Queen on repeat
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var Accel = require('ui/accel');

//apis
var cityName = 'WashingtonDC';
var URL = 'http://api.openweathermap.org/data/2.5/forecast?q=' + cityName;

//a splash window while loading
var splashScreen = new UI.Window();

//functions
var parse_feed = function(data, quantity){
  var forecasts = [];
  for (var i = 0; i < quantity; i++){
    var description = data.list[i].weather[0].main;
    description = description.charAt(0).toUpperCase() + description.substring(1);
    var time = data.list[i].dt_txt;
    time = time.substring(time.indexOf('-') + 1, time.indexOf(':') + 3);
    forecasts.push({
      title:description,
      subtitle:time
    });
  }
    return forecasts;
};

//something to show in the splash window
var splashText = new UI.Text({
  position : new Vector2(0,0),
  size : new Vector2(144,168),
  text : 'Downloading... \n Stopping Climate Change..',
  font : 'GOTHIC_28_BOLD',
  color : 'black',
  textOverFlow : 'wrap',
  textAlign : 'center',
  backgroundColor : 'white'
});

splashScreen.add(splashText);
splashScreen.show();

//now start downloading the contents
ajax (
{
  url : URL,
  type : 'json'
},
function(data){
  console.log('downloading data from content');
  var menuItems = parse_feed(data,10);
  var resultsMenu = new UI.Menu({
    sections : [{
      title: 'Current Forecasts',
      items: menuItems
    }]
  });
  //show the forecasts and hide the splash screen
  resultsMenu.show();
  splashScreen.hide();
  resultsMenu.on('select', function(e){
    //Get the forecast we pressed at
    var selected_forecast = data.list[e.itemIndex];
    
    //get the whole information of that selection
    var selected_content = selected_forecast.weather[0].description;
    
    //capitalize the content
    selected_content = selected_content.charAt(0).toUpperCase() + selected_content.substring(1);
    
      // Add temperature, pressure etc
    selected_content += '\nTemperature: ' + Math.round(selected_forecast.main.temp - 273.15) + '°C'  + 
      '\nPressure: ' + Math.round(selected_forecast.main.pressure) + ' mbar' +
      '\nWind: ' + Math.round(selected_forecast.wind.speed) + 
      ' mph, ' + Math.round(selected_forecast.wind.deg) + '°';
    
    //display it in a card
    var detailed_card = new UI.Card({
      title : e.item.subtitle,
      body : selected_content
    });
    
    //show
    console.log(Object.getOwnPropertyNames(e));
    detailed_card.show();
  });
},
function(error){
  console.log('downloading content failed');
  
});

























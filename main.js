
// Foursquare API Info
const clientId = '0S4EX1YNCM5SM5L2RFDSH1CSOS24RRGQEDQ5WAISRWOXPN4W';
const clientSecret = 'MMIQG3J3XLU5IAJR10E4WQR5EE5ZN0AED4WFDTGQPZZ4AMKN';
const url = 'https://api.foursquare.com/v2/venues/explore?near=';
const imgPrefix = 'https://igx.4sqi.net/img/general/150x200';

// APIXU Info
const apiKey = '4fa74bee97964ae5bd5192218170910';
const forecastUrl = 'http://api.apixu.com/v1/forecast.json?key=';

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4")];
const $weatherDivs = [$("#weather1"), $("#weather2"), $("#weather3"), $("#weather4")];
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// AJAX functions

async function getVenues() {
const city = $input.val();
const urlToFetch = url + city + '&venuePhotos=1&limit=10&client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20171010';
try {
let response = await fetch(urlToFetch);
if (response.ok){
let jsonResponse = await response.json();
let venues = jsonResponse.response.groups[0].items.map(location => location.venue);
return venues;
}
} catch(error){
console.log(error);
}
}

async function getForecast() {
try{
const urlToFetch = forecastUrl + apiKey + '&q=' + $input.val() + '&days=7&hour=11';
let response = await fetch(urlToFetch);
if(response.ok){
let jsonResponse = await response.json();
let days = jsonResponse.forecast.forecastday;
return days;
}
}catch(error){
console.log(error);
}  

}
// Render functions

function renderVenues(venues) {
  $venueDivs.forEach(($venue, index) => {
    let venueContent =
      '<h2>' + venues[index].name + '</h2>' +
      '<img class="venueimage" src="' + imgPrefix +
      venues[index].photos.groups[0].items[0].suffix + '"/>' +
      '<h3>Address:</h3>' +
      '<p>' + venues[index].location.address + '</p>' +
      '<p>' + venues[index].location.city + '</p>' +
      '<p>' + venues[index].location.country + '</p>';
    $venue.append(venueContent);
  });
  $destination.append('<h2>' + venues[0].location.city + '</h2>');
}
function renderForecast(days) {
  $weatherDivs.forEach(($day, index) => {
    let weatherContent =
      '<h2> High: ' + days[index].day.maxtemp_f + '</h2>' +
      '<h2> Low: ' + days[index].day.mintemp_f + '</h2>' +
      '<img src="http://' + days[index].hour[0].condition.icon +
      '" class="weathericon" />' +
      '<h2>' + weekDays[(new Date(days[index].date)).getDay()] + '</h2>';
    $day.append(weatherContent);
  });
}

function executeSearch() {
 getVenues().then(venues =>
 renderVenues(venues));

 getForecast().then(forecast =>
 renderForecast(forecast));


  $venueDivs.forEach(venue => venue.empty());
  $weatherDivs.forEach(day => day.empty());
  $destination.empty();
  $container.css("visibility", "visible");
  getVenues();
  getForecast();
  return false;
}

$submit.click(executeSearch);

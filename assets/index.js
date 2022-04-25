var dashboard = {
    city: 'None Selected',
    date: '0',
    temp: '0',
    wind: '0',
    humidity: '0',
    uvi: '0.00',
    forecast: []
}
const date = new Date();
const sdate = formated_date((date.getMonth() + 1), date.getDate(), date.getFullYear())

class Forecast {
    constructor(date, image, temp, wind, humidity) {
        this.date = date;
        this.image = image;
        this.temp = temp;
        this.wind = wind;
        this.humidity = humidity;
    }
}
const forecast_nums = 5;
var key = "2956ee54d654f63c0aed39642836317f";
var default_icon = "Clouds";

var icons = {
    "Clouds": "http://openweathermap.org/img/wn/02d@2x.png",
    "Clear": "http://openweathermap.org/img/wn/01d@2x.png",
    "Drizzle": "http://openweathermap.org/img/wn/09d@2x.png",
    "Snow": "http://openweathermap.org/img/wn/13d@2x.png",
    "Rain": "http://openweathermap.org/img/wn/10d@2x.png",
    "Thunderstorm": "http://openweathermap.org/img/wn/11d@2x.png"
}


const history_list = document.querySelector("#history-list");
const city_input = document.querySelector("#city-input");
const forecast_list = document.querySelector("#forecast-list");
const history_max = 8;

function init_weather_dashboard() {
    display_search_history();
    init_forecast();
    create_forecast_elements();
    set_forecast_elements();
    display_dashboard();
}
function formated_date(m, d, y) {
    return m + "/" + d + "/" + y;
}
function init_forecast() {
    for (let i = 0; i < forecast_nums; i++) {
        var forecast_card = new Forecast(sdate, default_icon, "0", "0", "0");
        dashboard.forecast.push(forecast_card);
    }
}
function set_forecast_data(card, date, image, temp, wind, humidity) {
    card.date = date;
    card.image = image;
    card.temp = temp;
    card.wind = wind;
    card.humidity = humidity;
}
function set_forecast_elements() {
    for (let i = 0; i < dashboard.forecast.length; i++) {
        document.querySelector("#date-sub-card_" + i).textContent = dashboard.forecast[i].date;
        let t = icons[dashboard.forecast[i].image]
        if (!t) {
            t = "http://openweathermap.org/img/wn/50d@2x.png" // Denotes bad or strange weather
        }
        document.querySelector("#icon-sub-card_" + i).src = icons[dashboard.forecast[i].image];
        document.querySelector("#temp-sub-card_" + i).textContent = "Temp: " + dashboard.forecast[i].temp + "°F";
        document.querySelector("#wind-sub-card_" + i).textContent = "Wind: " + dashboard.forecast[i].wind + " MPH";
        document.querySelector("#humidity-sub-card_" + i).textContent = "Humidity: " + dashboard.forecast[i].humidity + "%";
    }
}
function create_forecast_elements() {
    for (let i = 0; i < dashboard.forecast.length; i++) {
        var con_1 = document.createElement("div");
        con_1.classList.add("col-md-2")
        var con_2 = document.createElement("div");
        con_2.classList.add("bg-secondary","p-2", "forecast-card");
        var d = document.createElement("h6");
        var icon = document.createElement("img");
        var t = document.createElement("h6");
        var w = document.createElement("h6");
        var h = document.createElement("h6");
        d.classList.add("text-light");
        t.classList.add("text-light");
        w.classList.add("text-light");
        h.classList.add("text-light");
        
        d.setAttribute('id','date-sub-card_' + i);
        t.setAttribute('id','temp-sub-card_' + i);
        w.setAttribute('id','wind-sub-card_' + i);
        h.setAttribute('id','humidity-sub-card_' + i);
        icon.setAttribute('id','icon-sub-card_' + i);

        con_2.appendChild(d);
        con_2.appendChild(icon);
        con_2.appendChild(t);
        con_2.appendChild(w);
        con_2.appendChild(h);
        con_1.appendChild(con_2);
        forecast_list.appendChild(con_1);
    }
}
function display_dashboard() {
    dashboard.date = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
    document.querySelector("#city-main-card").textContent = 'City: ' + dashboard.city;
    document.querySelector("#date-main-card").textContent = 'Date: ' + dashboard.date;
    document.querySelector("#temp-main-card").textContent = 'Temp: ' + dashboard.temp + "°F";
    document.querySelector("#wind-main-card").textContent = 'Wind: ' + dashboard.wind + " MPH";
    document.querySelector("#humidity-main-card").textContent = 'Humidity: ' + dashboard.humidity + "%";
    document.querySelector("#uvi-main-card").textContent = '' + dashboard.uvi;
    if (dashboard.uvi > 7) {
        document.querySelector("#uvi-main-card").classList.add("btn-danger");
        document.querySelector("#uvi-main-card").classList.remove("btn-warning");
        document.querySelector("#uvi-main-card").classList.remove("btn-success");
    }
    else if (dashboard.uvi > 3) {
        document.querySelector("#uvi-main-card").classList.add("btn-warning");
        document.querySelector("#uvi-main-card").classList.remove("btn-danger");
        document.querySelector("#uvi-main-card").classList.remove("btn-success");
    }
    else {
        document.querySelector("#uvi-main-card").classList.add("btn-success");
        document.querySelector("#uvi-main-card").classList.remove("btn-danger");
        document.querySelector("#uvi-main-card").classList.remove("btn-warning");
    }
}
function delete_local_storage() {
    window.localStorage.clear();
}
function clear_element_children(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
function get_history_length() {
    let temp_history = window.localStorage.getItem('history');
    if (!temp_history) {
        return 0;
    }
    temp_history = JSON.parse(temp_history);
    return temp_history.length;
}
function display_search_history() {
    let temp_history = window.localStorage.getItem('history');
    if (!temp_history) {
        return;
    }
    clear_element_children(history_list);
    temp_history = JSON.parse(temp_history);
    for (let i = 0; i < temp_history.length; i++) {
        let history_entry = document.createElement("button");
        history_entry.innerHTML = temp_history[i];
        history_entry.classList.add('btn', 'btn-secondary', 'col-md-12', 'mt-3');
        history_entry.addEventListener('click', (e)=>{
            display_all_weather(temp_history[i])
        })
        history_list.appendChild(history_entry);
    }
}
function add_history(city) {
    let temp_history = window.localStorage.getItem('history');
    if (temp_history) {
        temp_history = JSON.parse(temp_history);
    }
    else {
        temp_history = [];
    }
    if (get_history_length() >= history_max) {
        temp_history.pop();
    }
    temp_history.unshift(city);
    window.localStorage.setItem('history', JSON.stringify(temp_history));
}

// Need explanation for this function.
function display_all_weather(city) {
    let limit = 1;
    let url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${key}`
    fetch(url)
    .then(resp => {
        if (!resp.ok) {
            throw new Error(resp.statusText);
        }
        return resp.json();
    })
    .then(data => {
        var lat = data[0].lat;
        var lon = data[0].lon;
        return {lat, lon}
    })
    .then(coords => {
        let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&appid=${key}`
        return fetch(url);
    })
    .then(resp => {
        if (!resp.ok) {
            throw new Error(resp.statusText);
        }
        return resp.json();
    })
    .then(data => {
        // Main Dashboard variables
        console.log(data);
        dashboard.city = city;
        dashboard.temp = data.current.temp;
        dashboard.wind = data.current.wind_speed;
        dashboard.humidity = data.current.humidity;
        dashboard.uvi = data.current.uvi;
        // Other Days
        for (let i = 0; i < dashboard.forecast.length; i++) {
            let future_date = formated_date((date.getMonth() + 1), date.getDate() + 1 + i, date.getFullYear()); // Will cause error in future with later dates
            let weather = data.daily[i].weather[0].main;
            console.log(weather);
            set_forecast_data(dashboard.forecast[i], future_date, weather, data.daily[i].temp.day, data.daily[i].wind_speed, data.daily[i].humidity);
        }
        set_forecast_elements();
        display_dashboard();
    })
    .catch(console.err)
}
function onclick_search() {
    let city = city_input.value;
    add_history(city);
    display_search_history();
    display_all_weather(city);
}
function onclick_delete_history() {
    delete_local_storage();
    clear_element_children(history_list);
}
init_weather_dashboard();
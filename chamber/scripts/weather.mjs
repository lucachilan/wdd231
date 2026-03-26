const myKey = "e800d872d9a44405e8b7c45f6f5c0f4c";
const myLat = "-30.90";
const myLon = "-55.54";
let units = "metric";
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLon}&units=${units}&appid=${myKey}`;
const forecasturl = `https://api.openweathermap.org/data/2.5/forecast?lat=${myLat}&lon=${myLon}&units=${units}&appid=${myKey}`;

const weatherIcon = document.querySelector('#weather-icon');
const currentTemp = document.querySelector('#current-temp');
const description = document.querySelector('#weather-description');
const highTemp = document.querySelector('#high-temp');
const lowTemp = document.querySelector('#low-temp');
const humidity = document.querySelector('#humidity');
const sunrise = document.querySelector('#sunrise');
const sunset = document.querySelector('#sunset');

export async function apiFetch(type = "current") {
    try {
        const requestUrl = type === "forecast" ? forecasturl : url;

        const response = await fetch(requestUrl);

        if (!response.ok) {
            throw Error(await response.text());
        }

        const data = await response.json();
        console.log(data);

        if (type === "forecast") {
            displayForecast(data);
        } else {
            displayCurrent(data);
        }

    } catch (error) {
        console.log(error);
    }
}

function displayCurrent(data) {
    currentTemp.innerHTML = `${data.main.temp}&deg;C`;
    description.innerHTML = data.weather[0].description;
    highTemp.innerHTML = `High: ${data.main.temp_max}&deg;C`;
    lowTemp.innerHTML = `Low: ${data.main.temp_min}&deg;C`;
    humidity.innerHTML = `Humidity: ${data.main.humidity}%`;
    const sunriseDate = new Date(data.sys.sunrise * 1000);
    sunrise.innerHTML = `Sunrise: ${sunriseDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    const sunsetDate = new Date(data.sys.sunset * 1000);
    sunset.innerHTML = `Sunset: ${sunsetDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;

    const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.setAttribute('src', iconsrc);
    weatherIcon.setAttribute('alt', data.weather[0].description);
}

// now it is with forecast
const today = document.querySelector("#today");
const tomorrow = document.querySelector("#tomorrow");
const twoDays = document.querySelector("#twodays");

// export async function apiFetchForecast() {
//     try {
//         const response = await fetch(forecasturl);
//         if (response.ok) {
//             const data = await response.json();
//             console.log(data);
//             displayForecast(data);
//         } else {
//             throw Error(await response.text());
//         }
//     } catch (error) {
//         console.log(error);
//     }
// }

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function displayForecast(data) {
    today.innerHTML = `Today: ${data.list[3].main.temp}&deg;C`;

    const tomorrowDate = new Date(data.list[11].dt_txt);
    const tomorrowDayName = daysOfWeek[tomorrowDate.getDay()];
    tomorrow.innerHTML = `${tomorrowDayName}: ${data.list[11].main.temp}&deg;C`;

    const twoDaysDate = new Date(data.list[19].dt_txt);
    const twoDaysDayName = daysOfWeek[twoDaysDate.getDay()];
    twoDays.innerHTML = `${twoDaysDayName}: ${data.list[19].main.temp}&deg;C`;
}
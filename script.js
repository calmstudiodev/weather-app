const apiKey = "ef6893cff61ed83287b1fc895bd3c031";

const locationInput = document.getElementById("locationInput");
const searchButton = document.getElementById("searchButton");


const locationElement = document.getElementById("location");
const countryElement = document.getElementById("country");
const temperatureElement = document.getElementById("temperature");
const descriptionElement = document.getElementById("description");
const dateTimeElement = document.getElementById("dateTime");
const humidityElement = document.getElementById("humidity");
const windElement = document.getElementById("wind");
const visibilityElement = document.getElementById("visibility");
const pressureElement = document.getElementById("pressure");
const sunriseElement = document.getElementById("sunrise");
const sunsetElement = document.getElementById("sunset");
const tempMaxElement = document.getElementById("tempMax");
const tempMinElement = document.getElementById("tempMin");
const weatherIcon = document.getElementById("weatherIcon");
const feelsLikeElement = document.getElementById("feelsLike");
const weatherInfo = document.querySelector(".weather-info");


searchButton.addEventListener("click", () => {
    const location = locationInput.value.trim();

    if (location === "") {
        return;
    }

    fetchWeather(location);
    locationInput.value = "";
});

locationInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchButton.click();
    }
});

function fetchWeather(location) {
    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("City not found");
            }

            return response.json();
        })

        .then(data => {
            const cityTime = new Date(
                Date.now() + data.timezone * 1000
            );

            dateTimeElement.textContent =
                cityTime.toLocaleTimeString("tr-TR", {
                    timeZone: "UTC",
                    hour: "2-digit",
                    minute: "2-digit"
                });

            const regionNames = new Intl.DisplayNames(["en"], {
                type: "region",
            });

            locationElement.textContent = data.name;



            countryElement.textContent = regionNames.of(data.sys.country);

            temperatureElement.textContent =
                `${Math.round(data.main.temp)}°C`;

            feelsLikeElement.textContent = `Feels Like ${Math.round(data.main.feels_like)}°C`;

            descriptionElement.textContent =
                data.weather[0].description;

            humidityElement.textContent =
                data.main.humidity + "%";

            windElement.textContent =
                Math.round(data.wind.speed * 3.6) + " km/h";

            pressureElement.textContent = data.main.pressure + "hPa";
            visibilityElement.textContent = Math.round(data.visibility / 1000) + " km";

            tempMaxElement.textContent = Math.round(data.main.temp_max) + "°C";
            tempMinElement.textContent = Math.round(data.main.temp_min) + "°C";

            const sunrise = new Date((data.sys.sunrise + data.timezone) * 1000);

            sunriseElement.textContent = sunrise.toLocaleTimeString("tr-TR", {
                timeZone: "UTC",
                hour: "2-digit",
                minute: "2-digit"
            });

            const sunset = new Date((data.sys.sunset + data.timezone) * 1000);

            sunsetElement.textContent = sunset.toLocaleTimeString("tr-TR", {
                timeZone: "UTC",
                hour: "2-digit",
                minute: "2-digit"
            });

            weatherInfo.style.display = "block";
            weatherIcon.style.display = "block";



            weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            weatherIcon.alt = data.weather[0].description;


            const weather = data.weather[0].main;

            if (weather === "Clear") {
                setBackground("clear-bg.png");
            }

            else if (weather === "Clouds") {
                setBackground("cloud-bg.png");
            }

            else if (weather === "Rain" || weather === "Drizzle") {
                setBackground("rain-bg.png");
            }

            else if (weather === "Thunderstorm") {
                setBackground("storm-bg.png");
            }

            else if (weather === "Snow") {
                setBackground("snow-bg.png");
            }
        })

        .catch(error => {
            locationElement.textContent = "City not found";
            temperatureElement.textContent = "";
            descriptionElement.textContent = "";
            dateTimeElement.textContent = "";
            humidityElement.textContent = "";
            windElement.textContent = "";
            feelsLikeElement.textContent = "";

            weatherIcon.style.display = "none";
            weatherInfo.style.display = "block";

            console.log(error);
        });
}

function setBackground(imageName) {
    document.body.style.backgroundImage =
        `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.55)), url('${imageName}')`;

    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
}



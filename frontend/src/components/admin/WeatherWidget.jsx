import React, { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslations } from "../../translations";
import axios from "axios";

const WeatherWidget = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState("Casablanca");
  const [forecastData, setForecastData] = useState(null);
  const [loadingForecast, setLoadingForecast] = useState(false);

  // Define coordinates for major Moroccan cities
  const CITY_COORDINATES = {
    Casablanca: { lat: 33.5731, lon: -7.5898 },
    Rabat: { lat: 34.0209, lon: -6.8416 },
    Marrakech: { lat: 31.6295, lon: -7.9811 },
    Mohammedia: { lat: 33.6835, lon: -7.3838 },
    Tangier: { lat: 35.7595, lon: -5.834 },
    Agadir: { lat: 30.4278, lon: -9.5981 },
  };

  // OpenWeather API Key
  const API_KEY = "6d52c635cf193e4c82b454030b179666";

  // Helper function to determine driving conditions based on weather
  const getDrivingConditionsFromWeather = (weatherData) => {
    const conditions = {
      status: "good",
      message: "Good driving conditions",
      recommendations: [
        "Maintain normal safe driving practices",
        "Ensure your vehicle is in good condition",
      ],
    };

    // Check for rain or snow
    if (weatherData.weather && weatherData.weather[0]) {
      if (weatherData.weather[0].main === "Rain") {
        conditions.status = "moderate";
        conditions.message = "Wet roads, drive with caution";
        conditions.recommendations = [
          "Reduce speed on wet roads",
          "Maintain longer following distance",
          "Turn on headlights for better visibility",
          "Avoid sudden braking or acceleration",
        ];
      } else if (weatherData.weather[0].main === "Snow") {
        conditions.status = "poor";
        conditions.message = "Snowy conditions, drive carefully";
        conditions.recommendations = [
          "Use winter tires if available",
          "Avoid sudden acceleration or braking",
          "Keep extra distance from other vehicles",
          "Clear all snow from your car before driving",
        ];
      } else if (weatherData.weather[0].main === "Clouds") {
        if (
          weatherData.weather[0].description.includes("broken") ||
          weatherData.weather[0].description.includes("overcast") ||
          weatherData.weather[0].description.includes("scattered")
        ) {
          conditions.recommendations = [
            "No special precautions needed for cloudy conditions",
            "Be prepared for possible changes in weather",
            "Consider having sunglasses available for sun breaks",
          ];
        }
      } else if (weatherData.weather[0].main === "Clear") {
        conditions.recommendations = [
          "Wear sunglasses to protect from glare",
          "Be aware of potential overheating in hot weather",
          "Check air conditioning before long trips",
        ];
      } else if (
        weatherData.weather[0].main === "Mist" ||
        weatherData.weather[0].main === "Fog" ||
        weatherData.weather[0].main === "Haze"
      ) {
        conditions.status = "moderate";
        conditions.message = "Reduced visibility, drive with caution";
        conditions.recommendations = [
          "Use fog lights if available",
          "Reduce speed and increase following distance",
          "Avoid using high beam headlights",
          "Use road markings as guidance",
        ];
      }
    }

    // Check for strong winds
    if (weatherData.wind_speed > 10) {
      conditions.status = "moderate";
      conditions.message = "Strong winds, drive with caution";
      conditions.recommendations = [
        "Grip steering wheel firmly",
        "Be cautious of side winds on open roads",
        "Reduce speed, especially on bridges",
        "Maintain extra distance from high-profile vehicles",
      ];
    }

    // Check for extreme temperatures
    if (weatherData.temp > 35) {
      conditions.status = "moderate";
      conditions.message = "Very hot weather, check vehicle cooling";
      conditions.recommendations = [
        "Ensure air conditioning is working",
        "Check coolant levels before long trips",
        "Park in shade when possible",
        "Carry water for hydration",
      ];
    } else if (weatherData.temp < 5) {
      conditions.status = "moderate";
      conditions.message = "Cold weather, check vehicle heating";
      conditions.recommendations = [
        "Allow engine to warm up properly",
        "Check tire pressure in cold weather",
        "Be prepared for icy patches on roads",
        "Carry warm clothing or blankets",
      ];
    }

    // Check for extreme conditions
    if (
      weatherData.weather &&
      weatherData.weather[0] &&
      ["Thunderstorm", "Tornado"].includes(weatherData.weather[0].main)
    ) {
      conditions.status = "poor";
      conditions.message = "Dangerous driving conditions";
      conditions.recommendations = [
        "Avoid unnecessary travel",
        "If driving is essential, proceed with extreme caution",
        "Be aware of potential flooding on roads",
        "Watch for fallen debris or downed power lines",
      ];
    }

    return conditions;
  };

  // Fetch weather data for major cities directly from OpenWeather API
  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const weatherData = {};

      // Process each city
      await Promise.all(
        Object.entries(CITY_COORDINATES).map(async ([cityName, coords]) => {
          try {
            // Use the standard weather API endpoint
            const currentResponse = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather`,
              {
                params: {
                  lat: coords.lat,
                  lon: coords.lon,
                  appid: API_KEY,
                  units: "metric",
                },
              },
            );

            const currentData = currentResponse.data;

            // Fetch 5-day forecast separately
            const forecastResponse = await axios.get(
              `https://api.openweathermap.org/data/2.5/forecast`,
              {
                params: {
                  lat: coords.lat,
                  lon: coords.lon,
                  appid: API_KEY,
                  units: "metric",
                },
              },
            );

            // Process forecast data to get one entry per day
            const forecastData = forecastResponse.data;
            const daily = [];
            const processedDates = new Set();

            for (const item of forecastData.list) {
              const date = item.dt_txt.split(" ")[0];
              if (!processedDates.has(date) && daily.length < 5) {
                processedDates.add(date);
                daily.push({
                  dt: item.dt,
                  temp: { day: item.main.temp },
                  weather: item.weather,
                  wind_speed: item.wind.speed,
                  humidity: item.main.humidity,
                });
              }
            }

            weatherData[cityName] = {
              location: cityName,
              temp: currentData.main.temp,
              feels_like: currentData.main.feels_like,
              description: currentData.weather[0].description,
              icon: currentData.weather[0].icon,
              wind_speed: currentData.wind.speed,
              humidity: currentData.main.humidity,
              updated_at: new Date().toISOString(),
              driving_conditions: getDrivingConditionsFromWeather({
                temp: currentData.main.temp,
                wind_speed: currentData.wind.speed,
                weather: currentData.weather,
              }),
              daily: daily,
            };
          } catch (error) {
            console.error(
              `Error fetching data for ${cityName}:`,
              error.message,
            );
          }
        }),
      );

      setWeatherData(weatherData);
      setError(null);

      // If a city is selected, update its forecast
      if (selectedCity && weatherData[selectedCity]) {
        prepareForecastData(selectedCity, weatherData);
      } else if (Object.keys(weatherData).length > 0) {
        // If the selected city doesn't have data but we have data for other cities,
        // select the first available city
        const firstCity = Object.keys(weatherData)[0];
        if (firstCity) {
          setSelectedCity(firstCity);
          prepareForecastData(firstCity, weatherData);
        }
      }

      // If we didn't get any data at all, show an error
      if (Object.keys(weatherData).length === 0) {
        setError(
          "Unable to fetch weather data. Please check your API key and try again.",
        );
      }
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError("Error fetching weather data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Prepare forecast data from the weather data
  const prepareForecastData = (city, data = null) => {
    const cityData = data ? data[city] : weatherData[city];
    if (!cityData || !cityData.daily) return;

    try {
      setLoadingForecast(true);

      // Format the daily forecast data
      const dailyForecasts = cityData.daily.map((day) => ({
        date: new Date(day.dt * 1000).toISOString().split("T")[0],
        temp: typeof day.temp === "object" ? day.temp.day : day.temp,
        description: day.weather[0].description,
        icon: day.weather[0].icon,
        wind_speed: day.wind_speed,
        humidity: day.humidity,
        driving_conditions: getDrivingConditionsFromWeather({
          temp: typeof day.temp === "object" ? day.temp.day : day.temp,
          wind_speed: day.wind_speed,
          weather: day.weather,
        }),
      }));

      setForecastData(dailyForecasts);
    } catch (err) {
      console.error("Error processing forecast data:", err);
    } finally {
      setLoadingForecast(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchWeatherData();
  }, []);

  // When selected city changes, update forecast
  useEffect(() => {
    if (selectedCity && weatherData && weatherData[selectedCity]) {
      prepareForecastData(selectedCity);
    }
  }, [selectedCity, weatherData]);

  // Get weather icon URL
  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // Get status color based on driving condition status
  const getStatusColor = (status) => {
    switch (status) {
      case "good":
        return "text-green-400";
      case "moderate":
        return "text-yellow-400";
      case "poor":
        return "text-red-400";
      default:
        return "text-cyan-400";
    }
  };

  // Select a city to show forecast
  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  // Render a city weather card with more compact layout
  const renderCityCard = (city) => {
    if (!weatherData || !weatherData[city]) return null;

    const cityData = weatherData[city];
    const isSelected = selectedCity === city;

    return (
      <div
        key={city}
        className={`bg-black/40 rounded-lg p-3 border transition-all duration-300 cursor-pointer ${
          isSelected
            ? "border-cyan-500/50 shadow-lg shadow-cyan-500/10"
            : "border-cyan-900/30 hover:border-cyan-500/30"
        }`}
        onClick={() => handleCitySelect(city)}
      >
        <div className="flex justify-between items-center border-b border-cyan-900/20 pb-1 mb-1.5">
          <h3 className="font-medium text-white text-sm">{city}</h3>
          <div className="text-base font-semibold">
            {cityData.temp.toFixed(1)}°C
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-gray-400 text-xs max-w-[60%]">
            <div className="mb-0.5 text-[13px]">
              {t("feels")}: {cityData.feels_like.toFixed(1)}°C
            </div>
            <div className="mb-0.5 text-[13px]">
              {t("humidity")}: {cityData.humidity}%
            </div>
            <div className="text-[13px]">
              {t("wind")}: {cityData.wind_speed} {t("msUnit")}
            </div>
          </div>

          <div className="flex flex-col items-center w-14">
            {cityData.icon && (
              <img
                src={getWeatherIconUrl(cityData.icon)}
                alt={cityData.description}
                className="w-10 h-10"
              />
            )}
            <p className="text-gray-300 text-xs text-center capitalize leading-tight">
              {cityData.description}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Render forecast
  const renderForecast = () => {
    if (
      !forecastData ||
      !Array.isArray(forecastData) ||
      forecastData.length === 0
    ) {
      return (
        <div className="text-center p-4">
          <p className="text-gray-400">{t("noForecastData")}</p>
        </div>
      );
    }

    return (
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-medium text-cyan-400">
            {t("forecast")} - {selectedCity}
          </h3>

          {selectedCity &&
            weatherData &&
            weatherData[selectedCity] &&
            weatherData[selectedCity].driving_conditions && (
              <div
                className={`px-2 py-0.5 rounded-full text-xs bg-black/50 font-medium ${getStatusColor(weatherData[selectedCity].driving_conditions.status)}`}
              >
                {t(
                  weatherData[selectedCity].driving_conditions.status +
                    "DrivingMessage",
                )}
              </div>
            )}
        </div>

        <div className="grid grid-cols-5 gap-3 mb-3">
          {forecastData.slice(0, 5).map((day, index) => (
            <div
              key={index}
              className="bg-black/40 rounded-lg p-2 border border-cyan-900/30 text-center"
            >
              <p className="text-xs text-cyan-400 font-medium mb-1">
                {new Date(day.date).toLocaleDateString(language, {
                  weekday: "short",
                })}
              </p>
              <div className="flex flex-col items-center justify-center h-14">
                {day.icon && (
                  <img
                    src={getWeatherIconUrl(day.icon)}
                    alt={day.description}
                    className="w-8 h-8"
                  />
                )}
                <p className="text-xs text-gray-300 capitalize text-center mt-1 leading-tight">
                  {day.description}
                </p>
              </div>
              <p className="text-white font-medium text-xs">
                {day.temp.toFixed(1)}°C
              </p>
              <div
                className={`mt-0.5 text-xs ${getStatusColor(day.driving_conditions.status)}`}
              >
                {t(day.driving_conditions.status)}
              </div>
            </div>
          ))}
        </div>

        {selectedCity && weatherData && weatherData[selectedCity] && (
          <div className="bg-black/40 rounded-lg p-4 border border-cyan-900/30 shadow-md backdrop-blur-sm transition-all hover:border-cyan-500/30">
            <div className="flex items-center mb-3 border-b border-cyan-900/20 pb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-cyan-400 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <h4 className="text-white font-medium text-base">
                {t("drivingRecommendations")}
              </h4>
              <div
                className={`ml-auto px-2 py-0.5 rounded-full text-xs bg-black/50 font-medium ${getStatusColor(weatherData[selectedCity].driving_conditions.status)}`}
              >
                {t(weatherData[selectedCity].driving_conditions.status)}
              </div>
            </div>

            {weatherData[selectedCity].driving_conditions &&
            weatherData[selectedCity].driving_conditions.recommendations &&
            weatherData[selectedCity].driving_conditions.recommendations
              .length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                {weatherData[
                  selectedCity
                ].driving_conditions.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="flex items-start bg-black/20 rounded-md p-2 backdrop-blur-sm hover:bg-cyan-900/10 transition-colors"
                  >
                    <span className="text-cyan-400 mr-2 text-sm">
                      {getRecommendationIcon(index)}
                    </span>
                    <span className="text-gray-300 text-xs">
                      {t(rec.replace(/\s+/g, "_").toLowerCase())}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div className="flex items-start bg-black/20 rounded-md p-2 backdrop-blur-sm hover:bg-cyan-900/10 transition-colors">
                  <span className="text-cyan-400 mr-2 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </span>
                  <span className="text-gray-300 text-xs">
                    {t("defaultRecommendation1")}
                  </span>
                </div>
                <div className="flex items-start bg-black/20 rounded-md p-2 backdrop-blur-sm hover:bg-cyan-900/10 transition-colors">
                  <span className="text-cyan-400 mr-2 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </span>
                  <span className="text-gray-300 text-xs">
                    {t("defaultRecommendation2")}
                  </span>
                </div>
                <div className="flex items-start bg-black/20 rounded-md p-2 backdrop-blur-sm hover:bg-cyan-900/10 transition-colors">
                  <span className="text-cyan-400 mr-2 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  <span className="text-gray-300 text-xs">
                    {t("defaultRecommendation3")}
                  </span>
                </div>
                <div className="flex items-start bg-black/20 rounded-md p-2 backdrop-blur-sm hover:bg-cyan-900/10 transition-colors">
                  <span className="text-cyan-400 mr-2 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  <span className="text-gray-300 text-xs">
                    {t("defaultRecommendation4")}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Helper function to get appropriate icon for each recommendation
  const getRecommendationIcon = (index) => {
    const icons = [
      // Road/driving icon
      <svg
        key="road"
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>,

      // Speed/gauge icon
      <svg
        key="speed"
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>,

      // Warning/alert icon
      <svg
        key="alert"
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>,

      // Visibility/eye icon
      <svg
        key="eye"
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>,
    ];

    return icons[index % icons.length];
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1.5 text-cyan-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
            />
          </svg>
          <p className="text-gray-400 text-xs">{t("weatherExplanation")}</p>
        </div>

        <button
          onClick={fetchWeatherData}
          className="bg-black border border-cyan-900/50 text-cyan-400 hover:bg-cyan-900/20 transition-colors rounded px-2 py-1 text-xs cursor-pointer"
        >
          {t("refresh")}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-400 text-center py-10 h-64 flex items-center justify-center flex-col">
          <p>{error}</p>
          <button
            onClick={fetchWeatherData}
            className="mt-2 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-md text-sm transition-colors cursor-pointer"
          >
            {t("retry")}
          </button>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            {weatherData &&
              Object.keys(weatherData).map((city) => renderCityCard(city))}
          </div>

          {loadingForecast ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
          ) : (
            renderForecast()
          )}

          <div className="text-gray-400 text-xs text-right mt-2">
            {t("weatherDisclaimer")}: {new Date().toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;

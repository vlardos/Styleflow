export type WeatherCategory = "cold" | "warm" | "rainy";

export type WeatherData = {
  city: string;
  temp: number;
  condition: string;
  category: WeatherCategory;
};

async function getCoordinates(city: string): Promise<{ lat: number; lon: number; name: string }> {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ru`
  );
  const data = await res.json();
  if (!data.results?.length) throw new Error(`Город "${city}" не найден`);
  const { latitude, longitude, name } = data.results[0];
  return { lat: latitude, lon: longitude, name };
}

function describeCode(code: number): string {
  if (code === 0) return "ясно";
  if (code <= 3) return "облачно";
  if (code <= 49) return "туман";
  if (code <= 67) return "дождь";
  if (code <= 77) return "снег";
  if (code <= 82) return "ливень";
  return "гроза";
}

export async function getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  const [weatherRes, geoRes] = await Promise.all([
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode`),
    fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=ru`),
  ]);

  const weatherData = await weatherRes.json();
  const geoData = await geoRes.json();

  const temp: number = weatherData.current.temperature_2m;
  const code: number = weatherData.current.weathercode;
  const condition = describeCode(code);
  const category = categorizeWeather(temp, condition);
  const city = geoData.results?.[0]?.name ?? "Ваш город";

  return { city, temp, condition, category };
}

export async function getWeather(city: string): Promise<WeatherData> {
  const { lat, lon, name } = await getCoordinates(city);

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode`
  );
  const data = await res.json();

  const temp: number = data.current.temperature_2m;
  const code: number = data.current.weathercode;
  const condition = describeCode(code);
  const category = categorizeWeather(temp, condition);

  return { city: name, temp, condition, category };
}

export function categorizeWeather(temp: number, condition: string): WeatherCategory {
  if (["дождь", "ливень", "гроза"].includes(condition)) return "rainy";
  if (temp < 10) return "cold";
  return "warm";
}

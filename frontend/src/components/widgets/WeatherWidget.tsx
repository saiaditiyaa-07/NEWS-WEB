"use client";

import React, { useState, useEffect } from "react";
import { CloudSun, Wind, Droplets, MapPin, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface WeatherData {
  city: string;
  city_ta: string;
  temp: number;
  condition: string;
  condition_ta: string;
  humidity: number;
  wind: string;
  wind_ta: string;
  alert?: string;
  alert_ta?: string;
}

export default function WeatherWidget({ initialCity }: { initialCity?: string }) {
  const { language, t } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [selectedCity, setSelectedCity] = useState(initialCity || "Chennai");
  const [loading, setLoading] = useState(true);

  const cities = ["Chennai", "Madurai", "Coimbatore", "Trichy", "Salem", "Kanyakumari", "Vellore"];

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/widgets/weather?city=${selectedCity}`);
        if (res.ok) {
          const data = await res.json();
          // Endpoint returns a list, take first
          if (data && data.length > 0) {
            setWeather(data[0]);
          } else {
            setWeather(data);
          }
        }
      } catch (err) {
        // Fallback mock
        setWeather({
          city: selectedCity,
          city_ta: selectedCity === "Chennai" ? "சென்னை" : selectedCity,
          temp: 34,
          condition: "Humid & Cloudy",
          condition_ta: "ஈரப்பதம் மற்றும் மேகமூட்டம்",
          humidity: 75,
          wind: "12 km/h",
          wind_ta: "மணிக்கு 12 கி.மீ",
          alert: selectedCity === "Kanyakumari" ? "Rough sea warning for fishermen" : undefined,
          alert_ta: selectedCity === "Kanyakumari" ? "மீனவர்களுக்கான கடல் அலை சீற்ற எச்சரிக்கை" : undefined,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [selectedCity]);

  if (loading && !weather) {
    return (
      <div className="p-5 bg-white border border-gray-200 rounded shadow-sm animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const activeWeather = weather || {
    city: "Chennai",
    city_ta: "சென்னை",
    temp: 34,
    condition: "Humid",
    condition_ta: "ஈரப்பதம்",
    humidity: 78,
    wind: "14 km/h",
    wind_ta: "மணிக்கு 14 கி.மீ"
  };

  const name = language === "ta" ? activeWeather.city_ta : activeWeather.city;
  const condition = language === "ta" ? activeWeather.condition_ta : activeWeather.condition;
  const windVal = language === "ta" ? activeWeather.wind_ta : activeWeather.wind;
  const alertText = language === "ta" ? activeWeather.alert_ta : activeWeather.alert;

  return (
    <div className="p-5 bg-white border border-gray-200 rounded shadow-sm space-y-4 text-gray-900">
      <div className="flex items-center justify-between border-b border-gray-150 pb-2">
        <h4 className="serif-title text-xs font-black uppercase tracking-widest text-[#003366] flex items-center gap-1.5">
          <CloudSun className="w-4 h-4 text-[#d60000]" />
          <span>{t("weatherAlert")}</span>
        </h4>
        
        {/* City Switcher */}
        {!initialCity && (
          <select 
            value={selectedCity} 
            onChange={(e) => setSelectedCity(e.target.value)}
            className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-transparent border-0 focus:outline-none focus:ring-0 cursor-pointer"
          >
            {cities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-1 font-bold text-sm text-gray-800">
            <MapPin className="w-3.5 h-3.5 text-[#d60000]" />
            <span>{name}</span>
          </div>
          <p className="text-xs text-gray-500 font-semibold">{condition}</p>
        </div>
        <div className="text-3xl serif-title font-black text-[#003366]">
          {activeWeather.temp}°C
        </div>
      </div>

      {/* Weather Attributes */}
      <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-500 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-1.5">
          <Wind className="w-3.5 h-3.5 text-blue-500" />
          <span>{windVal}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Droplets className="w-3.5 h-3.5 text-blue-500" />
          <span>RH: {activeWeather.humidity}%</span>
        </div>
      </div>

      {/* Critical Storm Alert Banner */}
      {alertText && (
        <div className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 rounded text-[9px] font-black text-red-700 leading-normal uppercase tracking-wider animate-pulse">
          <AlertTriangle className="w-4 h-4 shrink-0 text-[#d60000]" />
          <span>{alertText}</span>
        </div>
      )}
    </div>
  );
}

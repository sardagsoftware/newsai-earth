"use client";
import React, { useEffect, useState } from "react";

export default function Footer() {
  const [weather, setWeather] = useState<{ temp: number; desc: string; icon: string } | null>(null);
  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=41.01&longitude=28.97&current_weather=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.current_weather) {
          setWeather({
            temp: data.current_weather.temperature,
            desc: "İstanbul",
            icon: "https://openweathermap.org/img/wn/01d.png"
          });
        }
      });
  }, []);
  return (
    <footer className="w-full bg-gray-900 text-gray-200 py-6 mt-12 border-t border-gray-800">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        <div className="flex flex-col gap-1 text-xs md:text-sm">
          <span>© 2013 - 2025 Sardag</span>
          <span>AiLydian • AitBondie.ai • Ukalai.ai • Payream</span>
          <span>Fikri Mülkiyet Hakları • Gizlilik • GDPR • KVKK • Kullanım Şartları</span>
        </div>
        <div className="flex items-center gap-2">
          {weather ? (
            <>
              <img src={weather.icon} alt="hava" className="w-7 h-7" />
              <span className="font-bold">{weather.temp}°C</span>
              <span className="text-xs">{weather.desc} güncel hava durumu</span>
            </>
          ) : (
            <span className="text-xs text-gray-400">Hava durumu yükleniyor...</span>
          )}
        </div>
      </div>
    </footer>
  );
}

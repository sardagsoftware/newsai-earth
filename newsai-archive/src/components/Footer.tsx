"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function Footer() {
  const [weather, setWeather] = useState<{ temp: number; desc: string; icon: string } | null>(null);
  const [imgError, setImgError] = useState(false);
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
    <footer className="w-full bg-gradient-to-r from-[#0f1724] to-[#071126] text-gray-200 py-8 mt-12 border-t border-gray-800">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        <div className="flex flex-col gap-2 text-xs md:text-sm">
          <span className="font-semibold">© 2013 - 2025 Sardag</span>
          <span>AiLydian • AitBondie.ai • Ukalai.ai • Payream</span>
          <span>Fikri Mülkiyet Hakları • Gizlilik • GDPR • KVKK • Kullanım Şartları</span>
          <span className="text-sm text-gray-300">Türkiye&apos;de geliştirilmiştir • Geliştiriciye sonsuz teşekkürler ❤️</span>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            {weather ? (
              <>
                {!imgError ? (
                  <Image
                    src={weather.icon}
                    alt="hava"
                    width={28}
                    height={28}
                    className="w-7 h-7"
                    onError={() => setImgError(true)}
                    unoptimized
                  />
                ) : (
                  <div className="w-7 h-7 flex items-center justify-center text-xl">☀️</div>
                )}
                <div className="flex flex-col text-right">
                  <span className="font-bold">{weather.temp}°C</span>
                  <span className="text-xs text-gray-400">{weather.desc} güncel hava durumu</span>
                </div>
              </>
            ) : (
              <span className="text-xs text-gray-400">Hava durumu yükleniyor...</span>
            )}
          </div>
          <div className="text-xs text-gray-400">Destekçimize sonsuz teşekkürler <span className="text-purple-400">❤‍</span></div>
        </div>
      </div>
    </footer>
  );
}

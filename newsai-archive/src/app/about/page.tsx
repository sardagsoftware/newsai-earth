"use client";

import ThemedLayout from "../../components/ThemedLayout";
import React from "react";

export default function AboutPage() {
  return (
    <ThemedLayout title="Hakkımızda" subtitle="NewsAI: Bilimsel haberleri yapay zeka ile özetliyoruz" accent="from-green-400 via-teal-400 to-blue-400">
      <div className="space-y-4 text-gray-200">
        <p>
          NewsAI, dünya genelindeki bilimsel, çevresel ve teknolojik gelişmeleri AI destekli özetlerle sunan bir platformdur. Amacımız güvenilir ve anlaşılır bilgilerle kullanıcıları güçlendirmektir.
        </p>
        <p>
          Platform, farklı modülleri tek bir arama çatı altında birleştirir: haber, iklim, tarım, kimya, biyoloji, elementler ve tarih.
        </p>
      </div>
    </ThemedLayout>
  );
}

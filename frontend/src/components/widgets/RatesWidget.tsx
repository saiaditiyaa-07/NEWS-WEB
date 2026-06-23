"use client";

import React, { useState, useEffect } from "react";
import { Coins, Flame } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface RatesData {
  gold_22k: number;
  gold_24k: number;
  silver: number;
  petrol: number;
  diesel: number;
  unit: string;
  unit_ta: string;
}

export default function RatesWidget() {
  const { language, t } = useLanguage();
  const [rates, setRates] = useState<RatesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/widgets/rates");
        if (res.ok) {
          const data = await res.json();
          setRates(data);
        }
      } catch (err) {
        setRates({
          gold_22k: 5850.0,
          gold_24k: 6380.0,
          silver: 82.5,
          petrol: 102.63,
          diesel: 94.24,
          unit: "per gram / liter",
          unit_ta: "ஒரு கிராம் / லிட்டர்"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  if (loading) {
    return (
      <div className="p-5 bg-white border border-gray-200 rounded shadow-sm animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const activeRates = rates || {
    gold_22k: 5850.0,
    gold_24k: 6380.0,
    silver: 82.5,
    petrol: 102.63,
    diesel: 94.24,
    unit: "per gram / liter",
    unit_ta: "ஒரு கிராம் / லிட்டர்"
  };

  const unitText = language === "ta" ? activeRates.unit_ta : activeRates.unit;

  return (
    <div className="p-5 bg-white border border-gray-200 rounded shadow-sm space-y-4 text-gray-900">
      <div className="flex items-center justify-between border-b border-gray-150 pb-2">
        <h4 className="serif-title text-xs font-black uppercase tracking-widest text-[#003366] flex items-center gap-1.5">
          <Coins className="w-4 h-4 text-[#d60000]" />
          <span>{t("ratesAlert")}</span>
        </h4>
        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{unitText}</span>
      </div>

      {/* Gold & Silver rate grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5 p-3 rounded border border-gray-100 bg-gray-50/50">
          <div className="text-[9px] font-black uppercase tracking-wider text-[#003366]">{language === "ta" ? "தங்கம் (22K)" : "Gold 22K"}</div>
          <div className="serif-title text-sm font-black text-gray-900">₹{activeRates.gold_22k.toLocaleString()}</div>
        </div>
        <div className="space-y-1.5 p-3 rounded border border-gray-100 bg-gray-50/50">
          <div className="text-[9px] font-black uppercase tracking-wider text-[#003366]">{language === "ta" ? "தங்கம் (24K)" : "Gold 24K"}</div>
          <div className="serif-title text-sm font-black text-gray-900">₹{activeRates.gold_24k.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-gray-650 pt-2 border-t border-gray-100">
        <div className="space-y-0.5">
          <span className="block text-[8px] font-black text-gray-400 uppercase">{language === "ta" ? "வெள்ளி" : "Silver"}</span>
          <span className="font-extrabold text-[#003366]">₹{activeRates.silver}</span>
        </div>
        <div className="space-y-0.5 border-x border-gray-100">
          <span className="block text-[8px] font-black text-gray-400 uppercase">{language === "ta" ? "பெட்ரோல்" : "Petrol"}</span>
          <span className="font-extrabold text-[#003366]">₹{activeRates.petrol}</span>
        </div>
        <div className="space-y-0.5">
          <span className="block text-[8px] font-black text-gray-400 uppercase">{language === "ta" ? "டீசல்" : "Diesel"}</span>
          <span className="font-extrabold text-[#003366]">₹{activeRates.diesel}</span>
        </div>
      </div>
    </div>
  );
}

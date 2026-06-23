"use client";

import React, { useState, useEffect } from "react";
import { Trophy, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface CricketMatch {
  teams: string;
  teams_ta: string;
  status: string;
  status_ta: string;
  score: string;
  score_ta: string;
}

interface SportsData {
  live_match: CricketMatch;
  headlines: string[];
  headlines_ta: string[];
}

export default function SportsWidget() {
  const { language, t } = useLanguage();
  const [sports, setSports] = useState<SportsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/widgets/sports");
        if (res.ok) {
          const data = await res.json();
          setSports(data);
        }
      } catch (err) {
        setSports({
          live_match: {
            teams: "IND vs AUS (T20 World Cup)",
            teams_ta: "இந்தியா எதிர் ஆஸ்திரேலியா (டி20 உலகக் கோப்பை)",
            status: "In Progress - Innings Break",
            status_ta: "விளையாட்டு நடந்து கொண்டிருக்கிறது - இடைவேளை",
            score: "IND: 196/5 (20.0 Over) | AUS: 0/0 (0.0 Over)",
            score_ta: "IND: 196/5 (20.0 ஓவர்) | AUS: 0/0 (0.0 ஓவர்)"
          },
          headlines: [
            "India posts a massive total of 196 against Australia in Super 8 stage",
            "Hardik Pandya slams quick-fire 45 off 18 balls to lift the score",
            "CSK resumes training camp in Chennai ahead of qualifiers"
          ],
          headlines_ta: [
            "சூப்பர் 8 சுற்றில் ஆஸ்திரேலியாவுக்கு எதிராக இந்தியா 196 ரன்கள் குவித்தது",
            "ஹர்திக் பாண்டியா 18 பந்துகளில் 45 ரன்கள் விளாசி ஸ்கோரை உயர்த்தினார்",
            "தகுதிச் சுற்றுக்கு முன்னதாக சென்னையில் சி.எஸ்.கே அணி பயிற்சியை தொடங்கியது"
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSports();
  }, []);

  if (loading) {
    return (
      <div className="p-5 bg-white border border-gray-200 rounded shadow-sm animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const activeSports = sports || {
    live_match: {
      teams: "IND vs AUS",
      teams_ta: "இந்தியா எதிர் ஆஸ்திரேலியா",
      status: "Live Match",
      status_ta: "நேரடிப் போட்டி",
      score: "0/0",
      score_ta: "0/0"
    },
    headlines: [],
    headlines_ta: []
  };

  const matchTeams = language === "ta" ? activeSports.live_match.teams_ta : activeSports.live_match.teams;
  const matchStatus = language === "ta" ? activeSports.live_match.status_ta : activeSports.live_match.status;
  const matchScore = language === "ta" ? activeSports.live_match.score_ta : activeSports.live_match.score;
  const headlines = language === "ta" ? activeSports.headlines_ta : activeSports.headlines;

  return (
    <div className="p-5 bg-white border border-gray-200 rounded shadow-sm space-y-4 text-gray-900">
      <div className="flex items-center justify-between border-b border-gray-150 pb-2">
        <h4 className="serif-title text-xs font-black uppercase tracking-widest text-[#003366] flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-[#d60000]" />
          <span>{t("sportsAlert")}</span>
        </h4>
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
      </div>

      {/* Live Cricket Score Box */}
      <div className="p-3 bg-blue-50/50 border border-blue-100 rounded space-y-2">
        <div className="text-[9px] font-black uppercase tracking-wider text-blue-700">{matchTeams}</div>
        <div className="serif-title text-xs font-black text-gray-900 leading-snug">{matchScore}</div>
        <div className="text-[8px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1">
          <span>{matchStatus}</span>
        </div>
      </div>

      {/* Sports Headlines list */}
      <div className="space-y-2.5 pt-2 border-t border-gray-100">
        <span className="text-[8px] font-black uppercase tracking-wider text-gray-400 block">{language === "ta" ? "விளையாட்டு செய்திகள்" : "Sports Headlines"}</span>
        <ul className="space-y-2">
          {headlines.slice(0, 2).map((hl, idx) => (
            <li key={idx} className="flex gap-1.5 items-start text-[11px] font-semibold text-gray-700 leading-snug hover:text-[#d60000] cursor-pointer">
              <ChevronRight className="w-3.5 h-3.5 text-[#003366] shrink-0 mt-0.5" />
              <span className="line-clamp-2">{hl}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

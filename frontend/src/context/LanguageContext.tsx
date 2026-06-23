"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "ta";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    brandName: "KUMARI NEWS",
    tagline: "Voice of Tamil Nadu, Vision of the Future",
    digitalEdition: "Digital Edition",
    adminConsole: "Admin Console",
    searchIndex: "Search index...",
    searchPlaceholder: "Search topics, tags, authors...",
    breakingNews: "🔴 Breaking News",
    featuredHeadline: "FEATURED HEADLINE",
    regionalBriefs: "Regional Briefs",
    minRead: "min read",
    viewPortfolio: "View Saved Portfolio",
    bookmarksTitle: "Saved Briefing Portfolio",
    bookmarksSubtitle: "Your offline saved reading compilation.",
    searchTitle: "Search News Indices",
    searchSubtitle: "Search all intelligence reports, research, and analysis.",
    clearFilters: "Clear Filters",
    trendingQueries: "Trending Queries",
    allBriefings: "All Briefings & Updates",
    fetchMore: "Fetch More Reports",
    syncingDb: "Syncing Database...",
    allIndicesLoaded: "All indices loaded. You are fully up to date.",
    weatherAlert: "Local Weather",
    ratesAlert: "Rates Panel",
    sportsAlert: "Live Match Feed",
    jobsAlert: "TN Job Alerts",
    educationAlert: "Academic Updates",
    epaperTitle: "E-Paper Archives",
    epaperSubtitle: "Read today's digital print and past editions.",
    downloadPdf: "Download PDF",
    viewEpaper: "View Digital Print",
    readFullReport: "Read Full Report",
    aiSynthesis: "AI Executive Synthesis",
    coreTakeaways: "Core Takeaways",
    sentimentAnalysis: "Sentiment Analysis",
    sentimentLabel: "Signal Label",
    askAssistant: "Cognitive Assistant",
    askAssistantBanner: "Inquire About This Report",
    askAssistantPlaceholder: "Ask this article...",
    voiceReaderEn: "🔊 Listen to News",
    voiceReaderTa: "🔊 செய்தியை கேளுங்கள்",
    relatedStories: "Related Stories",
    backToDashboard: "Back to Dashboard",
    categoryFilters: "Category Filters",
    latestLocalNews: "Latest Local Bulletins",
    localEvents: "Local Events & Alerts",
    noLocalNews: "No bulletins found for this district.",
    readingTime: "Reading Time",
    views: "views",
    bookmarkBtn: "Save Report",
    bookmarkedBtn: "Saved",
    shareBtn: "Share Report",
    copyBtn: "Copy Link",
    copiedAlert: "Link copied to clipboard!",
    commentsTitle: "Public Feedback Channel",
    addCommentBtn: "Post Feedback",
    commentPlaceholder: "Add a comment...",
    authorLabel: "Your Name",
    latestUpdates: "Latest Updates",
    districtTitle: "District News Portal",
    districtSubtitle: "Real-time updates from your local community.",
    historyTitle: "Reading History",
    historySubtitle: "A record of your recently read articles.",
    interestsTitle: "Choose Your Interests",
    interestsSubtitle: "Personalize your news feed dynamically.",
    saveInterests: "Save Preferences",
    interestsSaved: "Preferences saved successfully!",
    epaperButton: "E-Paper",
    tvButton: "Kumari TV",
    appStore: "App Store",
    playStore: "Google Play",
    footerText: "Kumari News is Tamil Nadu's premium enterprise-grade digital news network, delivering real-time bulletins and research.",
    categoriesHeader: "Categories",
    corporateHeader: "Corporate Info",
    developersHeader: "Developers & API",
    platformHeader: "Platform Portal",
    copyright: "Kumari News Digital Network. All rights reserved.",
    sponsoredLabel: "Sponsored Intelligence Update",
    detailsLabel: "Details",
    adminTitle: "Publisher Analytics Terminal",
    adminSubtitle: "Live intelligence reports, metrics, and content management dashboard.",
    dashboardOverview: "Dashboard Overview",
    cmsArticles: "CMS Article Manager",
    addNews: "Add New Entry",
    modifyBriefing: "Modify Briefing",
    draftReport: "Draft New Intelligence Report",
    successMsg: "Entry updated successfully!",
    successCreate: "Entry created successfully!",
    searchDb: "Search database listings...",
    all: "All",
    tamilnadu: "Tamil Nadu",
    india: "India",
    world: "World",
    business: "Business",
    sports: "Sports",
    technology: "Technology",
    entertainment: "Entertainment",
    education: "Education",
    jobs: "Jobs",
    districtNews: "District News",
    feedbackTitle: "Reader Feedback",
    readOffline: "Read offline and save reports directly to your local portfolio.",
    accessOffline: "Access compiled data without network connections.",
    accCloud: "Discover local events, announcements, and meteorology charts.",
    workloads: "Stay connected with your local district news hub."
  },
  ta: {
    brandName: "குமரி செய்திகள்",
    tagline: "தமிழகத்தின் குரல், எதிர்காலத்தின் பார்வை",
    digitalEdition: "டிஜிட்டல் பதிப்பு",
    adminConsole: "நிர்வாகக் குழு",
    searchIndex: "செய்திகளைத் தேடுங்கள்...",
    searchPlaceholder: "தலைப்புகள், குறிச்சொற்கள், எழுத்தாளர்கள்...",
    breakingNews: "🔴 அவசர செய்திகள்",
    featuredHeadline: "முக்கியச் செய்தி",
    regionalBriefs: "உள்ளூர் செய்திகள்",
    minRead: "நிமிட வாசிப்பு",
    viewPortfolio: "சேமிக்கப்பட்ட செய்திகள்",
    bookmarksTitle: "சேமிக்கப்பட்ட செய்திகளின் தொகுப்பு",
    bookmarksSubtitle: "ஆஃப்லைனில் வாசிப்பதற்காக நீங்கள் சேமித்த செய்திகள்.",
    searchTitle: "செய்டி காப்பகத் தேடல்",
    searchSubtitle: "அனைத்து செய்தி அறிக்கைகள், ஆராய்ச்சி மற்றும் பகுப்பாய்வுகளைத் தேடுங்கள்.",
    clearFilters: "வடிகட்டிகளை நீக்கு",
    trendingQueries: "பிரபலமான தேடல்கள்",
    allBriefings: "அனைத்து செய்திகள் மற்றும் அறிவிப்புகள்",
    fetchMore: "மேலும் செய்திகளைப் பெறுக",
    syncingDb: "தரவுத்தளத்தை ஒத்திசைக்கிறது...",
    allIndicesLoaded: "அனைத்து செய்திகளும் ஏற்றப்பட்டன. நீங்கள் புதுப்பிப்பில் உள்ளீர்கள்.",
    weatherAlert: "உள்ளூர் வானிலை",
    ratesAlert: "விலை நிலவரம்",
    sportsAlert: "நேரடி கிரிக்கெட்",
    jobsAlert: "வேலைவாய்ப்பு செய்திகள்",
    educationAlert: "கல்வி அறிவிப்புகள்",
    epaperTitle: "ஈ-பேப்பர் காப்பகம்",
    epaperSubtitle: "இன்றைய டிஜிட்டல் பதிப்பு மற்றும் முந்தைய பதிப்புகளைப் படியுங்கள்.",
    downloadPdf: "PDF தரவிறக்கம்",
    viewEpaper: "டிஜிட்டல் பதிப்பை காண்க",
    readFullReport: "முழு செய்தியையும் படிக்க",
    aiSynthesis: "செயற்கை நுண்ணறிவு சுருக்கம்",
    coreTakeaways: "முக்கிய குறிப்புகள்",
    sentimentAnalysis: "கருத்து பகுப்பாய்வு",
    sentimentLabel: "மதிப்பீட்டு லேபிள்",
    askAssistant: "ஏஐ செய்தியாளர்",
    askAssistantBanner: "கட்டுரை பற்றி கேளுங்கள்",
    askAssistantPlaceholder: "செய்தி பற்றி கேட்க...",
    voiceReaderEn: "🔊 Listen to News",
    voiceReaderTa: "🔊 செய்தியை கேளுங்கள்",
    relatedStories: "தொடர்புடைய செய்திகள்",
    backToDashboard: "நிர்வாகப் பலகைக்குத் திரும்புக",
    categoryFilters: "வகை வடிகட்டிகள்",
    latestLocalNews: "உள்ளூர் செய்திகள்",
    localEvents: "உள்ளூர் நிகழ்வுகள் & எச்சரிக்கைகள்",
    noLocalNews: "இந்த மாவட்டத்தில் செய்திகள் எதுவும் இல்லை.",
    readingTime: "வாசிப்பு நேரம்",
    views: "பார்வைகள்",
    bookmarkBtn: "சேமிக்க",
    bookmarkedBtn: "சேமிக்கப்பட்டது",
    shareBtn: "பகிர்க",
    copyBtn: "நகலெடு",
    copiedAlert: "இணைப்பு நகலெடுக்கப்பட்டது!",
    commentsTitle: "வாசகர் கருத்துப் பகுதி",
    addCommentBtn: "கருத்தைப் பதிவிடுக",
    commentPlaceholder: "கருத்தைச் சேர்க்கவும்...",
    authorLabel: "உங்கள் பெயர்",
    latestUpdates: "சமீபத்திய அறிவிப்புகள்",
    districtTitle: "மாவட்ட செய்திகள்",
    districtSubtitle: "உங்கள் உள்ளூர் சமூகத்தின் நிகழ்நேர செய்திகள்.",
    historyTitle: "வாசிப்பு வரலாறு",
    historySubtitle: "நீங்கள் சமீபத்தில் படித்த கட்டுரைகளின் பதிவு.",
    interestsTitle: "ஆர்வங்களைத் தேர்ந்தெடுக்கவும்",
    interestsSubtitle: "செய்தி ஊட்டத்தை எளிதாகத் தனிப்பயனாக்கவும்.",
    saveInterests: "விருப்பங்களைச் சேமி",
    interestsSaved: "விருப்பங்கள் வெற்றிகரமாகச் சேமிக்கப்பட்டன!",
    epaperButton: "ஈ-பேப்பர்",
    tvButton: "குமரி டிவி",
    appStore: "ஆப் ஸ்டோர்",
    playStore: "கூகுள் பிளே",
    footerText: "குமரி செய்திகள் என்பது தமிழ்நாட்டின் முதன்மையான டிஜிட்டல் செய்தி நெட்வொர்க் ஆகும், இது உடனுக்குடன் செய்திகளையும் தரம் வாய்ந்த தகவல்களையும் வழங்குகிறது.",
    categoriesHeader: "வகைகள்",
    corporateHeader: "கார்ப்பரேட் தகவல்",
    developersHeader: "டெவலப்பர்ஸ் & ஏபிஐ",
    platformHeader: "தள போர்டல்",
    copyright: "குமரி செய்திகள் டிஜிட்டல் நெட்வொர்க். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    sponsoredLabel: "விளம்பரத் தகவல்",
    detailsLabel: "விவரங்கள்",
    adminTitle: "பதிப்பாளர் பகுப்பாய்வு முனையம்",
    adminSubtitle: "நேரடி செய்தி அறிக்கைகள், அளவீடுகள் மற்றும் உள்ளடக்க மேலாண்மை கட்டுப்பாட்டுப் பலகை.",
    dashboardOverview: "கட்டுப்பாட்டு பலகை மேலோட்டம்",
    cmsArticles: "செய்தி மேலாளர்",
    addNews: "புதிய செய்தி சேர்க்க",
    modifyBriefing: "செய்தியைத் திருத்துக",
    draftReport: "புதிய செய்தி வரைவை உருவாக்குக",
    successMsg: "செய்தி வெற்றிகரமாக புதுப்பிக்கப்பட்டது!",
    successCreate: "செய்தி வெற்றிகரமாக உருவாக்கப்பட்டது!",
    searchDb: "செய்திகளைத் தேடுங்கள்...",
    all: "அனைத்தும்",
    tamilnadu: "தமிழ்நாடு",
    india: "இந்தியா",
    world: "உலகம்",
    business: "வணிகம்",
    sports: "விளையாட்டு",
    technology: "தொழில்நுட்பம்",
    entertainment: "சினிமா / பொழுதுபோக்கு",
    education: "கல்வி",
    jobs: "வேலைவாய்ப்பு",
    districtNews: "மாவட்ட செய்திகள்",
    feedbackTitle: "வாசகர் கருத்து",
    readOffline: "ஆஃப்லைனில் படிக்க மற்றும் உங்கள் போர்ட்ஃபோலியோவில் சேமிக்க.",
    accessOffline: "இணைய இணைப்பு இல்லாமல் சேமிக்கப்பட்ட செய்திகளை அணுகவும்.",
    accCloud: "உள்ளூர் நிகழ்வுகள், அறிவிப்புகள் மற்றும் வானிலை வரைபடங்களைக் கண்டறியவும்.",
    workloads: "உங்கள் உள்ளூர் மாவட்ட செய்தி மையத்துடன் இணைந்திருங்கள்."
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang === "en" || savedLang === "ta") {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    window.dispatchEvent(new Event("languageChanged"));
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// ==========================================
// DESTINATION CULTURAL ETIQUETTE & EMERGENCY GUIDE UTILITY
// ==========================================

const DESTINATION_DATABASE = {
  japan: {
    country: "Japan",
    currency: "Japanese Yen (¥)",
    emergency: { police: "110", ambulance: "119", fire: "119" },
    tipping: "Tipping is NOT customary. Excellent service is included, and leaving cash tips can be considered rude.",
    plugs: "Type A & B (100V, 50/60Hz)",
    phrases: {
      hello: "Konnichiwa (こんにちは)",
      thankYou: "Arigatou Gozaimasu (ありがとうございます)",
      help: "Tasukete! (助けて!)",
      whereIs: "Dokodesuka? (〜はどこですか?)",
    },
  },
  france: {
    country: "France",
    currency: "Euro (€)",
    emergency: { police: "17", ambulance: "15", general: "112" },
    tipping: "Service is included (service compris). Rounding up or leaving 5-10% for good service is appreciated.",
    plugs: "Type C & E (230V, 50Hz)",
    phrases: {
      hello: "Bonjour",
      thankYou: "Merci beaucoup",
      help: "Au secours!",
      whereIs: "Où se trouve...?",
    },
  },
  italy: {
    country: "Italy",
    currency: "Euro (€)",
    emergency: { police: "113", ambulance: "118", general: "112" },
    tipping: "Coperto (cover charge) is common on bills. Tipping 5-10% is polite for sit-down meals, but not mandatory.",
    plugs: "Type C, F & L (230V, 50Hz)",
    phrases: {
      hello: "Ciao / Buongiorno",
      thankYou: "Grazie mille",
      help: "Aiuto!",
      whereIs: "Dov'è...?",
    },
  },
  spain: {
    country: "Spain",
    currency: "Euro (€)",
    emergency: { police: "091", ambulance: "061", general: "112" },
    tipping: "Small change (5-10%) is customary for sit-down dining if service is good.",
    plugs: "Type C & F (230V, 50Hz)",
    phrases: {
      hello: "¡Hola!",
      thankYou: "Muchas gracias",
      help: "¡Ayuda!",
      whereIs: "¿Dónde está...?",
    },
  },
  germany: {
    country: "Germany",
    currency: "Euro (€)",
    emergency: { police: "110", ambulance: "112", fire: "112" },
    tipping: "Hand tip directly to waiter (Stimmt so!). 5-10% is standard.",
    plugs: "Type C & F (230V, 50Hz)",
    phrases: {
      hello: "Hallo / Guten Tag",
      thankYou: "Vielen Dank",
      help: "Hilfe!",
      whereIs: "Wo ist...?",
    },
  },
  thailand: {
    country: "Thailand",
    currency: "Thai Baht (฿)",
    emergency: { touristPolice: "1155", police: "191", ambulance: "1669" },
    tipping: "Not expected, but 20-50 THB left at restaurants or for massage therapists is welcomed.",
    plugs: "Type A, B, C & F (230V, 50Hz)",
    phrases: {
      hello: "Sawatdee (สวัสดี)",
      thankYou: "Khop khun (ขอบคุณ)",
      help: "Chuay duay! (ช่วยด้วย!)",
      whereIs: "...yoo tee nai? (...อยู่ที่ไหน?)",
    },
  },
  indonesia: {
    country: "Indonesia (Bali)",
    currency: "Indonesian Rupiah (Rp)",
    emergency: { police: "110", ambulance: "118", general: "112" },
    tipping: "10% service charge often included in tourist spots. Leaving small change for drivers/guides is customary.",
    plugs: "Type C & F (230V, 50Hz)",
    phrases: {
      hello: "Halo / Selamat Siang",
      thankYou: "Terima kasih",
      help: "Tolong!",
      whereIs: "Di mana...?",
    },
  },
  usa: {
    country: "United States",
    currency: "US Dollar ($)",
    emergency: { police: "911", ambulance: "911", fire: "911" },
    tipping: "Customary and expected: 15-20% for restaurants, $1-2 per drink for bartenders, $2-5 per day for hotel housekeepers.",
    plugs: "Type A & B (120V, 60Hz)",
    phrases: {
      hello: "Hello / Hi",
      thankYou: "Thank you so much",
      help: "Help!",
      whereIs: "Where is...?",
    },
  },
  uk: {
    country: "United Kingdom",
    currency: "British Pound (£)",
    emergency: { general: "999 / 112" },
    tipping: "10-12.5% often added to restaurant bills. Pub drinking does not require tipping bartenders.",
    plugs: "Type G (230V, 50Hz)",
    phrases: {
      hello: "Hello / Cheers",
      thankYou: "Thank you / Cheers",
      help: "Help!",
      whereIs: "Where is...?",
    },
  },
  india: {
    country: "India",
    currency: "Indian Rupee (₹)",
    emergency: { police: "112 / 100", ambulance: "102 / 108" },
    tipping: "10% is standard in restaurants if service charge is not included. Small tips for hotel bellhops.",
    plugs: "Type C, D & M (230V, 50Hz)",
    phrases: {
      hello: "Namaste (नमस्ते)",
      thankYou: "Dhanyavaad (धन्यवाद)",
      help: "Madad karo! (मदद करो!)",
      whereIs: "...kaha hai? (...कहाँ है?)",
    },
  },
};

/**
 * Utility function to look up destination guide info from a location string.
 */
export const getDestinationGuide = (locationStr) => {
  if (!locationStr || typeof locationStr !== "string") return null;

  const locLower = locationStr.toLowerCase();

  for (const [key, data] of Object.entries(DESTINATION_DATABASE)) {
    if (locLower.includes(key) || locLower.includes(data.country.toLowerCase())) {
      return data;
    }
  }

  // Smart fallback for unknown regions
  return {
    country: locationStr.split(",").pop()?.trim() || locationStr,
    currency: "Local Currency",
    emergency: { police: "112 / 911", ambulance: "112 / 911" },
    tipping: "Check local custom: 5-10% is generally appreciated in tourist establishments.",
    plugs: "Universal Travel Adapter Recommended (100V–240V)",
    phrases: {
      hello: "Hello",
      thankYou: "Thank you",
      help: "Help!",
      whereIs: "Where is...?",
    },
  };
};

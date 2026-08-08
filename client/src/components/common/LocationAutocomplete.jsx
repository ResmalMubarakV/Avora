import { useState, useEffect, useRef } from "react";
import { MapPin, Loader2 } from "lucide-react";

const LocationAutocomplete = ({ value, onChange, name = "location" }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions instantly as the user types
  useEffect(() => {
    if (!isOpen || !value || value.trim().length < 1) {
      setSuggestions([]);
      return;
    }

    const fetchLocations = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            value
          )}&format=json&addressdetails=1&countrycodes=in&limit=6&accept-language=en`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fast 300ms debounce for snappy suggestions
    const debounceTimer = setTimeout(() => {
      fetchLocations();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [value, isOpen]);

  const handleInputChange = (e) => {
    setIsOpen(true);
    onChange(e);
  };

  const handleSelectSuggestion = (suggestion) => {
    const address = suggestion.address || {};

    const locality = 
      address.tourism || 
      address.attraction || 
      address.hamlet || 
      address.village || 
      address.suburb || 
      address.neighbourhood || 
      address.town || 
      address.city || 
      address.name;

    const district = address.county || address.city || address.state_district;
    const state = address.state;
    const country = address.country;

    const rawParts = [locality, district, state, country];
    const uniqueCleanParts = [];

    rawParts.forEach((part) => {
      if (
        part && 
        !uniqueCleanParts.includes(part) && 
        !/^\d{6}$/.test(part)
      ) {
        uniqueCleanParts.push(part);
      }
    });

    const finalLocation = uniqueCleanParts.slice(0, 3).join(", ");

    setIsOpen(false);
    onChange({ target: { name, value: finalLocation } });
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          name={name}
          value={value || ""}
          onChange={handleInputChange}
          onFocus={() => value && setIsOpen(true)}
          placeholder="e.g., Goa, India"
          className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 pl-10 text-sm text-slate-800 outline-none transition focus:border-[#3559D4] focus:bg-white focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400"
          autoComplete="off"
        />
        <MapPin
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        {loading && (
          <Loader2 
            size={16} 
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3559D4] animate-spin" 
          />
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          <ul className="max-h-60 overflow-y-auto py-2 scrollbar-hide">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.place_id}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="flex cursor-pointer items-start gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
              >
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#3559D4]" />
                <span className="text-sm text-slate-700 line-clamp-2">
                  {suggestion.display_name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;
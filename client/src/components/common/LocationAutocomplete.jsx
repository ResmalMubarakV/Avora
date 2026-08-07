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

  // Fetch suggestions from OpenStreetMap Nominatim API
  useEffect(() => {
    // Only fetch if the dropdown is open and the user has typed at least 2 characters
    if (!isOpen || !value || value.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchLocations = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            value
          )}&format=json&addressdetails=1&limit=5`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the API call by 500ms to prevent spamming the OSM API
    const debounceTimer = setTimeout(() => {
      fetchLocations();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [value, isOpen]);

  const handleInputChange = (e) => {
    setIsOpen(true);
    // Send the raw typed value to the parent immediately so Live Preview works
    onChange(e);
  };

  const handleSelectSuggestion = (suggestion) => {
    // Format the display name to be a bit cleaner (e.g., City, State, Country)
    const address = suggestion.address;
    const cleanLocation = [
      address.city || address.town || address.village || address.name,
      address.state,
      address.country
    ].filter(Boolean).join(", ");

    const finalLocation = cleanLocation || suggestion.display_name;

    setIsOpen(false);

    // Send selected value to parent CreateMemory/EditMemory state
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
          placeholder="Where did you go? (e.g., Paris, France)"
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
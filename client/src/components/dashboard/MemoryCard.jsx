import { CalendarDays, MapPin, Globe, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const MemoryCard = ({ memory }) => {
    const navigate = useNavigate();
  return (
    <div
        onClick={() =>
            navigate(`/${memory.user.username}/${memory.slug}`)
        }
        className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >

      <div className="relative">

        <img
          src={memory.coverImage}
          alt={memory.title}
          className="w-full h-56 object-cover"
        />

        <div className="absolute top-3 right-3">

          {memory.isPublic ? (
            <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 text-xs font-medium">
              <Globe size={14} />
              Public
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 text-xs font-medium">
              <Lock size={14} />
              Private
            </div>
          )}

        </div>

      </div>

      <div className="p-5">

        <h3 className="font-bold text-lg">
          {memory.title}
        </h3>

        <div className="flex items-center gap-2 mt-3 text-gray-500">

          <MapPin size={16} />

          {memory.location}

        </div>

        <div className="flex items-center gap-2 mt-2 text-gray-500">

        <CalendarDays size={16} />

        {formatDate(memory.startDate)}

        </div>

      </div>

    </div>
  );
};

export default MemoryCard;
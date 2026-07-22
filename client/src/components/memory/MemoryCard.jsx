import { Link } from "react-router-dom";

const MemoryCard = ({ memory, username }) => {
  return (
    <Link to={`/${username}/${memory.slug}`}>
      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer">

        {/* Cover Image */}
        <div className="h-60 bg-gray-200">
          {memory.coverImage && (
            <img
              src={memory.coverImage}
              alt={memory.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Content */}
        <div className="p-5">

          <h2 className="text-xl font-bold">
            {memory.title}
          </h2>

          <p className="text-gray-600 mt-2 line-clamp-2">
            {memory.description}
          </p>

          <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
            <span>📍 {memory.location}</span>

            <span>
              {new Date(memory.startDate).toLocaleDateString()}
            </span>
          </div>

        </div>

      </div>
    </Link>
  );
};

export default MemoryCard;
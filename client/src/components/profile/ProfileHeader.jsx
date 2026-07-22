const ProfileHeader = ({ user, memoryCount }) => {
  return (
    <div>
      {/* Cover Image */}
      <div className="h-56 w-full bg-gray-300">
        {user.coverImage && (
          <img
            src={user.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Section */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="-mt-16 flex items-end gap-5">

          {/* Profile Image */}
          <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
            {user.profileImage && (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* User Info */}
          <div className="pb-3">
            <h1 className="text-3xl font-bold">{user.name}</h1>

            <p className="text-gray-500">@{user.username}</p>

            {user.bio && (
              <p className="mt-2">{user.bio}</p>
            )}

            {user.location && (
              <p className="text-gray-600 mt-1">
                📍 {user.location}
              </p>
            )}

            <p className="mt-2 font-medium">
              {memoryCount} Memories
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
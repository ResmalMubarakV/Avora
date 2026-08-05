import { UserRound } from "lucide-react";

// ==========================================
// PROFILE HEADER COMPONENT
// ==========================================
/**
 * Renders the top header banner for the edit profile settings page.
 * Features an icon badge, page title, and a descriptive subtitle.
 */
const ProfileHeader = () => {
  return (
    <div
      className="
        flex
        flex-col
        gap-6

        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      {/* Left Section */}
      <div>
        {/* Badge */}
        <div
          className="
            inline-flex
            items-center
            gap-2

            rounded-full

            bg-blue-50

            px-4
            py-2

            text-sm
            font-medium
            text-[#3559D4]
          "
        >
          <UserRound size={18} />
          Edit Profile
        </div>

        {/* Title */}
        <h1
          className="
            mt-5

            text-3xl
            font-bold
            tracking-tight
            text-slate-900
          "
        >
          Manage Your Profile
        </h1>

        {/* Description */}
        <p
          className="
            mt-2

            max-w-2xl

            text-slate-500
          "
        >
          Keep your travel identity up to date. Update your profile
          photo, bio, location and social links so other travelers
          can know more about you.
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;
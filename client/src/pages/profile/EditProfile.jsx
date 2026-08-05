import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  getMyProfile,
  updateProfile,
  updateProfileImage,
  updateCoverImage,
  checkUsername,
} from "../../api/userApi";

import ProfileHeader from "../../components/edit-profile/ProfileHeader";
import BasicInformation from "../../components/edit-profile/BasicInformation";
import CoverUploader from "../../components/edit-profile/CoverUploader";
import AvatarUploader from "../../components/edit-profile/AvatarUploader";
import BioCard from "../../components/edit-profile/BioCard";
import SocialLinksCard from "../../components/edit-profile/SocialLinksCard";
import ProfilePreview from "../../components/edit-profile/ProfilePreview";
import ActionButtons from "../../components/edit-profile/ActionButtons";

// ==========================================
// GLOBAL CROSS-TAB PROFILE BROADCAST CHANNEL
// ==========================================
const profileChannel = new BroadcastChannel("avora_profile_channel");

export const notifyProfileOtherTabs = () => {
  profileChannel.postMessage("profile_updated");
  localStorage.setItem("avora_profile_updated", Date.now().toString());
};

// ==========================================
// EDIT PROFILE PAGE COMPONENT
// ==========================================
/**
 * Allows authenticated users to view and update their profile information, 
 * including avatars, cover photos, bio, social links, and cover scale/position adjustments. 
 * Features real-time debounced username availability verification and live profile previews.
 */
const EditProfile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState("idle"); // "idle" | "checking" | "available" | "taken"
  const [originalUsername, setOriginalUsername] = useState("");

  // --- Form State ---
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    location: "",
    bio: "",
    website: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    profileImage: null,
    existingProfileImage: "",
    coverImage: null,
    existingCoverImage: "",
    coverScale: 1,
    coverPosition: { x: 0, y: 0 },
  });

  // --- Fetch User Profile on Mount ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const user = await getMyProfile();

        setFormData({
          name: user.name || "",
          username: user.username || "",
          location: user.location || "",
          bio: user.bio || "",
          website: user.website || "",
          instagram: user.instagram || "",
          youtube: user.youtube || "",
          linkedin: user.linkedin || "",
          profileImage: null,
          existingProfileImage: user.profileImage || "",
          coverImage: null,
          existingCoverImage: user.coverImage || "",
          coverScale: user.coverScale || 1,
          coverPosition: user.coverPosition || { x: 0, y: 0 },
        });

        setOriginalUsername(user.username);
      } catch (error) {
        console.error(error);
        toast.error("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // --- Input Change Handler (Forces lowercase and removes spaces for usernames) ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "username" ? value.toLowerCase().replace(/\s/g, "") : value,
    }));
  };

  // --- Debounced Username Availability Checker ---
  useEffect(() => {
    const username = formData.username.trim().toLowerCase();

    if (!username || username.length < 3) {
      setUsernameStatus("idle");
      return;
    }

    if (username === originalUsername.toLowerCase()) {
      setUsernameStatus("available");
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setUsernameStatus("checking");
        const result = await checkUsername(username);
        setUsernameStatus(result.available ? "available" : "taken");
      } catch {
        setUsernameStatus("idle");
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [formData.username, originalUsername]);

  // --- Form Validation ---
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter your name.");
      return false;
    }

    if (!formData.username.trim()) {
      toast.error("Please enter a username.");
      return false;
    }

    if (usernameStatus === "checking") {
      toast.error("Please wait while we verify your username.");
      return false;
    }

    if (usernameStatus === "taken") {
      toast.error("Please choose another username.");
      return false;
    }

    return true;
  };

  // --- Form Submission Handler ---
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      let profileImage = formData.existingProfileImage;
      let coverImage = formData.existingCoverImage;

      // Upload new avatar image if selected
      if (formData.profileImage) {
        const imageResponse = await updateProfileImage(formData.profileImage);
        profileImage = imageResponse.profileImage;
      }

      // Upload new cover image if selected
      if (formData.coverImage) {
        const coverResponse = await updateCoverImage(formData.coverImage);
        coverImage = coverResponse.coverImage;
      }

      // Update basic profile details and cover transformation metadata
      const updatedUser = await updateProfile({
        name: formData.name,
        username: formData.username,
        location: formData.location,
        bio: formData.bio,
        website: formData.website,
        instagram: formData.instagram,
        youtube: formData.youtube,
        linkedin: formData.linkedin,
        coverScale: formData.coverScale,
        coverPosition: formData.coverPosition,
      });

      setFormData((prev) => ({
        ...prev,
        existingProfileImage: profileImage,
        existingCoverImage: coverImage,
        profileImage: null,
        coverImage: null,
      }));

      toast.success("Profile updated successfully.");

      // Broadcast profile updates across all open tabs/windows instantly
      notifyProfileOtherTabs();

      navigate(`/${updatedUser.username}`, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Unable to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <ProfileHeader />

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {/* Left Column: Form Sections */}
        <div className="space-y-6 xl:col-span-2">
          <BasicInformation
            formData={formData}
            handleChange={handleChange}
            usernameStatus={usernameStatus}
          />
          <CoverUploader
            formData={formData}
            setFormData={setFormData}
          />
          <AvatarUploader
            formData={formData}
            setFormData={setFormData}
          />
          <BioCard
            formData={formData}
            handleChange={handleChange}
          />
          <SocialLinksCard
            formData={formData}
            handleChange={handleChange}
          />
        </div>

        {/* Right Column: Sticky Preview and Actions (Desktop) */}
        <div className="hidden xl:block">
          <div className="sticky top-28 space-y-6">
            {/* Profile Live Preview Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <ProfilePreview formData={formData} />
            </div>

            {/* Action Buttons Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <ActionButtons
                loading={loading}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Action Buttons Toolbar */}
      <div className="xl:hidden">
        <ActionButtons
          loading={loading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default EditProfile;
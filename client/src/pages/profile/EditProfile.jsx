import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Lock, Unlock } from "lucide-react";

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
import PageTitle from "../../components/common/PageTitle";
import DiscardMemoryModal from "../../components/create-memory/DiscardMemoryModal";

// ==========================================
// PROFILE LOCK TOGGLE CARD COMPONENT
// ==========================================
const ProfileLockToggle = ({ formData, setFormData }) => {
  const isLocked = formData.isLocked ?? false;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex items-start justify-between gap-6">
        <div className="flex gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition ${isLocked ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"}`}>
            {isLocked ? <Lock size={22} /> : <Unlock size={22} />}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Lock Profile</h2>
            <p className="mt-1 text-sm text-slate-500">
              {isLocked 
                ? "Your profile is locked. Only your bio is visible to public visitors." 
                : "Your profile is public. Everyone can view your profile and travel memories."}
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          type="button"
          onClick={() => setFormData((prev) => ({ ...prev, isLocked: !prev.isLocked }))}
          className={`relative h-8 w-14 rounded-full transition-all duration-300 cursor-pointer shrink-0 ${
            isLocked ? "bg-[#3559D4]" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-300 ${
              isLocked ? "left-7" : "left-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

const EditProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const returnTo = location.state?.from || "/dashboard";

  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState("idle");
  const [originalUsername, setOriginalUsername] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    location: "",
    bio: "",
    website: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    isLocked: false,
    profileImage: null,
    existingProfileImage: "",
    coverImage: null,
    existingCoverImage: "",
    coverScale: 1,
    coverPosition: { x: 0, y: 0 },
  });

  // Automatically scroll to top on initial page load or redirect
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  // Intercept browser back button / swipe gestures safely via window history & popstate
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      if (hasChanges) {
        window.history.pushState(null, "", window.location.href);
        setShowDiscardModal(true);
      } else {
        navigate(-1);
      }
    };

    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasChanges, navigate]);

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
          isLocked: user.isLocked ?? false,
          profileImage: null,
          existingProfileImage: user.profileImage || "",
          coverImage: null,
          existingCoverImage: user.coverImage || "",
          coverScale: user.coverScale || 1,
          coverPosition: user.coverPosition || { x: 0, y: 0 },
        });

        setOriginalUsername(user.username);
        setHasChanges(false);
      } catch (error) {
        console.error(error);
        toast.error("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHasChanges(true);
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "username" ? value.toLowerCase().replace(/\s/g, "") : value,
    }));
  };

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

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter your name.");
      return false;
    }
    if (!formData.username.trim()) {
      toast.error("Please enter a username.");
      return false;
    }
    return true;
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowDiscardModal(true);
    } else {
      navigate(returnTo);
    }
  };

  const discardProfileChanges = () => {
    setShowDiscardModal(false);
    setHasChanges(false);
    navigate(returnTo);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      let profileImage = formData.existingProfileImage;
      let coverImage = formData.existingCoverImage;

      if (formData.profileImage) {
        const imageResponse = await updateProfileImage(formData.profileImage);
        profileImage = imageResponse.profileImage;
      }

      if (formData.coverImage) {
        const coverResponse = await updateCoverImage(formData.coverImage);
        coverImage = coverResponse.coverImage;
      }

      const updatedUser = await updateProfile({
        name: formData.name,
        username: formData.username,
        location: formData.location,
        bio: formData.bio,
        website: formData.website,
        instagram: formData.instagram,
        youtube: formData.youtube,
        linkedin: formData.linkedin,
        isLocked: formData.isLocked,
        coverScale: formData.coverScale,
        coverPosition: formData.coverPosition,
      });

      setHasChanges(false);
      setShowDiscardModal(false);
      toast.success("Profile updated successfully.");
      navigate(`/${updatedUser.username}`, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Unable to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageTitle title="Edit Profile" />
      <div>
        <button
          type="button"
          onClick={handleCancel}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </div>

      <ProfileHeader />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 items-start">
        <div className="xl:col-span-2 xl:h-[calc(100vh-12rem)] xl:overflow-y-auto xl:pr-4 space-y-6 scrollbar-hide">
          <BasicInformation
            formData={formData}
            handleChange={handleChange}
            usernameStatus={usernameStatus}
          />
          <ProfileLockToggle
            formData={formData}
            setFormData={(updater) => {
              setHasChanges(true);
              setFormData(updater);
            }}
          />
          <CoverUploader
            formData={formData}
            setFormData={(updater) => {
              setHasChanges(true);
              setFormData(updater);
            }}
          />
          <AvatarUploader
            formData={formData}
            setFormData={(updater) => {
              setHasChanges(true);
              setFormData(updater);
            }}
          />
          <BioCard
            formData={formData}
            handleChange={handleChange}
          />
          <SocialLinksCard
            formData={formData}
            handleChange={handleChange}
          />

          {/* Mobile & Tablet Action Buttons */}
          <div className="xl:hidden bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 mt-6">
            <ActionButtons
              loading={loading}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              buttonText="Save Changes"
            />
          </div>
        </div>

        <div className="hidden xl:block xl:col-span-1">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 flex flex-col xl:h-[calc(100vh-12rem)]">
            <div className="overflow-y-auto scrollbar-hide flex-1 pr-1 pb-4">
              <ProfilePreview formData={formData} />
            </div>

            <div className="pt-4 border-t border-slate-100 bg-white shrink-0">
              <ActionButtons
                loading={loading}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                buttonText="Save Changes"
              />
            </div>
          </div>
        </div>
      </div>

      <DiscardMemoryModal
        open={showDiscardModal}
        loading={loading}
        onClose={() => setShowDiscardModal(false)}
        onDiscard={discardProfileChanges}
        onPublish={handleSubmit}
      />
    </div>
  );
};

export default EditProfile;
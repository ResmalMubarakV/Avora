import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

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

const EditProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const returnTo = location.state?.from || "/dashboard";

  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState("idle");
  const [originalUsername, setOriginalUsername] = useState("");

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

  const handleChange = (e) => {
    const { name, value } = e.target;
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
        coverScale: formData.coverScale,
        coverPosition: formData.coverPosition,
      });

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
    </div>
  );
};

export default EditProfile;
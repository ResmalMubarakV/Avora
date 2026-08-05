import api from "./axios";

// ==========================================
// USER API SERVICES
// ==========================================

/**
 * Fetches the authenticated user's profile.
 * @returns {Promise<Object>} The user profile data.
 */
export const getMyProfile = async () => {
  const { data } = await api.get("/api/users/profile");
  return data;
};

/**
 * Updates the authenticated user's profile information.
 * @param {Object} profileData - The updated profile details.
 * @returns {Promise<Object>} The updated user profile data.
 */
export const updateProfile = async (profileData) => {
  const { data } = await api.put("/api/users/profile", profileData);
  return data;
};

/**
 * Updates the user's profile image.
 * @param {File} imageFile - The new profile image file.
 * @returns {Promise<Object>} The updated user profile data containing the new image URL.
 */
export const updateProfileImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const { data } = await api.put("/api/users/profile/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

/**
 * Updates the user's cover image.
 * @param {File} image - The new cover image file.
 * @returns {Promise<Object>} The updated user profile data containing the new cover image URL.
 */
export const updateCoverImage = async (image) => {
  const formData = new FormData();
  formData.append("image", image);

  const response = await api.put("/api/users/profile/cover", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/**
 * Checks if a requested username is available.
 * @param {string} username - The username to validate.
 * @returns {Promise<Object>} An object indicating availability status.
 */
export const checkUsername = async (username) => {
  const response = await api.get(`/api/users/check-username?username=${username}`);
  return response.data;
};
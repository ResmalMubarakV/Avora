import api from "./axios";

export const getMyProfile = async () => {

    const { data } = await api.get(
        "/api/users/profile"
    );

    return data;

};

export const updateProfile = async (profileData) => {

    const { data } = await api.put(
        "/api/users/profile",
        profileData
    );

    return data;

};

export const updateProfileImage = async (imageFile) => {

    const formData = new FormData();

    formData.append(
        "image",
        imageFile
    );

    const { data } = await api.put(
        "/api/users/profile/image",
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data",
            },
        }
    );

    return data;

};

export const updateCoverImage = async (image) => {

    const formData = new FormData();

    formData.append("image", image);

    const response = await api.put(

        "/api/users/profile/cover",

        formData,

        {

            headers: {

                "Content-Type":
                    "multipart/form-data",

            },

        }

    );

    return response.data;

};

export const checkUsername = async (
    username
) => {

    const response =
        await api.get(
            `/api/users/check-username?username=${username}`
        );

    return response.data;

};
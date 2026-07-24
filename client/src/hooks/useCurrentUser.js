import { useEffect, useState } from "react";
import { getMyProfile } from "../api/userApi";

const useCurrentUser = () => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUser = async () => {
        try {

            setLoading(true);

            const data = await getMyProfile();

            setUser(data);

            setError("");

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to fetch profile."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return {
        user,
        loading,
        error,
        fetchUser,
    };
};

export default useCurrentUser;
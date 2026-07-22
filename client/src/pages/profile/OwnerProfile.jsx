import { useState, useEffect } from "react";
import api from "../../api/axios";

const Profile = () => {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");

   const fetchProfile = async () => {
    try {
      const {data} = await api.get("/api/users/profile");
      setUser(data);
    } catch (error) {
      console.error(error.message)
      setError(error.message);
    } finally {
      setLoading(false);
    }
   }

   useEffect(() => {
      fetchProfile();
   }, []);

  if(loading) {
     return <h1>Loading...</h1>;
  }
  if(error){
    return <h1>{error}</h1>;
  }
  return (
    <h1>{user.name}</h1>
  )
};

export default Profile;
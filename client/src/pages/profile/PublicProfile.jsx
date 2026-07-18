import { useState, useEffect  } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

const PublicProfile = () => {
   const { username } = useParams();
   const [user, setUser] = useState(null);
   const [memories, setMemories] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");

   const fetchProfile = async () => {
    try {
      const {data} = await api.get(`/api/public/${username}`);
      setUser(data.user);
      setMemories(data.memories)
    } catch (error) {
      console.error(error.message)
      setError(error.message);
    } finally {
      setLoading(false);
    }
   }

   useEffect(() => {
      fetchProfile();
   }, [username]);

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

export default PublicProfile;
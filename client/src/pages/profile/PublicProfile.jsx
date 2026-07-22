import { useState, useEffect  } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import ProfileHeader from "../../components/profile/ProfileHeader";
import MemoryCard from "../../components/memory/MemoryCard";

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
      setMemories(data.memories);
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
     <div>
    <ProfileHeader
      user={user}
      memoryCount={memories.length}
    />

    <div className="max-w-6xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {memories.map((memory) => (
        <MemoryCard
          key={memory._id}
          memory={memory}
          username={user.username}
        />
      ))}
    </div>
  </div>
);
};

export default PublicProfile;
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import MemoryHero from "../memory/MemoryHero";
import { Compass } from "lucide-react";
import Lightbox from "../../components/memory/Lightbox";


const PublicMemory = () => {

    const { username, slug } = useParams();

    const [memory, setMemory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const openGallery = (index) => {
    setSelectedIndex(index);
    setIsOpen(true);
    };

    const goToImage = (index) => {
    setSelectedIndex(index);
    };

    const nextImage = () => {
        setSelectedIndex((prev) => {
            if (prev === memory.media.length - 1) {
                return 0;
            }

            return prev + 1;
        });
    };

    const previousImage = () => {
        setSelectedIndex((prev) => {
            if (prev === 0) {
                return memory.media.length - 1;
            }

            return prev - 1;
        });
    };

    useEffect(() => {

        const fetchMemory = async () => {

            try {

                const response = await api.get(
                    `/api/public/${username}/${slug}`
                );

                setMemory(response.data);

            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Something went wrong"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchMemory();

    }, [username, slug]);

    if (loading) return <h1>Loading...</h1>;

    if (error) return <h1>{error}</h1>;

    return (
        <main className="max-w-[1440px] mx-auto px-8 lg:px-12 py-12">

            <MemoryHero
                memory={memory}
                username={username}
                openGallery={openGallery}
            />

            {isOpen && (
            <Lightbox
                media={memory.media}
                selectedIndex={selectedIndex}
                onClose={() => setIsOpen(false)}
                nextImage={nextImage}
                goToImage={goToImage}
                previousImage={previousImage}
            />
        )}

            <section className="mt-10">

                <div className="flex items-center gap-3 mb-6">

                    <Compass
                        size={24}
                        className="text-amber-500"
                    />

                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Journey Story
                    </h2>

                </div>


                <div className="mt-6 mb-10 border-t border-gray-100" />

                <div className="mt-5">
                    <p className="text-lg leading-10 text-gray-700 whitespace-pre-line">
                        {memory.description}
                    </p>
                </div>

            </section>

        </main>
    );
};

export default PublicMemory;
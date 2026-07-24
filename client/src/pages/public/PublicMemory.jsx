import { useEffect, useState } from "react";
import { getMyProfile } from "../../api/userApi";
import {
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

import api from "../../api/axios";

import MemoryHero from "../../components/memory/MemoryHero";
import Lightbox from "../../components/memory/Lightbox";

import { Compass } from "lucide-react";

const PublicMemory = () => {
    const navigate = useNavigate();

    const { username, slug } = useParams();

    const [searchParams, setSearchParams] = useSearchParams();
    const [currentUser, setCurrentUser] = useState(null);
    const [memory, setMemory] = useState(null);
    const [loading, setLoading] = useState(true);

    const imageParam = searchParams.get("image");

    const [isOpen, setIsOpen] = useState(imageParam !== null);

    const [selectedIndex, setSelectedIndex] = useState(
        imageParam ? Number(imageParam) : 0
    );

    const openGallery = (index) => {
        setSelectedIndex(index);
        setIsOpen(true);

        setSearchParams(
            {
                image: index.toString(),
            },
            {
                replace: false,
            }
        );
    };

    const goToImage = (index) => {
        setSelectedIndex(index);

        setSearchParams(
            {
                image: index.toString(),
            },
            {
                replace: false,
            }
        );
    };

    const nextImage = () => {
        setSelectedIndex((prev) => {
            const next =
                prev === memory.media.length - 1
                    ? 0
                    : prev + 1;

            setSearchParams(
                {
                    image: next.toString(),
                },
                {
                    replace: false,
                }
            );

            return next;
        });
    };

    const previousImage = () => {
        setSelectedIndex((prev) => {
            const previous =
                prev === 0
                    ? memory.media.length - 1
                    : prev - 1;

            setSearchParams(
                {
                    image: previous.toString(),
                },
                {
                    replace: false,
                }
            );

            return previous;
        });
    };

        useEffect(() => {

    const fetchCurrentUser = async () => {

            try {

                const user = await getMyProfile();

                setCurrentUser(user);

            } catch {

                // Visitor is not logged in
                setCurrentUser(null);

            }

        };

        fetchCurrentUser();

    }, []);

        useEffect(() => {

        const fetchMemory = async () => {

            try {

                const response = await api.get(
                    `/api/public/${username}/${slug}`
                );

                setMemory(response.data);

            } catch (error) {

                if (error.response?.status === 403) {
                    navigate("/403", { replace: true });
                    return;
                }

                if (error.response?.status === 404) {
                    navigate("/404", { replace: true });
                    return;
                }

                console.error(error);

            } finally {

                setLoading(false);

            }

        };

        fetchMemory();

    }, [username, slug, navigate]);


    const isOwner =
    currentUser?._id === memory?.user;


    useEffect(() => {

        if (!memory) return;

        const image = searchParams.get("image");

        if (image === null) {

            setIsOpen(false);

            return;

        }
        

        const index = Number(image);

        if (
            Number.isNaN(index) ||
            index < 0 ||
            index >= memory.media.length
        ) {

            setSearchParams({}, { replace: true });

            return;

        }

        setSelectedIndex(index);

        setIsOpen(true);

    }, [memory, searchParams, setSearchParams]);



    if (loading) {

        return (
            <h1 className="text-center mt-20 text-lg">
                Loading...
            </h1>
        );

    }



    if (!memory) {

        return null;

    }

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
                    nextImage={nextImage}
                    previousImage={previousImage}
                    goToImage={goToImage}
                    canDownload={isOwner}
                    memoryTitle={memory.title}
                    onClose={() => {

                        setIsOpen(false);

                        setSearchParams({}, {
                            replace: false,
                        });

                    }}
                />
            )}

            <section className="mt-10">

                <div className="flex items-center gap-3 mb-6">

                    <Compass
                        size={24}
                        className="text-amber-500"
                    />

                    <h2
                        className="
                            text-3xl
                            font-bold
                            tracking-tight
                            text-gray-900
                        "
                    >
                        Journey Story
                    </h2>

                </div>

                <div className="mt-6 mb-10 border-t border-gray-100" />

                <div className="mt-5">

                    <p
                        className="
                            text-lg
                            leading-10
                            text-gray-700
                            whitespace-pre-line
                        "
                    >
                        {memory.description}
                    </p>

                </div>

            </section>

        </main>
    );
};

export default PublicMemory;
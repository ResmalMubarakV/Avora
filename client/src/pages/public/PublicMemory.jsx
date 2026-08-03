import { useEffect, useState } from "react";
import { getMyProfile } from "../../api/userApi";
import {
    useNavigate,
    useParams,
    useSearchParams,
    useLocation,
} from "react-router-dom";

import api from "../../api/axios";

import MemoryHero from "../../components/memory/MemoryHero";
import Lightbox from "../../components/memory/Lightbox";

import { Compass } from "lucide-react";

const PublicMemory = () => {
    const navigate = useNavigate();
    const location = useLocation();

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
        if (prev >= memory.media.length - 1) {
            return prev;
        }

        const next = prev + 1;

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
        if (prev <= 0) {
            return prev;
        }

        const previous = prev - 1;

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
    <main className="min-h-screen bg-[#F8FBFF]">

        {/* Hero */}

        <section className="relative overflow-hidden">

            {/* Soft Background */}

            <div className="absolute inset-0 pointer-events-none">

                {/* Top Blue Tint */}

                <div
                    className="
                        absolute
                        inset-x-0
                        top-0
                        h-[360px]
                        bg-gradient-to-b
                        from-sky-100
                        via-blue-50
                        to-transparent
                    "
                />

                {/* Left Glow */}

                <div
                    className="
                        absolute
                        -left-32
                        top-0
                        h-72
                        w-72
                        rounded-full
                        bg-sky-300/20
                        blur-[140px]
                    "
                />

                {/* Right Glow */}

                <div
                    className="
                        absolute
                        right-0
                        top-0
                        h-80
                        w-80
                        rounded-full
                        bg-cyan-200/30
                        blur-[170px]
                    "
                />

            </div>

            {/* Hero Content */}

            <div
                className="
                    relative
                    mx-auto
                    max-w-[1500px]
                    px-5
                    sm:px-8
                    lg:px-10
                    xl:px-14
                    pt-8
                    lg:pt-12
                    pb-12
                "
            >

                <MemoryHero
                    memory={memory}
                    username={username}
                    openGallery={openGallery}
                    isOwner={isOwner}
                    locationState={location.state}
                />

            </div>

        </section>

        {/* Story Section */}

        <section
            className="
                mx-auto
                max-w-[1500px]
                px-5
                sm:px-8
                lg:px-10
                xl:px-14
                pb-24
            "
        >

            <div
                className="
                    overflow-hidden
                    rounded-[32px]
                    border
                    border-slate-200
                    bg-white
                    shadow-xl
                "
            >

                <div
                    className="
                        px-6
                        py-8
                        sm:px-10
                        sm:py-10
                        lg:px-14
                        lg:py-14
                    "
                >

                    {/* Heading */}

                    <div className="flex items-center gap-4">

                        <div
                            className="
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-2xl
                                bg-gradient-to-br
                                from-sky-500
                                to-blue-600
                                text-white
                                shadow-md
                            "
                        >
                            <Compass size={24} />
                        </div>

                        <div>

                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[0.30em]
                                    text-sky-600
                                "
                            >
                                Travel Journal
                            </p>

                            <h2
                                className="
                                    mt-1
                                    text-3xl
                                    font-bold
                                    tracking-tight
                                    text-slate-900
                                "
                            >
                                Journey Story
                            </h2>

                        </div>

                    </div>

                    {/* Divider */}

                    <div
                        className="
                            my-8
                            h-px
                            bg-gradient-to-r
                            from-transparent
                            via-slate-200
                            to-transparent
                        "
                    />

                    {/* Story */}

                    <div
                        className="
                            w-full
                            text-[17px]
                            leading-9
                            text-slate-600
                            whitespace-pre-line
                            lg:text-[18px]
                            lg:leading-10
                        "
                    >
                        {memory.description}
                    </div>

                </div>

            </div>

        </section>
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

    </main>
);
}

export default PublicMemory;
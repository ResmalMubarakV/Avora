import MemoryInfo from "./MemoryInfo";
import CoverImage from "./CoverImage";
import MediaPreview from "./MediaPreview";

const MemoryHero = ({ username, memory, openGallery }) => {
    return (
        <section
            className="
                grid
                grid-cols-1
                xl:grid-cols-12
                gap-8
                xl:gap-14
                items-start
            "
        >
            {/* Left */}

            <div className="xl:col-span-5">

                <div
                    className="
                        rounded-[32px]
                        border
                        border-slate-200
                        bg-white
                        shadow-xl
                        overflow-hidden
                    "
                >
                    <div className="p-6 sm:p-8 lg:p-10">

                        <MemoryInfo
                            username={username}
                            memory={memory}
                        />

                    </div>

                </div>

            </div>

            {/* Right */}

            <div className="xl:col-span-7">

                <CoverImage
                    image={memory.coverImage}
                    onClick={() => openGallery(0)}
                />

                <div className="mt-6">

                    <MediaPreview
                        media={memory.media}
                        onOpenGallery={openGallery}
                    />

                </div>

            </div>

        </section>
    );
};

export default MemoryHero;
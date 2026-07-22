import MemoryInfo from "./MemoryInfo";
import CoverImage from "./CoverImage";
import MediaPreview from "./MediaPreview";

const MemoryHero = ({ username, memory, openGallery }) => {
    return (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">

            {/* Left */}

            <div className="lg:col-span-5">
                <MemoryInfo
                    username={username}
                    memory={memory}
                />
            </div>

            {/* Right */}

            <div className="lg:col-span-7 flex justify-end">

                <div className="w-full max-w-[720px]">

                    <CoverImage
                        image={memory.coverImage}
                        onClick={() => openGallery(0)}
                    />

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
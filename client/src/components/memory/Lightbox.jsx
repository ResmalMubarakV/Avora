import { X , Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Lightbox = ({ media, selectedIndex, onClose, nextImage, previousImage, goToImage }) => {
    const selectedMedia = media[selectedIndex];
    const thumbnailRefs = useRef([]);
    const [imageLoading, setImageLoading] = useState(true);

const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") {
        nextImage();
    }

    if (event.key === "ArrowLeft") {
        previousImage();
    }

    if (event.key === "Escape") {
        onClose();
    }
};

useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
        document.body.style.overflow = "";
    };
}, []);


useEffect(() => {
    setImageLoading(true);
}, [selectedIndex]);

useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
        window.removeEventListener("keydown", handleKeyDown);
    };
}, []);

useEffect(() => {
    thumbnailRefs.current[selectedIndex]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
    });
}, [selectedIndex]);

useEffect(() => {
    const previousIndex =
        (selectedIndex - 1 + media.length) % media.length;

    const nextIndex =
        (selectedIndex + 1) % media.length;

    const previousImage = new Image();
    previousImage.src = media[previousIndex].url;

    const nextImage = new Image();
    nextImage.src = media[nextIndex].url;

}, [selectedIndex, media]);

    return (
        <div
            className="
                    fixed
                    inset-0
                    z-50
                    bg-black/96
                    flex
                    flex-col
            "
        >

            <div className="flex justify-end items-center gap-4 p-6">


                {/* Close Button */}
            <button
                onClick={onClose}
                className="
                    text-white
                    hover:opacity-80
                "
            >
                <X size={32} />
            </button>
            </div>



            <div className="flex-1 flex items-center justify-center relative">

                {/* Image + Previous + Next */}

            <div className="max-h-[65vh] max-w-full object-contain">

                {imageLoading && (
                    <div
                        className="
                            absolute
                            inset-0
                            flex
                            items-center
                            justify-center
                        "
                    >
                        <div
                            className="
                                h-10
                                w-10
                                animate-spin
                                rounded-full
                                border-4
                                border-white/30
                                border-t-white
                            "
                        />
                    </div>
                )}


                <img
                    src={selectedMedia.url}
                    alt="Memory"
                    onLoad={() => setImageLoading(false)}
                    className={`max-h-[65vh] max-w-full object-contain transition-opacity duration-300
                            ${imageLoading ? "opacity-0" : "opacity-100"}
                        `}
                />
            </div>

            <button
                onClick={previousImage}
                className="
                    absolute
                    left-6
                    top-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-white/15
                    p-4
                    text-white
                    hover:bg-white/20
                    backdrop-blur-md
                    transition
                "
            >
                <ChevronLeft size={32} />
            </button>

            <button
                onClick={nextImage}
                className="
                    absolute
                    right-6
                    top-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-white/15
                    p-4
                    text-white
                    hover:bg-white/20
                    backdrop-blur-md
                    transition
                "
            >
                <ChevronRight size={32} />
            </button>

            </div>

            
            
            <div className="pb-6 flex flex-col items-center gap-4">
                {/* Thumbnails + Counter */}

            <div className="flex gap-3 overflow-x-auto whitespace-nowrap w-full max-w-md px-2">
                {media.map((item, index) => (
                    <img
                        key={index}
                        ref={(el) => (thumbnailRefs.current[index] = el)}
                        src={item.url}
                        alt={`Thumbnail ${index + 1}`}
                        onClick={() => goToImage(index)}
                        className={`
                                    h-16
                                    w-16
                                    shrink-0
                                    rounded-md
                                    object-cover
                                    cursor-pointer
                                    transition-all

                                    ${
                                        selectedIndex === index
                                            ? "ring-2 ring-white scale-110 opacity-100"
                                            : "opacity-40 hover:opacity-100"
                                    }
                                `}
                    />
                ))}
            </div>

            <div className="
                        rounded-full
                        bg-black/60
                        px-4
                        py-1
                        text-xs
                        text-white">
                {selectedIndex + 1} / {media.length}
            </div>
            </div> 
        </div>
    );
};

export default Lightbox;
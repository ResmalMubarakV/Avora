import Thumbnail from "./Thumbnail";
import ViewGalleryCard from "./ViewGalleryCard";

// ==========================================
// MEDIA PREVIEW COMPONENT
// ==========================================
/**
 * Renders a perfectly uniform 4-column grid preview for media items, 
 * ensuring all thumbnails and the gallery card are equal in size.
 */
const MediaPreview = ({ media, onOpenGallery }) => {
    const preview = media.slice(0, 3);
    const remaining = media.length - 3;
    const cover = media[3];

    return (
        <div
            className="
                grid
                grid-cols-4
                gap-2
                sm:gap-3
                lg:gap-4
                mt-4
                w-full
            "
        >
            {preview.map((item, index) => (
                <div 
                    key={item.publicId || index} 
                    className="w-full aspect-square overflow-hidden rounded-xl sm:rounded-2xl"
                >
                    <Thumbnail
                        item={item}
                        onClick={() => onOpenGallery(index)}
                    />
                </div>
            ))}

            {media.length > 3 && (
                <div className="w-full aspect-square overflow-hidden rounded-xl sm:rounded-2xl">
                    <ViewGalleryCard
                        cover={cover}
                        remaining={remaining}
                        onClick={() => onOpenGallery(3)}
                    />
                </div>
            )}
        </div>
    );
};

export default MediaPreview;
import Thumbnail from "./Thumbnail";
import ViewGalleryCard from "./ViewGalleryCard";

const MediaPreview = ({ media, onOpenGallery }) => {

const preview = media.slice(0, 3);

const remaining = media.length - 3;

const cover = media[3];

    return (

        <div className="grid grid-cols-4 gap-4 mt-5">

            {preview.map((item, index) => (

                <Thumbnail
                    key={item.publicId}
                    item={item}
                    onClick={() => onOpenGallery(index)}
                />

            ))}

            {media.length > 3 && (

                <ViewGalleryCard
                    cover={cover}
                    remaining={remaining}
                    onClick={() => onOpenGallery(3)}
                />

            )}

        </div>

    );

};

export default MediaPreview;
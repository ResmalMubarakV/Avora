const Thumbnail = ({ item, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="group
                relative
                overflow-hidden
                rounded-2xl
                aspect-square
                focus:outline-none"
        >
            <img
            src={item.url}
            alt="Memory"
            className="
                w-full
                h-full
                object-cover
                transition-all
                duration-700
                group-hover:scale-110
                "
            />
        </button>
    );
};

export default Thumbnail;
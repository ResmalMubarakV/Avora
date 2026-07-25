import { Link } from "react-router-dom";

const MemoryCard = ({ memory, username }) => {
    return (
        <Link to={`/${username}/${memory.slug}`}>
            <article
                className="
                    overflow-hidden
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    shadow-md
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-xl
                "
            >
                {/* Cover Image */}

                <div className="h-64 overflow-hidden bg-slate-100">

                    {memory.coverImage && (
                        <img
                            src={memory.coverImage}
                            alt={memory.title}
                            className="
                                h-full
                                w-full
                                object-cover
                                transition-transform
                                duration-500
                                hover:scale-105
                            "
                        />
                    )}

                </div>

                {/* Content */}

                <div className="p-6">

                    {/* Title */}

                    <h2
                        className="
                            text-2xl
                            font-bold
                            tracking-tight
                            text-slate-900
                        "
                    >
                        {memory.title}
                    </h2>

                    {/* Description */}

                    <p
                        className="
                            mt-3
                            whitespace-pre-line
                            break-words
                            text-base
                            leading-7
                            text-slate-600
                        "
                    >
                        {memory.description}
                    </p>

                    {/* Footer */}

                    <div
                        className="
                            mt-6
                            flex
                            items-center
                            justify-between
                            border-t
                            border-slate-200
                            pt-4
                            text-sm
                            text-slate-500
                        "
                    >

                        <div className="flex items-center gap-2">
                            <span>📍</span>
                            <span>{memory.location}</span>
                        </div>

                        <div>
                            {new Date(memory.startDate).toLocaleDateString(
                                "en-IN",
                                {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                }
                            )}
                        </div>

                    </div>

                </div>

            </article>
        </Link>
    );
};

export default MemoryCard;
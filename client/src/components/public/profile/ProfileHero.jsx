import { Link } from "react-router-dom";

import {
    MapPin,
    Globe,
    Pencil,
    CalendarDays,
} from "lucide-react";

import {
    FaInstagram,
    FaYoutube,
    FaLinkedin,
} from "react-icons/fa";

const ProfileHero = ({
    user,
    isOwner,
    memories,
}) => {

    const initials = user?.name
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (

        <section className="bg-white">

            {/* Cover */}

            <div
                className="
                    relative

                    h-64

                    overflow-hidden

                    sm:h-80

                    lg:h-[360px]
                "
            >

                {user?.coverImage ? (

                    <img
                        src={user.coverImage}
                        alt="Cover"
                        className="
                            h-full
                            w-full
                            object-cover
                        "
                    />

                ) : (

                    <div
                        className="
                            h-full
                            w-full

                            bg-gradient-to-br
                            from-slate-950
                            via-slate-800
                            to-slate-700
                        "
                    />

                )}

                {/* Overlay */}

                <div
                    className="
                        absolute
                        inset-0

                        bg-gradient-to-b
                        from-black/20
                        via-black/40
                        to-black/60
                    "
                />

            </div>

            {/* Content */}

            <div
                className="
                    mx-auto
                    max-w-7xl

                    px-6
                "
            >

                <div
                    className="
                        relative

                        -mt-24

                        rounded-3xl

                        bg-white

                        px-8
                        pb-10
                        pt-8

                        shadow-xl
                    "
                >

                    <div
                        className="
                            flex
                            flex-col

                            gap-8

                            lg:flex-row
                            lg:items-start
                            lg:justify-between
                        "
                    >

                        {/* LEFT SIDE */}

                        <div
                            className="
                                flex
                                flex-col

                                items-center

                                gap-6

                                sm:flex-row
                                sm:items-start
                            "
                        >

                            {/* Avatar */}

                            <div
                                className="
                                    -mt-24

                                    h-44
                                    w-44

                                    shrink-0

                                    overflow-hidden

                                    rounded-full

                                    border-[6px]
                                    border-white

                                    bg-slate-200

                                    shadow-2xl
                                "
                            >

                                {user?.profileImage ? (

                                    <img
                                        src={user.profileImage}
                                        alt={user.name}
                                        className="
                                            h-full
                                            w-full
                                            object-cover
                                        "
                                    />

                                ) : (

                                    <div
                                        className="
                                            flex
                                            h-full
                                            w-full
                                            items-center
                                            justify-center

                                            bg-slate-300

                                            text-6xl
                                            font-bold
                                            text-slate-700
                                        "
                                    >

                                        {initials}

                                    </div>

                                )}

                            </div>

                            {/* Profile Details */}

                            <div
                                className="
                                    flex-1

                                    text-center

                                    sm:pt-4

                                    sm:text-left
                                "
                            >

                                {/* Name */}

                                <h1
                                    className="
                                        text-4xl
                                        font-bold
                                        tracking-tight
                                        text-slate-900
                                    "
                                >

                                    {user.name}

                                </h1>

                                {/* Username */}

                                <p
                                    className="
                                        mt-2

                                        text-lg

                                        text-slate-500
                                    "
                                >

                                    @{user.username}

                                </p>

                                {/* Location */}

                                {user.location && (

                                    <div
                                        className="
                                            mt-5

                                            flex
                                            items-center
                                            justify-center

                                            gap-2

                                            text-slate-600

                                            sm:justify-start
                                        "
                                    >

                                        <MapPin size={18} />

                                        <span>

                                            {user.location}

                                        </span>

                                    </div>

                                )}

                                {/* Joined */}

                                <div
                                    className="
                                        mt-3

                                        flex
                                        items-center
                                        justify-center

                                        gap-2

                                        text-slate-500

                                        sm:justify-start
                                    "
                                >

                                    <CalendarDays size={17} />

                                    <span>

                                        Joined{" "}
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleDateString(
                                            "en-US",
                                            {
                                                month: "long",
                                                year: "numeric",
                                            }
                                        )}

                                    </span>

                                </div>
                                                                {/* Bio */}

                                {user.bio && (

                                    <p
                                        className="
                                            mt-6

                                            max-w-2xl

                                            text-[15px]
                                            leading-7
                                            text-slate-600
                                        "
                                    >

                                        {user.bio}

                                    </p>

                                )}

                                {/* Social Links */}

                                {(user.website ||
                                    user.instagram ||
                                    user.youtube ||
                                    user.linkedin) && (

                                    <div
                                        className="
                                            mt-7

                                            flex
                                            flex-wrap

                                            justify-center

                                            gap-3

                                            sm:justify-start
                                        "
                                    >

                                        {user.website && (

                                            <a
                                                href={user.website}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="
                                                    flex
                                                    h-11
                                                    w-11
                                                    items-center
                                                    justify-center

                                                    rounded-full

                                                    bg-slate-100

                                                    text-slate-700

                                                    transition-all

                                                    hover:bg-[#3559D4]
                                                    hover:text-white
                                                "
                                            >

                                                <Globe size={18} />

                                            </a>

                                        )}

                                        {user.instagram && (

                                            <a
                                                href={user.instagram}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="
                                                    flex
                                                    h-11
                                                    w-11
                                                    items-center
                                                    justify-center

                                                    rounded-full

                                                    bg-slate-100

                                                    text-slate-700

                                                    transition-all

                                                    hover:bg-pink-500
                                                    hover:text-white
                                                "
                                            >

                                                <FaInstagram size={18} />

                                            </a>

                                        )}

                                        {user.youtube && (

                                            <a
                                                href={user.youtube}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="
                                                    flex
                                                    h-11
                                                    w-11
                                                    items-center
                                                    justify-center

                                                    rounded-full

                                                    bg-slate-100

                                                    text-slate-700

                                                    transition-all

                                                    hover:bg-red-500
                                                    hover:text-white
                                                "
                                            >

                                                <FaYoutube size={18} />

                                            </a>

                                        )}

                                        {user.linkedin && (

                                            <a
                                                href={user.linkedin}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="
                                                    flex
                                                    h-11
                                                    w-11
                                                    items-center
                                                    justify-center

                                                    rounded-full

                                                    bg-slate-100

                                                    text-slate-700

                                                    transition-all

                                                    hover:bg-blue-600
                                                    hover:text-white
                                                "
                                            >

                                                <FaLinkedin size={18} />

                                            </a>

                                        )}

                                    </div>

                                )}

                            </div>

                        </div>

                        {/* RIGHT */}

                        <div
                            className="
                                flex
                                flex-col
                                items-center

                                gap-6

                                lg:items-end
                            "
                        >

                            {isOwner && (

                                <Link
                                    to="/profile/edit"
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2

                                        rounded-xl

                                        border
                                        border-[#3559D4]

                                        bg-white

                                        px-6
                                        py-3

                                        font-semibold

                                        text-[#3559D4]

                                        transition-all

                                        hover:bg-[#3559D4]
                                        hover:text-white
                                    "
                                >

                                    <Pencil size={18} />

                                    Edit Profile

                                </Link>

                            )}

                            {isOwner && (

                                <div
                                >


                            {/* Stats */}

                            <div
                                className="
                                    grid
                                    grid-cols-3

                                    gap-5

                                    rounded-2xl

                                    border
                                    border-slate-200

                                    bg-slate-50

                                    px-6
                                    py-5
                                "
                            >

                                <div className="text-center">

                                    <h3 className="text-2xl font-bold text-slate-900">

                                        {memories.length}

                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">

                                        Memories

                                    </p>

                                </div>

                                <div className="text-center">

                                    <h3 className="text-2xl font-bold text-slate-900">

                                        {memories.filter(m => m.isPublic).length}

                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">

                                        Public

                                    </p>

                                </div>

                                <div className="text-center">

                                    <h3 className="text-2xl font-bold text-slate-900">

                                        {memories.filter(m => !m.isPublic).length}


                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">

                                        Private

                                    </p>

                                </div>

                            </div>

                            </div>

)}

                        </div>
                  </div>

                </div>

            </div>

        </section>

    );

};

export default ProfileHero;
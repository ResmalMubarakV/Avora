const ProfileHero = ({ user }) => {
    const initials = user?.name
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <section className="relative">

            {/* Cover */}
            <div className="relative h-[320px] overflow-hidden sm:h-[380px] lg:h-[450px]">

                {user?.coverImage ? (
                    <img
                        src={user.coverImage}
                        alt={`${user.name} Cover`}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div
                        className="
                            h-full
                            w-full
                            bg-gradient-to-br
                            from-slate-950
                            via-sky-950
                            to-slate-800
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
                        to-black/70
                    "
                />
            </div>

            {/* Profile */}
            <div className="relative mx-auto max-w-7xl px-5 sm:px-8">

                <div
                    className="
                        -mt-24
                        flex
                        flex-col
                        items-center
                        text-center
                        lg:-mt-28
                    "
                >

                    {/* Avatar */}
                    <div
                        className="
                            h-40
                            w-40
                            overflow-hidden
                            rounded-full
                            border-4
                            border-white
                            bg-slate-200
                            shadow-2xl
                            sm:h-44
                            sm:w-44
                        "
                    >

                        {user?.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt={user.name}
                                className="h-full w-full object-cover"
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
                                    text-5xl
                                    font-bold
                                    text-slate-700
                                "
                            >
                                {initials}
                            </div>
                        )}

                    </div>

                    {/* Name */}

                    <h1
                        className="
                            mt-6
                            text-3xl
                            font-bold
                            tracking-tight
                            text-slate-900
                            sm:text-4xl
                            lg:text-5xl
                        "
                    >
                        {user.name}
                    </h1>

                    {/* Username */}

                    <p className="mt-2 text-lg text-slate-500">
                        @{user.username}
                    </p>

                    {/* Location */}

                    {user.location && (
                        <p className="mt-4 text-base text-slate-600">
                            📍 {user.location}
                        </p>
                    )}

                    {/* Bio */}

                    {user.bio && (
                        <p
                            className="
                                mt-6
                                max-w-3xl
                                text-base
                                leading-8
                                text-slate-600
                                sm:text-lg
                            "
                        >
                            {user.bio}
                        </p>
                    )}

                </div>

            </div>

        </section>
    );
};

export default ProfileHero;
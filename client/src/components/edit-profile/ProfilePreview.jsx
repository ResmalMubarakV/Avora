import {
    MapPin,
    Globe,
    UserRound,
} from "lucide-react";

import {
    FaInstagram,
    FaYoutube,
    FaLinkedin,
} from "react-icons/fa";

import { useMemo } from "react";

const ProfilePreview = ({ formData }) => {

    const imagePreview = useMemo(() => {

    if (!formData.profileImage) {
        return formData.existingProfileImage || "";
    }

    return URL.createObjectURL(formData.profileImage);

}, [
    formData.profileImage,
    formData.existingProfileImage,
]);

    const coverPreview = useMemo(() => {

    if (!formData.coverImage) {
        return formData.existingCoverImage || "";
    }

    return URL.createObjectURL(formData.coverImage);

}, [
    formData.coverImage,
    formData.existingCoverImage,
]);

    const socials = [

    {
        icon: Globe,
        value: formData.website,
    },

    {
        icon: FaInstagram,
        value: formData.instagram,
    },

    {
        icon: FaYoutube,
        value: formData.youtube,
    },

    {
        icon: FaLinkedin,
        value: formData.linkedin,
    },

];

    return (

        <div className="space-y-8">

            {/* Header */}

            <div>

                <h2
                    className="
                        text-xl
                        font-semibold
                        text-slate-900
                    "
                >

                    Live Preview

                </h2>

                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-500
                    "
                >

                    This is how your profile will appear to visitors.

                </p>

            </div>

            {/* Card */}

            <div
                className="
                    overflow-hidden

                    rounded-3xl

                    border
                    border-slate-200

                    bg-white

                    shadow-sm
                "
            >

                {/* Banner */}

                <div
                    className="
                        relative
                        h-32
                        overflow-hidden
                    "
                >

                    {coverPreview ? (

                        <img
                            src={coverPreview}
                            alt="Cover Preview"
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

                                bg-gradient-to-r
                                from-[#3559D4]
                                via-[#5476E8]
                                to-[#8FA6FF]
                            "
                        />

                    )}

                </div>

                {/* Avatar */}

                <div className="relative z-10 -mt-16 flex justify-center">

                    <div
                        className="
                            flex
                            h-32
                            w-32
                            items-center
                            justify-center

                            overflow-hidden

                            rounded-full

                            border-4
                            border-white

                            bg-slate-100

                            shadow-lg
                        "
                    >

                        {imagePreview ? (

                            <img
                                src={imagePreview}
                                alt="Profile"
                                className="
                                    h-full
                                    w-full
                                    object-cover
                                "
                            />

                        ) : (

                            <UserRound
                                size={48}
                                className="text-slate-400"
                            />

                        )}

                    </div>

                </div>

                {/* Content */}

                <div className="space-y-5 px-6 pb-8 pt-5">

                    <div className="text-center">

                        <h3
                            className="
                                text-2xl
                                font-bold
                                text-slate-900
                            "
                        >

                            {formData.name || "Your Name"}

                        </h3>

                        <p
                            className="
                                mt-1
                                text-slate-500
                            "
                        >

                            @
                            {formData.username ||
                                "username"}

                        </p>

                    </div>

                    {formData.location && (

                        <div
                            className="
                                flex
                                items-center
                                justify-center
                                gap-2

                                text-slate-600
                            "
                        >

                            <MapPin size={17} />

                            {formData.location}

                        </div>

                    )}

                    <div className="border-t border-slate-200" />

                    <p
                        className="
                            text-center
                            text-sm
                            leading-7
                            text-slate-600
                        "
                    >

                        {formData.bio ||

                            "Your travel bio will appear here. Tell other travelers about yourself and the places you love to explore."}

                    </p>

                    {socials.some(
                        (item) => item.value
                    ) && (

                        <div
                            className="
                                flex
                                justify-center
                                gap-5

                                pt-3
                            "
                        >

                            {socials.map(
                                (
                                    {
                                        icon: Icon,
                                        value,
                                    },
                                    index
                                ) =>

                                    value ? (

                                        <div
                                            key={index}
                                            className="
                                                flex
                                                h-11
                                                w-11
                                                items-center
                                                justify-center

                                                rounded-full

                                                bg-slate-100

                                                text-slate-700

                                                transition

                                                hover:bg-[#3559D4]
                                                hover:text-white
                                            "
                                        >

                                            <Icon size={18} />

                                        </div>

                                    ) : null
                            )}

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

};

export default ProfilePreview;
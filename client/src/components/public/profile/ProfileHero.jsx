import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    MapPin,
    Globe,
    Pencil,
    CalendarDays,
    Plus,
    Share2,
    Check,
    MoreVertical,
    Copy,
    MessageCircle,
    Mail,
    Send,
} from "lucide-react";
import {
    FaInstagram,
    FaYoutube,
    FaLinkedin,
    FaWhatsapp,
    FaFacebookF,
    FaXTwitter,
} from "react-icons/fa6";
import { toast } from "sonner";

// ==========================================
// PROFILE HERO COMPONENT
// ==========================================
/**
 * Renders an executive traveler profile header featuring a professional layout,
 * absolute top-right action trigger, and a native Instagram-style share sheet.
 */
const ProfileHero = ({
    user,
    isOwner,
    memories,
}) => {
    const [copied, setCopied] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    
    const menuRef = useRef(null);
    const shareRef = useRef(null);

    const profileUrl = window.location.href;
    const shareTitle = `Check out ${user?.name || "this traveler"}'s profile on Avora`;

    // --- Generate Initials Fallback for Avatar ---
    const initials = user?.name
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    // --- Advanced Share Handler (Native Web Share API + Custom Modal/Sheet) ---
    const handleShareClick = async () => {
        setMenuOpen(false);
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    url: profileUrl,
                });
                return;
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Error sharing:", error);
                } else {
                    return;
                }
            }
        }

        setShareOpen((prev) => !prev);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setShareOpen(false);
        toast.success("Profile link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const shareToWhatsApp = () => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle} - ${profileUrl}`)}`, "_blank");
        setShareOpen(false);
    };

    const shareToFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`, "_blank");
        setShareOpen(false);
    };

    const shareToTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(profileUrl)}`, "_blank");
        setShareOpen(false);
    };

    const shareToEmail = () => {
        window.open(`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`Check out this profile: ${profileUrl}`)}`, "_blank");
        setShareOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
            if (shareRef.current && !shareRef.current.contains(e.target)) {
                setShareOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const publicCount = memories?.filter((m) => m.isPublic).length || 0;
    const privateCount = memories?.filter((m) => !m.isPublic).length || 0;

    return (
        <section className="bg-white">
            {/* Cover Image Banner */}
            <div className="relative h-48 sm:h-72 lg:h-[360px] overflow-hidden bg-slate-900">
                {user?.coverImage ? (
                    <img
                        src={user.coverImage}
                        alt="Profile Cover"
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-slate-950 via-slate-800 to-slate-700" />
                )}

                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />
            </div>

            {/* Profile Content Container */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="relative -mt-16 sm:-mt-24 rounded-3xl bg-white p-5 sm:p-8 lg:p-10 shadow-xl border border-slate-100">
                    
                    {/* --- ABSOLUTE TOP-RIGHT ACTION TRIGGER --- */}
                    <div className="absolute right-5 top-5 z-20 flex items-center gap-2">
                        {!isOwner && (
                            <div className="relative" ref={shareRef}>
                                <button
                                    type="button"
                                    onClick={handleShareClick}
                                    className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 shadow-sm cursor-pointer"
                                    title="Share Profile"
                                >
                                    {copied ? <Check size={16} className="text-emerald-600" /> : <Share2 size={16} />}
                                </button>

                                {shareOpen && (
                                    <div className="absolute right-0 top-12 z-40 w-64 rounded-2xl border border-slate-100 bg-white p-3 shadow-2xl animate-in fade-in zoom-in-95 duration-150 space-y-1">
                                        <div className="px-3 py-2 border-b border-slate-100 mb-1">
                                            <p className="text-xs font-bold text-slate-900">Share Profile</p>
                                            <p className="text-[10px] text-slate-500 truncate">Send to friends or socials</p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleCopyLink}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
                                        >
                                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                                            </div>
                                            <span>{copied ? "Link Copied!" : "Copy Link"}</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={shareToWhatsApp}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
                                        >
                                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                                                <FaWhatsapp size={14} />
                                            </div>
                                            <span>WhatsApp</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={shareToFacebook}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
                                        >
                                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                                                <FaFacebookF size={14} />
                                            </div>
                                            <span>Facebook</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={shareToTwitter}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 cursor-pointer"
                                        >
                                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white">
                                                <FaXTwitter size={14} />
                                            </div>
                                            <span>X (Twitter)</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={shareToEmail}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-orange-50 hover:text-orange-700 cursor-pointer"
                                        >
                                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                                                <Mail size={14} />
                                            </div>
                                            <span>Email</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {isOwner && (
                            <div className="relative" ref={menuRef}>
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen((prev) => !prev)}
                                    aria-label="Options"
                                    className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 shadow-sm cursor-pointer"
                                >
                                    <MoreVertical size={18} />
                                </button>

                                {menuOpen && (
                                    <div className="absolute right-0 top-12 z-30 w-52 rounded-2xl border border-slate-100 bg-white p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-150 space-y-1">
                                        <button
                                            type="button"
                                            onClick={handleShareClick}
                                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
                                        >
                                            <Share2 size={15} className="text-slate-500" />
                                            <span>Share Profile</span>
                                        </button>

                                        <Link
                                            to="/profile/edit"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                                        >
                                            <Pencil size={15} className="text-slate-500" />
                                            <span>Edit Profile</span>
                                        </Link>

                                        <Link
                                            to="/dashboard/create-memory"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#3559D4] transition hover:bg-blue-50"
                                        >
                                            <Plus size={15} />
                                            <span>New Memory</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        
                        {/* LEFT SIDE: Avatar & Details */}
                        <div className="flex flex-col items-center gap-4 sm:gap-6 sm:flex-row sm:items-start text-center sm:text-left w-full">
                            
                            {/* Profile Avatar */}
                            <div className="-mt-20 sm:-mt-28 h-32 w-32 sm:h-44 sm:w-44 shrink-0 overflow-hidden rounded-full border-4 sm:border-[6px] border-white bg-slate-200 shadow-xl">
                                {user?.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt={user.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-slate-300 text-4xl sm:text-6xl font-bold text-slate-700">
                                        {initials}
                                    </div>
                                )}
                            </div>

                            {/* Profile Details */}
                            <div className="flex-1 pt-1 sm:pt-2 w-full pr-0 sm:pr-4">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    
                                    {/* Name & Handle */}
                                    <div className="space-y-1">
                                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 pr-10 sm:pr-0">
                                            {user.name}
                                        </h1>
                                        <p className="text-xs sm:text-sm font-semibold text-slate-500">
                                            @{user.username}
                                        </p>
                                    </div>

                                    {/* --- DESKTOP STATS BAR (Only shown to owner, increased size & spacing) --- */}
                                    {isOwner && memories && (
                                        <div className="hidden lg:flex items-center gap-3 shrink-0 mr-12">
                                            <div className="inline-flex items-center gap-5 rounded-2xl border border-slate-200 bg-slate-50/80 px-6 py-3.5 text-xs font-semibold text-slate-700 shadow-sm">
                                                <div className="text-center px-2">
                                                    <span className="block text-lg font-extrabold text-slate-900">{memories.length}</span>
                                                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Memories</span>
                                                </div>
                                                <div className="h-8 w-px bg-slate-200" />
                                                <div className="text-center px-2">
                                                    <span className="block text-lg font-extrabold text-slate-900">{publicCount}</span>
                                                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Public</span>
                                                </div>
                                                <div className="h-8 w-px bg-slate-200" />
                                                <div className="text-center px-2">
                                                    <span className="block text-lg font-extrabold text-slate-900">{privateCount}</span>
                                                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Private</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>

                                {/* Location & Joined Date */}
                                <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs sm:text-sm font-medium text-slate-500">
                                    {user.location && (
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={15} className="text-slate-400 shrink-0" />
                                            <span>{user.location}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-1.5">
                                        <CalendarDays size={15} className="text-slate-400 shrink-0" />
                                        <span>
                                            Joined{" "}
                                            {new Date(user.createdAt).toLocaleDateString("en-US", {
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {/* Bio */}
                                {user.bio && (
                                    <p className="mt-3 max-w-2xl text-xs sm:text-sm lg:text-[15px] leading-relaxed text-slate-600">
                                        {user.bio}
                                    </p>
                                )}

                                {/* Social Links Footer Row */}
                                {(user.website || user.instagram || user.youtube || user.linkedin) && (
                                    <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap justify-center sm:justify-start gap-2">
                                        {user.website && (
                                            <a
                                                href={user.website}
                                                target="_blank"
                                                rel="noreferrer"
                                                aria-label="Website"
                                                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-[#3559D4] hover:text-white shadow-sm"
                                            >
                                                <Globe size={15} />
                                            </a>
                                        )}

                                        {user.instagram && (
                                            <a
                                                href={user.instagram}
                                                target="_blank"
                                                rel="noreferrer"
                                                aria-label="Instagram"
                                                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-pink-500 hover:text-white shadow-sm"
                                            >
                                                <FaInstagram size={15} />
                                            </a>
                                        )}

                                        {user.youtube && (
                                            <a
                                                href={user.youtube}
                                                target="_blank"
                                                rel="noreferrer"
                                                aria-label="YouTube"
                                                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-red-500 hover:text-white shadow-sm"
                                            >
                                                <FaYoutube size={15} />
                                            </a>
                                        )}

                                        {user.linkedin && (
                                            <a
                                                href={user.linkedin}
                                                target="_blank"
                                                rel="noreferrer"
                                                aria-label="LinkedIn"
                                                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-blue-600 hover:text-white shadow-sm"
                                            >
                                                <FaLinkedin size={15} />
                                            </a>
                                        )}
                                    </div>
                                )}

                                {/* Mobile & Tablet Stats Bar (Positioned below all profile data including bio and social links) */}
                                {isOwner && memories && (
                                    <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 lg:hidden text-center shadow-sm">
                                        <div>
                                            <span className="block text-base font-extrabold text-slate-900">{memories.length}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Memories</span>
                                        </div>
                                        <div className="border-x border-slate-200">
                                            <span className="block text-base font-extrabold text-slate-900">{publicCount}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Public</span>
                                        </div>
                                        <div>
                                            <span className="block text-base font-extrabold text-slate-900">{privateCount}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Private</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProfileHero;
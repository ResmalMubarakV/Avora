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
    Mail,
    Lock,
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
const ProfileHero = ({
    user,
    isOwner,
}) => {
    const [copied, setCopied] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    
    const menuRef = useRef(null);
    const shareRef = useRef(null);

    const profileUrl = window.location.href;
    const shareTitle = `Check out ${user?.name || "this traveler"}'s profile on Avora`;

    const initials = user?.name
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

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

    const hasSocials = user?.website || user?.instagram || user?.youtube || user?.linkedin;

    return (
        <section className="w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="relative h-48 sm:h-72 lg:h-[360px] overflow-hidden bg-slate-900 dark:bg-slate-950">
                {user?.coverImage ? (
                    <img
                        src={user.coverImage}
                        alt="Profile Cover"
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950" />
                )}

                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="relative -mt-16 sm:-mt-24 rounded-[32px] bg-white/95 dark:bg-slate-900/95 p-5 sm:p-8 lg:p-10 shadow-xl shadow-slate-900/5 dark:shadow-[0_15px_45px_rgba(0,0,0,0.6)] border border-slate-200/90 dark:border-slate-800 ring-1 ring-slate-900/5 dark:ring-white/10 backdrop-blur-xl transition-colors duration-300">
                    
                    {/* Top-Right Mobile & Tablet Dropdown Menu (3 Dots) */}
                    <div className="absolute right-4 top-4 sm:right-6 sm:top-6 z-25 flex items-center gap-2 xl:hidden">
                        {!isOwner && (
                            <div className="relative" ref={shareRef}>
                                <button
                                    type="button"
                                    onClick={handleShareClick}
                                    className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs cursor-pointer"
                                    title="Share Profile"
                                >
                                    {copied ? <Check size={16} className="text-emerald-600 dark:text-emerald-400" /> : <Share2 size={16} />}
                                </button>
                            </div>
                        )}

                        {isOwner && (
                            <div className="relative" ref={menuRef}>
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen((prev) => !prev)}
                                    aria-label="Options"
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs cursor-pointer"
                                >
                                    <MoreVertical size={18} />
                                </button>

                                {menuOpen && (
                                    <div className="absolute right-0 top-12 z-40 w-52 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-150 space-y-1">
                                        <button
                                            type="button"
                                            onClick={handleShareClick}
                                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                                        >
                                            <Share2 size={15} className="text-slate-500 dark:text-slate-400" />
                                            <span>Share Profile</span>
                                        </button>

                                        <Link
                                            to="/dashboard/settings/profile"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                                        >
                                            <Pencil size={15} className="text-slate-500 dark:text-slate-400" />
                                            <span>Edit Profile</span>
                                        </Link>

                                        <Link
                                            to="/dashboard/create-memory"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#3559D4] dark:text-indigo-400 transition hover:bg-blue-50 dark:hover:bg-indigo-950/50"
                                        >
                                            <Plus size={15} />
                                            <span>New Memory</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Desktop Vertical Right-Aligned Action Stack */}
                    {isOwner && (
                        <div className="hidden xl:flex absolute right-8 top-8 flex-col gap-2 z-20" ref={shareRef}>
                            <button
                                type="button"
                                onClick={handleShareClick}
                                title="Share Profile"
                                className="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-700 dark:text-slate-200 shadow-2xs transition hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer"
                            >
                                <Share2 size={15} className="text-slate-600 dark:text-slate-300" />
                            </button>

                            <Link
                                to="/dashboard/settings/profile"
                                title="Edit Profile"
                                className="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-700 dark:text-slate-200 shadow-2xs transition hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer"
                            >
                                <Pencil size={15} className="text-slate-600 dark:text-slate-300" />
                            </Link>

                            <Link
                                to="/dashboard/create-memory"
                                title="New Memory"
                                className="h-9 w-9 inline-flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#1E3A8A] to-[#3559D4] dark:from-indigo-600 dark:to-blue-600 text-white shadow-md shadow-blue-900/15 dark:shadow-indigo-900/30 transition hover:opacity-95 cursor-pointer"
                            >
                                <Plus size={16} />
                            </Link>

                            {shareOpen && (
                                <div className="absolute right-12 top-0 z-40 w-64 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-2xl animate-in fade-in zoom-in-95 duration-150 space-y-1">
                                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">Share Profile</p>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Send to friends or socials</p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleCopyLink}
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                                    >
                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                            {copied ? <Check size={14} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={14} />}
                                        </div>
                                        <span>{copied ? "Link Copied!" : "Copy Link"}</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={shareToWhatsApp}
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer"
                                    >
                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                                            <FaWhatsapp size={14} />
                                        </div>
                                        <span>WhatsApp</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={shareToFacebook}
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer"
                                    >
                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                                            <FaFacebookF size={14} />
                                        </div>
                                        <span>Facebook</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={shareToTwitter}
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                    >
                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-800 text-white">
                                            <FaXTwitter size={14} />
                                        </div>
                                        <span>X (Twitter)</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={shareToEmail}
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:text-orange-700 dark:hover:text-orange-300 cursor-pointer"
                                    >
                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
                                            <Mail size={14} />
                                        </div>
                                        <span>Email</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start text-center sm:text-left w-full">
                        
                        {/* Avatar with Mild Blue/Indigo Glow Highlight */}
                        <div className="relative -mt-20 sm:-mt-28 shrink-0">
                            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-blue-500/30 via-sky-400/20 to-indigo-500/30 opacity-40 dark:opacity-50 blur-md pointer-events-none"></div>
                            <div className="relative h-32 w-32 sm:h-44 sm:w-44 overflow-hidden rounded-full border-4 sm:border-[6px] border-white dark:border-slate-800 ring-2 ring-blue-500/20 dark:ring-blue-500/40 bg-slate-200 dark:bg-slate-800 shadow-[0_0_24px_rgba(53,89,212,0.22)] dark:shadow-[0_0_30px_rgba(99,102,241,0.45)] transition-all duration-300">
                                {user?.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt={user.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-slate-300 dark:bg-slate-700 text-4xl sm:text-6xl font-bold text-slate-700 dark:text-slate-200">
                                        {initials}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="flex-1 pt-1 sm:pt-2 w-full pr-0 xl:pr-16">
                            <div className="space-y-1">
                                <div className="flex items-center justify-center sm:justify-start gap-2.5 w-full">
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white text-center sm:text-left">
                                        {user.name}
                                    </h1>
                                    {isOwner && user?.isLocked && (
                                        <span 
                                            className="inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-blue-200 dark:border-indigo-800 bg-blue-50 dark:bg-indigo-950/60 text-[#3559D4] dark:text-indigo-400 shadow-2xs shrink-0"
                                            title="Your profile is currently locked"
                                        >
                                            <Lock size={13} />
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 text-center sm:text-left">
                                    @{user.username}
                                </p>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-300 tracking-wider [word-spacing:0.25rem]">
                                {user.location && (
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={15} className="text-slate-400 dark:text-slate-400 shrink-0" />
                                        <span>{user.location}</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-1.5">
                                    <CalendarDays size={15} className="text-slate-400 dark:text-slate-400 shrink-0" />
                                    <span>
                                        Joined{" "}
                                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                            </div>

                            {user.bio && (
                                <p className="mt-3 max-w-2xl text-xs sm:text-sm lg:text-[15px] leading-relaxed text-slate-600 dark:text-slate-300 tracking-wide [word-spacing:0.15rem] text-center sm:text-left mx-auto sm:mx-0">
                                    {user.bio}
                                </p>
                            )}

                            {/* Social Links Directly Below Bio */}
                            {hasSocials && (
                                <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                    {user.website && (
                                        <a
                                            href={user.website}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label="Website"
                                            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-white/80 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition hover:bg-[#3559D4] hover:text-white hover:border-transparent shadow-2xs"
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
                                            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-white/80 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition hover:bg-pink-500 hover:text-white hover:border-transparent shadow-2xs"
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
                                            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-white/80 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition hover:bg-red-500 hover:text-white hover:border-transparent shadow-2xs"
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
                                            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-white/80 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition hover:bg-blue-600 hover:text-white hover:border-transparent shadow-2xs"
                                        >
                                            <FaLinkedin size={15} />
                                        </a>
                                    )}
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
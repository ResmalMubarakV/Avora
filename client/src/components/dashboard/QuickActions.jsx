import {
    Images,
    PlusCircle,
    ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const QuickActions = () => {

    return (

        <div
            className="
                rounded-3xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
            "
        >

            <div className="mb-6">

                <h2
                    className="
                        text-xl
                        font-bold
                        text-slate-900
                    "
                >
                    Quick Actions
                </h2>

                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-500
                    "
                >
                    Manage your travel memories with a single click.
                </p>

            </div>

            <div className="space-y-4">

                {/* Create Memory */}

                <Link
                    to="/dashboard/create-memory"
                    className="
                        group
                        flex
                        items-center
                        justify-between

                        rounded-2xl

                        bg-gradient-to-r
                        from-[#1E3A8A]
                        to-[#3559D4]

                        p-4

                        text-white

                        shadow-md

                        transition-all
                        duration-300

                        hover:-translate-y-1
                        hover:shadow-lg
                    "
                >

                    <div className="flex items-center gap-4">

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center

                                rounded-xl

                                bg-white/20
                            "
                        >

                            <PlusCircle size={22} />

                        </div>

                        <div>

                            <h3 className="font-semibold">

                                Create Memory

                            </h3>

                            <p className="text-sm text-blue-100">

                                Add a new travel story

                            </p>

                        </div>

                    </div>

                    <ArrowRight
                        size={20}
                        className="
                            transition-transform
                            group-hover:translate-x-1
                        "
                    />

                </Link>

                {/* View Memories */}

                <Link
                    to="/dashboard/memories"
                    className="
                        group
                        flex
                        items-center
                        justify-between

                        rounded-2xl

                        border
                        border-slate-200

                        bg-slate-50

                        p-4

                        transition-all
                        duration-300

                        hover:-translate-y-1
                        hover:bg-white
                        hover:shadow-md
                    "
                >

                    <div className="flex items-center gap-4">

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center

                                rounded-xl

                                bg-sky-100
                                text-sky-600
                            "
                        >

                            <Images size={22} />

                        </div>

                        <div>

                            <h3
                                className="
                                    font-semibold
                                    text-slate-900
                                "
                            >
                                View My Memories
                            </h3>

                            <p
                                className="
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Browse and manage your journeys
                            </p>

                        </div>

                    </div>

                    <ArrowRight
                        size={20}
                        className="
                            text-slate-400
                            transition-transform
                            group-hover:translate-x-1
                        "
                    />

                </Link>

            </div>

        </div>

    );

};

export default QuickActions;
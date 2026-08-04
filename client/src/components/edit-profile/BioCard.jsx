import { FileText } from "lucide-react";

const MAX_LENGTH = 200;

const BioCard = ({
    formData,
    handleChange,
}) => {

    return (

        <div
            className="
                rounded-3xl
                border
                border-slate-200

                bg-white

                p-8

                shadow-sm
            "
        >

            {/* Header */}

            <div className="mb-8">

                <div className="flex items-center gap-3">

                    <div
                        className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center

                            rounded-xl

                            bg-blue-50

                            text-[#3559D4]
                        "
                    >

                        <FileText size={20} />

                    </div>

                    <div>

                        <h2
                            className="
                                text-xl
                                font-semibold
                                text-slate-900
                            "
                        >

                            Bio

                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >

                            Introduce yourself to fellow travelers.

                        </p>

                    </div>

                </div>

            </div>

            {/* Textarea */}

            <div>

                <textarea
                    name="bio"
                    rows={6}
                    maxLength={MAX_LENGTH}
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell everyone a little about yourself, your travel style, favorite destinations, or anything you'd like to share..."
                    className="
                        w-full

                        resize-none

                        rounded-2xl
                        border
                        border-slate-200

                        px-5
                        py-4

                        leading-7

                        outline-none

                        transition-all
                        duration-300

                        focus:border-[#3559D4]
                        focus:ring-4
                        focus:ring-blue-100
                    "
                />

                <div className="mt-3 flex justify-end">

                    <span
                        className="
                            text-sm
                            text-slate-500
                        "
                    >

                        {formData.bio.length} / {MAX_LENGTH}

                    </span>

                </div>

            </div>

        </div>

    );

};

export default BioCard;
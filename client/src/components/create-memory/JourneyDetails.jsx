import {
    MapPin,
    CalendarDays,
    Plane,
    FileText,
    Type,
} from "lucide-react";

const JourneyDetails = ({
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

                <h2 className="text-xl font-semibold text-slate-900">
                    Journey Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Tell the story behind your adventure.
                </p>

            </div>

            <div className="space-y-6">

                {/* Memory Title */}

                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Memory Title
                    </label>

                    <div className="relative">

                        <Type
                            size={18}
                            className="
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                            "
                        />

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Weekend in Ooty"
                            className="
                                w-full
                                rounded-2xl
                                border
                                border-slate-200
                                py-3
                                pl-12
                                pr-4
                                outline-none
                                transition
                                focus:border-[#3559D4]
                            "
                        />

                    </div>

                </div>

                {/* Location */}

                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Location
                    </label>

                    <div className="relative">

                        <MapPin
                            size={18}
                            className="
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                            "
                        />

                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Ooty, Tamil Nadu"
                            className="
                                w-full
                                rounded-2xl
                                border
                                border-slate-200
                                py-3
                                pl-12
                                pr-4
                                outline-none
                                transition
                                focus:border-[#3559D4]
                            "
                        />

                    </div>

                </div>

                {/* Dates */}

                <div className="grid gap-6 md:grid-cols-2">

                    {/* Start Date */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Start Date
                        </label>

                        <div className="relative">

                            <CalendarDays
                                size={18}
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />

                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="
                                    w-full
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    py-3
                                    pl-12
                                    pr-4
                                    outline-none
                                    transition
                                    focus:border-[#3559D4]
                                "
                            />

                        </div>

                    </div>

                    {/* End Date */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            End Date
                        </label>

                        <div className="relative">

                            <CalendarDays
                                size={18}
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />

                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="
                                    w-full
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    py-3
                                    pl-12
                                    pr-4
                                    outline-none
                                    transition
                                    focus:border-[#3559D4]
                                "
                            />

                        </div>

                    </div>

                </div>

                {/* Mode of Travel */}

                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Mode of Travel
                    </label>

                    <div className="relative">

                        <Plane
                            size={18}
                            className="
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                            "
                        />

                        <select
                            name="modeOfTravel"
                            value={formData.modeOfTravel}
                            onChange={handleChange}
                            className="
                                w-full
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                py-3
                                pl-12
                                pr-4
                                outline-none
                                transition
                                focus:border-[#3559D4]
                            "
                        >
                            <option value="">
                                Select Travel Mode
                            </option>

                            <option value="Car">Car</option>
                            <option value="Bike">Bike</option>
                            <option value="Bus">Bus</option>
                            <option value="Train">Train</option>
                            <option value="Flight">Flight</option>
                            <option value="Walk">Walk</option>
                            <option value="Cycle">Cycle</option>
                            <option value="Boat">Boat</option>
                            <option value="Other">Other</option>

                        </select>

                    </div>

                </div>

                {/* Story */}

                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Story
                    </label>

                    <div className="relative">

                        <FileText
                            size={18}
                            className="
                                absolute
                                left-4
                                top-4
                                text-slate-400
                            "
                        />

                        <textarea
                            rows={8}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Share your journey..."
                            className="
                                w-full
                                resize-none
                                rounded-2xl
                                border
                                border-slate-200
                                py-4
                                pl-12
                                pr-4
                                outline-none
                                transition
                                focus:border-[#3559D4]
                            "
                        />

                    </div>

                </div>

            </div>

        </div>
    );
};

export default JourneyDetails;
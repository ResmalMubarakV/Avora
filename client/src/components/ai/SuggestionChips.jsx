const SuggestionChips = ({
    onSelect,
    loading,
}) => {

    const suggestions = [
        "Continue Planning",
        "Estimated Budget",
        "Packing Checklist",
        "Hotels Nearby",
        "Things To Do",
        "Local Food",
    ];

    return (

        <div
            className="
                mt-5
                hidden
                flex-wrap
                gap-3
                sm:flex
            "
        >

            {suggestions.map((item) => (

                <button
                    key={item}
                    type="button"
                    disabled={loading}
                    onClick={() => onSelect(item)}
                    className="
                        rounded-full

                        border
                        border-slate-200

                        bg-white

                        px-4
                        py-2

                        text-sm
                        font-medium
                        text-slate-700

                        shadow-sm

                        transition-all
                        duration-300

                        hover:border-[#3559D4]
                        hover:bg-blue-50
                        hover:text-[#3559D4]
                        hover:shadow-md

                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >

                    {item}

                </button>

            ))}

        </div>

    );

};

export default SuggestionChips;
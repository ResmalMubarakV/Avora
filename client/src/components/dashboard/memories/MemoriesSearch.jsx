import { Search } from "lucide-react";

const MemoriesSearch = ({
    value,
    onChange,
}) => {

    return (

        <div
            className="
                relative

                w-full
                lg:w-[520px]
                xl:w-[680px]
            "
        >

            <Search
                size={20}
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
                value={value}
                onChange={onChange}
                placeholder="Search by title or destination..."
                className="
                    w-full

                    rounded-2xl
                    border
                    border-slate-200

                    bg-white

                    py-3.5
                    pl-12
                    pr-5

                    text-base
                    text-slate-800

                    placeholder:text-slate-400

                    shadow-sm

                    outline-none

                    transition-all
                    duration-300

                    focus:border-[#3559D4]
                    focus:ring-4
                    focus:ring-blue-100
                "
            />

        </div>

    );

};

export default MemoriesSearch;
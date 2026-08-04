const ProfileSearch = ({
    value,
    onChange,
}) => {

    return (

        <div className="w-full lg:max-w-md">

            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder="Search memories..."
                className="
                    w-full

                    rounded-xl

                    border
                    border-slate-200

                    bg-white

                    px-5
                    py-3

                    text-sm
                    text-slate-700

                    shadow-sm

                    outline-none

                    transition

                    focus:border-[#3559D4]
                    focus:ring-4
                    focus:ring-blue-100
                "
            />

        </div>

    );

};

export default ProfileSearch;
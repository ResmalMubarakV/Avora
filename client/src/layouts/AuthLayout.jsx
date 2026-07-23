import loginImage from "../assets/images/loginImage.png";

const AuthLayout = ({ children }) => {
    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-white">
            {/* Background Illustration */}
            <img
                src={loginImage}
                alt="Avora Authentication"
                draggable={false}
                className="
                    absolute
                    inset-0
                    hidden
                    md:block
                    h-full
                    w-full
                    object-cover
                    scale-105
                    select-none
                "
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-white/20 md:bg-transparent" />

            {/* Content */}
            <div
                className="
                    relative
                    z-10
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    px-5
                    py-8
                    sm:px-6
                    lg:px-10
                "
            >

                <div
                    className="
                        w-full
                        max-w-md
                        md:ml-auto
                        md:mr-10
                        lg:mr-20
                        xl:mr-28
                    "
                >

                    {children}

                </div>

            </div>

        </section>
    );
};

export default AuthLayout;
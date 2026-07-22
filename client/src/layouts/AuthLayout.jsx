import loginImage from "../assets/images/loginImage.png";

const AuthLayout = ({ children }) => {
    return (
        <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">

            <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-between px-6 py-10">

                {/* Left Side */}
                <div className="hidden md:flex md:w-[45%] lg:w-1/2 items-center justify-center">

                    <img
                        src={loginImage}
                        alt="Avora Authentication"
                        draggable="false"
                        className="w-full max-w-md lg:max-w-2xl select-none"
                    />

                </div>

                {/* Right Side */}
                <div className="flex w-full justify-center lg:w-1/2">

                    {children}

                </div>

            </div>

        </section>
    );
};

export default AuthLayout;
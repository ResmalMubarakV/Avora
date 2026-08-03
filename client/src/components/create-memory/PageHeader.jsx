const PageHeader = ({
    title = "Create Memory",
    subtitle = "Capture your journey with photos, videos and stories.",
}) => {
    return (
        <div>
            <h1
                className="
                    text-4xl
                    font-bold
                    text-slate-900
                "
            >
                {title}
            </h1>

            <p
                className="
                    mt-2
                    text-lg
                    text-slate-500
                "
            >
                {subtitle}
            </p>
        </div>
    );
};

export default PageHeader;
const ValidationMessage = ({
    status,
    success,
    error,
}) => {

    if (!status) return null;

    if (status === "valid" || status === "match" || status === "available") {
        return (
            <p className="text-xs text-green-600">
                {success}
            </p>
        );
    }

    return (
        <p className="text-xs text-red-500">
            {error}
        </p>
    );
};

export default ValidationMessage;
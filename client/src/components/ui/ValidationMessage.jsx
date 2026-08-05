// ==========================================
// VALIDATION MESSAGE COMPONENT
// ==========================================
/**
 * Renders inline form validation status messages. Displays success styling 
 * for valid/match/available states and error styling otherwise. Returns null if inactive.
 */
const ValidationMessage = ({
    status,
    success,
    error,
}) => {
    if (!status) return null;

    if (status === "valid" || status === "match" || status === "available") {
        return (
            <p className="text-xs font-medium text-emerald-600">
                {success}
            </p>
        );
    }

    return (
        <p className="text-xs font-medium text-red-500">
            {error}
        </p>
    );
};

export default ValidationMessage;
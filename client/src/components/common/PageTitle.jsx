import { useEffect } from "react";

// ==========================================
// PAGE TITLE HELPER COMPONENT
// ==========================================
/**
 * Dynamically updates document.title to follow the format: Avora - {page}
 */
const PageTitle = ({ title }) => {
  useEffect(() => {
    document.title = title ? `Avora - ${title}` : "Avora - Travel Diary Platform";
  }, [title]);

  return null;
};

export default PageTitle;
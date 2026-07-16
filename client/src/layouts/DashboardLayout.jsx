import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

const DashboardLayout = ({ children }) => {
    <>
        <Navbar />
        <Sidebar />
        {children}
    </>
}

export default DashboardLayout;
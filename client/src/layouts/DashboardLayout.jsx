import { Outlet } from "react-router-dom"
import Navbar from "../components/layouts/Navbar";
import Sidebar from "../components/layouts/Sidebar";

const DashboardLayout = ({ children }) => {
    return (
    <>
        <Navbar />
        <Sidebar />
        <Outlet />
    </>
    )
}

export default DashboardLayout;
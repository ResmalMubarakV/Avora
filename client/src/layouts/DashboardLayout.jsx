import { Outlet } from "react-router-dom"
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

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
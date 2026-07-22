import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";


const Login = () => {
    
    // State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Functions
    const handleSubmit = async (e) => {
        e.preventDefault();
            try {
                const {data} = await api.post(
                "/api/auth/login",
                {
                    email,
                    password
                }
            );

            localStorage.setItem("token", data.token);

            navigate("/dashboard");

            } catch (error) {
                console.error("Login Error" , error.message);
            }
    };

    // UI
return (
    <AuthLayout>

        Login Card

    </AuthLayout>
);
};

export default Login;
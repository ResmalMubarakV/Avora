// ==========================================
// LOGIN PAGE COMPONENT (`client/src/pages/auth/Login.jsx`)
// ==========================================
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';

import api from '../../api/axios';
import AuthLayout from '../../layouts/AuthLayout';
import avoraLogo from '../../assets/images/avoraLogo.png';
import avoraLogoDark from '../../assets/images/avoraLogoDark.png';
import PageTitle from '../../components/common/PageTitle';

import InputField from '../../components/ui/InputField';
import PasswordField from '../../components/ui/PasswordField';
import PrimaryButton from '../../components/ui/PrimaryButton';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/api/auth/login', { email, password });

      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role);

      if (data.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      const { code, message } = err.response?.data || {};

      if (code === 'ACCOUNT_PENDING') {
        navigate('/pending-approval', { replace: true });
        return;
      }

      if (code === 'ACCOUNT_SUSPENDED') {
        navigate('/suspended', { replace: true });
        return;
      }

      setError(message || 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout type="login">
      <PageTitle title="Sign In" />
      <div className="w-full">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center">
          <img
            src={avoraLogo}
            alt="Avora"
            className="mb-4 h-14 sm:h-16 w-auto select-none drop-shadow-sm transition-transform duration-500 hover:scale-105 dark:hidden"
            draggable={false}
          />
          <img
            src={avoraLogoDark}
            alt="Avora Dark"
            className="mb-4 h-14 sm:h-16 w-auto select-none drop-shadow-sm transition-transform duration-500 hover:scale-105 hidden dark:block"
            draggable={false}
          />
          <h1 className="bg-gradient-to-br from-slate-900 to-[#1E3A8A] dark:from-white dark:to-indigo-300 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500 text-center">
            Sign in to continue your travel journey.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<FiMail size={18} />}
            required
            disabled={loading}
          />

          <div className="space-y-1">
            <PasswordField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <div className="flex justify-end pt-1">
              <Link
                to="/forgot-password"
                className="text-xs font-bold text-[#1E3A8A] transition-colors hover:text-[#3559D4] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 shadow-sm backdrop-blur-sm">
              <p className="text-sm font-medium text-red-600">{error}</p>
            </div>
          )}

          <div className="pt-2">
            <PrimaryButton type="submit" loading={loading}>
              Sign In
            </PrimaryButton>
          </div>

          <div className="pt-5 text-center">
            <p className="text-sm font-medium text-slate-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-bold text-[#1E3A8A] transition-colors hover:text-[#3559D4]"
              >
                Create Account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
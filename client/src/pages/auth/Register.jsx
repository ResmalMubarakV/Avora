// ==========================================
// REGISTER PAGE COMPONENT (`client/src/pages/auth/Register.jsx`)
// ==========================================
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiAtSign } from 'react-icons/fi';

import api from '../../api/axios';
import AuthLayout from '../../layouts/AuthLayout';
import PasswordStrength from '../../components/auth/PasswordStrength';
import avoraLogo from '../../assets/images/avoraLogo.png';
import avoraLogoDark from '../../assets/images/avoraLogoDark.png';
import PageTitle from '../../components/common/PageTitle';

import InputField from '../../components/ui/InputField';
import PasswordField from '../../components/ui/PasswordField';
import PrimaryButton from '../../components/ui/PrimaryButton';
import ValidationMessage from '../../components/ui/ValidationMessage';

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [usernameStatus, setUsernameStatus] = useState('');
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkUsernameAvailability = async (targetUsername) => {
    if (targetUsername.trim().length < 3) {
      setUsernameStatus('');
      return;
    }
    try {
      setCheckingUsername(true);
      const { data } = await api.get('/api/users/check-username', {
        params: { username: targetUsername },
      });
      setUsernameStatus(data.available ? 'available' : 'taken');
    } catch {
      setUsernameStatus('');
    } finally {
      setCheckingUsername(false);
    }
  };

  useEffect(() => {
    if (username.trim().length < 3) {
      setUsernameStatus('');
      return;
    }
    const timer = setTimeout(() => {
      checkUsernameAvailability(username);
    }, 500);
    return () => clearTimeout(timer);
  }, [username]);

  useEffect(() => {
    if (!confirmPassword) {
      setPasswordStatus('');
      return;
    }
    setPasswordStatus(password === confirmPassword ? 'match' : 'mismatch');
  }, [password, confirmPassword]);

  useEffect(() => {
    if (!email.trim()) {
      setEmailStatus('');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailStatus(emailRegex.test(email) ? 'valid' : 'invalid');
  }, [email]);

  const isFormValid =
    name.trim() &&
    username.trim() &&
    email.trim() &&
    password &&
    confirmPassword &&
    usernameStatus === 'available' &&
    passwordStatus === 'match' &&
    emailStatus === 'valid';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isFormValid) {
      setError('Please complete all required fields correctly.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/auth/register', { name, username, email, password });
      navigate('/pending-approval', { replace: true, state: { registrationSuccess: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout type="register">
      <PageTitle title="Create Account" />
      <div className="w-full">
        {/* Header */}
        <div className="mb-6 flex flex-col items-center sm:mb-8">
          <img
            src={avoraLogo}
            alt="Avora"
            className="mb-3 h-12 sm:h-14 w-auto select-none drop-shadow-sm transition-transform duration-500 hover:scale-105 dark:hidden"
            draggable={false}
          />
          <img
            src={avoraLogoDark}
            alt="Avora Dark"
            className="mb-3 h-12 sm:h-14 w-auto select-none drop-shadow-sm transition-transform duration-500 hover:scale-105 hidden dark:block"
            draggable={false}
          />
          <h1 className="bg-gradient-to-br from-slate-900 to-[#1E3A8A] dark:from-white dark:to-indigo-300 bg-clip-text text-xl font-extrabold tracking-tight text-transparent sm:text-2xl">
            Create Account
          </h1>
          <p className="mt-1.5 text-xs font-medium text-slate-500 text-center">
            Start preserving your travel memories today.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<FiUser size={18} />}
            required
            disabled={loading}
          />

          <div>
            <InputField
              label="Username"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              icon={<FiAtSign size={18} />}
              required
              disabled={loading}
            />
            {checkingUsername && <p className="mt-1.5 text-xs font-medium text-slate-500">Checking username...</p>}
            {!checkingUsername && usernameStatus === 'available' && <p className="mt-1.5 text-xs font-bold text-emerald-600">✓ Username available</p>}
            {!checkingUsername && usernameStatus === 'taken' && <p className="mt-1.5 text-xs font-bold text-red-500">Username already exists</p>}
          </div>

          <div>
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
            <ValidationMessage status={emailStatus} success="✓ Valid email address" error="Please enter a valid email address" />
          </div>

          <div>
            <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
            {password && <div className="mt-2"><PasswordStrength password={password} /></div>}
          </div>

          <div>
            <PasswordField
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
            <ValidationMessage status={passwordStatus} success="✓ Passwords match" error="Passwords do not match" />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 shadow-sm backdrop-blur-sm">
              <p className="text-sm font-medium text-red-600">{error}</p>
            </div>
          )}

          <div className="pt-2">
            <PrimaryButton type="submit" loading={loading} disabled={loading || !isFormValid}>
              Create Account
            </PrimaryButton>
          </div>

          <div className="pt-4 text-center">
            <p className="text-sm font-medium text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#1E3A8A] transition-colors hover:text-[#3559D4]">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Register;
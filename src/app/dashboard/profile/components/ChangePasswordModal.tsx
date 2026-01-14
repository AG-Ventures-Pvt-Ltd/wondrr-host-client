'use client';

import React, { useState } from 'react';
import Modal from '@/common/components/composites/Modal';
import { Eye, EyeOff, Lock, AlertCircle } from 'lucide-react';
import usePostData from '@/common/services/usePostData';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  onClose,
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPasswords, setShowNewPasswords] = useState(false);
  const [errors, setErrors] = useState<{
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const { mutate: changePassword, isPending } = usePostData({
    url: API_ENDPOINTS.PROFILE.CHANGE_PASSWORD,
    onSuccess: () => {
      handleClose();
    },
  });

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return 'Password must contain at least one special character';
    }
    return null;
  };

  const handleSubmit = () => {
    const newErrors: typeof errors = {};

    // Validate old password
    if (!oldPassword) {
      newErrors.oldPassword = 'Old password is required';
    }

    // Validate new password
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else {
      const validationError = validatePassword(newPassword);
      if (validationError) {
        newErrors.newPassword = validationError;
      }
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Check if new password is same as old password
    if (oldPassword && newPassword && oldPassword === newPassword) {
      newErrors.newPassword = 'New password must be different from old password';
    }

    setErrors(newErrors);

    // If no errors, submit
    if (Object.keys(newErrors).length === 0) {
      changePassword({
        oldPassword,
        newPassword,
      });
    }
  };

  const handleClose = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowOldPassword(false);
    setShowNewPasswords(false);
    setErrors({});
    onClose();
  };

  const getPasswordStrength = (password: string): {
    strength: number;
    label: string;
    color: string;
  } => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 4) return { strength, label: 'Medium', color: 'bg-yellow-500' };
    return { strength, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = newPassword ? getPasswordStrength(newPassword) : null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Change Password"
      description="Update your account password"
      submitText={isPending ? 'Updating...' : 'Update Password'}
      onSubmit={handleSubmit}
      disabled={isPending}
    >
      <div className="flex flex-col gap-4 py-2">
        {/* Old Password */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-700">
            Current Password
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type={showOldPassword ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
                setErrors((prev) => ({ ...prev, oldPassword: undefined }));
              }}
              placeholder="Enter your current password"
              className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 ${
                errors.oldPassword ? 'border-red-500' : 'border-neutral-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.oldPassword && (
            <div className="flex items-center gap-1 text-red-500 text-xs">
              <AlertCircle size={12} />
              <span>{errors.oldPassword}</span>
            </div>
          )}
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-700">
            New Password
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type={showNewPasswords ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrors((prev) => ({ ...prev, newPassword: undefined }));
              }}
              placeholder="Enter your new password"
              className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 ${
                errors.newPassword ? 'border-red-500' : 'border-neutral-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowNewPasswords(!showNewPasswords)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showNewPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.newPassword && (
            <div className="flex items-center gap-1 text-red-500 text-xs">
              <AlertCircle size={12} />
              <span>{errors.newPassword}</span>
            </div>
          )}
          {/* Password Strength Indicator */}
          {newPassword && !errors.newPassword && passwordStrength && (
            <div className="flex flex-col gap-1">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded ${
                      i < passwordStrength.strength
                        ? passwordStrength.color
                        : 'bg-neutral-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-neutral-600">
                Password strength: {passwordStrength.label}
              </span>
            </div>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-700">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type={showNewPasswords ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              placeholder="Confirm your new password"
              className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 ${
                errors.confirmPassword ? 'border-red-500' : 'border-neutral-300'
              }`}
            />
          </div>
          {errors.confirmPassword && (
            <div className="flex items-center gap-1 text-red-500 text-xs">
              <AlertCircle size={12} />
              <span>{errors.confirmPassword}</span>
            </div>
          )}
        </div>

        {/* Password Requirements */}
        <div className="bg-neutral-50 rounded-lg p-3 mt-2">
          <p className="text-xs font-medium text-neutral-700 mb-2">
            Password must contain:
          </p>
          <ul className="text-xs text-neutral-600 space-y-1">
            <li className="flex items-center gap-2">
              <div className={`w-1 h-1 rounded-full ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-neutral-400'}`} />
              At least 8 characters
            </li>
            <li className="flex items-center gap-2">
              <div className={`w-1 h-1 rounded-full ${/[A-Z]/.test(newPassword) ? 'bg-green-500' : 'bg-neutral-400'}`} />
              One uppercase letter
            </li>
            <li className="flex items-center gap-2">
              <div className={`w-1 h-1 rounded-full ${/[a-z]/.test(newPassword) ? 'bg-green-500' : 'bg-neutral-400'}`} />
              One lowercase letter
            </li>
            <li className="flex items-center gap-2">
              <div className={`w-1 h-1 rounded-full ${/[0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-neutral-400'}`} />
              One number
            </li>
            <li className="flex items-center gap-2">
              <div className={`w-1 h-1 rounded-full ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword) ? 'bg-green-500' : 'bg-neutral-400'}`} />
              One special character
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;

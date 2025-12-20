import React from 'react';
import { Eye, Edit } from 'lucide-react';
import { ProfileStats } from './components/ProfileStats';
import { CompanyInformation } from './components/CompanyInformation';
import { VerifiedDocuments } from './components/VerifiedDocuments';
import { MembershipInfo } from './components/MembershipInfo';
import { PaymentDetails } from './components/PaymentDetails';
import {
  PROFILE_STATS,
  COMPANY_INFO,
  VERIFIED_DOCUMENTS,
  MEMBERSHIP_INFO,
  PAYMENT_DETAILS
} from './constants';

const ProfilePage = () => {
  return (
    <div className="flex flex-col gap-10 max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-medium text-neutral-900 leading-8">
            Company Profile
          </h1>
          <p className="text-base text-neutral-500 leading-6">
            Manage your company information and settings
          </p>
        </div>x
        <div className="flex items-center gap-3">
          <button className="px-5 py-3 bg-white rounded-2xl border border-neutral-200/60 shadow-sm flex items-center gap-2 hover:bg-neutral-50 transition-colors">
            <Eye size={16} className="text-neutral-500" />
            <span className="text-sm text-neutral-700">View Public Profile</span>
          </button>
          <button className="px-5 py-3 bg-blue-600 rounded-2xl shadow-sm flex items-center gap-2.5 hover:bg-blue-700 transition-colors">
            <Edit size={16} className="text-white" />
            <span className="text-sm text-white">Edit Profile</span>
          </button>
        </div>
      </div>
      <ProfileStats stats={PROFILE_STATS} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CompanyInformation data={COMPANY_INFO} />
        </div>        
        <div className="flex flex-col gap-6">
          <VerifiedDocuments documents={VERIFIED_DOCUMENTS} />
          <MembershipInfo data={MEMBERSHIP_INFO} />
        </div>
      </div>
      <PaymentDetails data={PAYMENT_DETAILS} />
    </div>
  );
};

export default ProfilePage;
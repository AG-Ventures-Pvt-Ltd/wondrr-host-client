'use client';

import React from 'react';
import { Eye } from 'lucide-react';
import { ProfileStats } from './components/ProfileStats';
import { CompanyInformation } from './components/CompanyInformation';
import { VerifiedDocuments } from './components/VerifiedDocuments';
import { MembershipInfo } from './components/MembershipInfo';
import { PaymentDetails } from './components/PaymentDetails';
import { LinksCard } from './components/LinksCard';
import {
  PROFILE_STATS,
  VERIFIED_DOCUMENTS,
  MEMBERSHIP_INFO,
} from './constants';
import Button from '@/common/components/atoms/Button';
import { useGetData } from '@/common/services/useGetData';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import Loader from '@/common/components/composites/Loader/Loader';

interface ProfileData {
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  location: {
    address: string;
    city: string;
    state: string;
  };
  bio: string;
  paymentDetails : {
    accountName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
  }
  verified: boolean;
  socialMedia : [{
    platform : 'Facebook' | 'Instagram' | 'LinkedIn' | 'Website';
    url : string;
  }]
}

const ProfilePage = () => {
  const { data: profileData, isLoading, refetch } = useGetData<ProfileData>(
    API_ENDPOINTS.PROFILE.GET_HOST_PROFILE
  );

  const navigateToPublicProfile = () => {
    const username = profileData?.username || '';
    window.open(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/host/${username}`, '_blank');
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-neutral-500">Failed to load profile data</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-medium text-neutral-900 leading-8">
            Company Profile
          </h1>
          <p className="text-base text-neutral-500 leading-6">
            Manage your company information and settings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="px-5! py-3! bg-white! rounded-2xl! border! border-neutral-200/60! shadow-sm! flex! items-center! gap-2! hover:bg-neutral-50! transition-colors!" onClick={navigateToPublicProfile}>
            <Eye size={16} className="text-neutral-500" />
            <span className="text-sm text-neutral-700">View Public Profile</span>
          </Button>
        </div>
      </div>
      <ProfileStats stats={PROFILE_STATS} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <CompanyInformation 
            data={{
              companyName: profileData.fullName,
              username: profileData.username,
              email: profileData.email,
              phoneNumber: profileData.phoneNumber,
              location: profileData.location,
              bio: profileData.bio,
            }}
          />
          <PaymentDetails 
            data={{
              accountName: profileData.paymentDetails.accountName,
              accountNumber: profileData.paymentDetails.accountNumber,
              bankName: profileData.paymentDetails.bankName,
              ifscCode: profileData.paymentDetails.ifscCode,
            }}
            verified={profileData.verified}
          />
        </div>        
        <div className="flex flex-col gap-6">
          <VerifiedDocuments documents={VERIFIED_DOCUMENTS} />
          <MembershipInfo data={MEMBERSHIP_INFO} />
          <LinksCard 
            data={{
              website: profileData.socialMedia?.find(s => s.platform === 'Website')?.url || '',
              instagram: profileData.socialMedia?.find(s => s.platform === 'Instagram')?.url || '',
              linkedin: profileData.socialMedia?.find(s => s.platform === 'LinkedIn')?.url || '',
              facebook: profileData.socialMedia?.find(s => s.platform === 'Facebook')?.url || '',
            }}
          />
        </div>
      </div>
      
    </div>
  );
};

export default ProfilePage;
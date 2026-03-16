'use client';

import React, { useState } from 'react';
import { Eye, Camera, User, Key } from 'lucide-react';
// import { ProfileStats } from './components/ProfileStats';
import { CompanyInformation } from './components/CompanyInformation';
import { VerifiedDocuments } from './components/VerifiedDocuments';
import { MembershipInfo } from './components/MembershipInfo';
import { PaymentDetails } from './components/PaymentDetails';
import { LinksCard } from './components/LinksCard';
import UpdateAvatarModal from './components/UpdateAvatarModal';
import ChangePasswordModal from './components/ChangePasswordModal';
// import {
  // PROFILE_STATS,
// } from './constants';
import Button from '@/common/components/atoms/Button';
import Image from '@/common/components/atoms/Image';
import { useGetData } from '@/common/services/useGetData';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import Loader from '@/common/components/composites/Loader';

interface ProfileData {
  avatar?: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  hostType: string;
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
  isVerified: boolean;
  companyDocuments:boolean;
  socialMedia : [{
    platform : 'Facebook' | 'Instagram' | 'LinkedIn' | 'Website';
    url : string;
  }]
  joinedAt :string;
}

const ProfilePage = () => {
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { data: profileData, isLoading, refetch } = useGetData<ProfileData>(
    API_ENDPOINTS.PROFILE.GET_HOST_PROFILE
  );

  const navigateToPublicProfile = () => {
    const username = profileData?.username || '';
    window.open(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/${username}`, '_blank');
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
      <div className="flex items-center gap-6 bg-white rounded-2xl p-6 border border-neutral-200/60 shadow-sm">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-neutral-200 bg-neutral-100 flex items-center justify-center">
            {profileData?.avatar ? (
              <Image
                src={profileData.avatar}
                alt={profileData.fullName}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={40} className="text-neutral-400" />
            )}
          </div>
          <button
            onClick={() => setIsAvatarModalOpen(true)}
            className="absolute bottom-0 right-0 bg-neutral-900 text-white rounded-full p-2 hover:bg-neutral-800 transition-colors shadow-lg"
            title="Update profile picture"
          >
            <Camera size={16} />
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-neutral-900">{profileData?.fullName}</h2>
          <p className="text-sm text-neutral-500">@{profileData?.username}</p>
        </div>
      </div>

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
          <Button className="px-5! py-3! bg-white! rounded-2xl! border! border-neutral-200/60! shadow-sm! flex! items-center! gap-2! hover:bg-neutral-50! transition-colors!" onClick={() => setIsPasswordModalOpen(true)}>
            <Key size={16} className="text-neutral-500" />
            <span className="text-sm text-neutral-700">Change Password</span>
          </Button>
          <Button className="px-5! py-3! bg-white! rounded-2xl! border! border-neutral-200/60! shadow-sm! flex! items-center! gap-2! hover:bg-neutral-50! transition-colors!" onClick={navigateToPublicProfile}>
            <Eye size={16} className="text-neutral-500" />
            <span className="text-sm text-neutral-700">View Public Profile</span>
          </Button>
        </div>
      </div>
      {/* <ProfileStats stats={PROFILE_STATS} /> */}
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
              accountName: profileData.paymentDetails?.accountName,
              accountNumber: profileData.paymentDetails?.accountNumber,
              bankName: profileData.paymentDetails?.bankName,
              ifscCode: profileData.paymentDetails?.ifscCode,
            }}
            verified={profileData.isVerified}
          />
        </div>        
        <div className="flex flex-col gap-6">
          <VerifiedDocuments verified={profileData.isVerified} hostType={profileData.hostType} hasSubmitted={profileData.companyDocuments}/>
          <MembershipInfo data={{memberSince : profileData.joinedAt, status : profileData.isVerified}} />
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
      <UpdateAvatarModal
        open={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={profileData?.avatar}
        onSuccess={() => refetch()}
      />
      <ChangePasswordModal
        open={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};

export default ProfilePage;
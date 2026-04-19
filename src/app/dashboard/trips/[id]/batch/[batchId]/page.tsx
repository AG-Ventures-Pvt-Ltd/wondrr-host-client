'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card from '@/common/components/composites/Card';
import Button from '@/common/components/atoms/Button';
import { TrendingUp, Users, IndianRupee, MapPin, Share2, Edit } from 'lucide-react';
import { useBatchDetails } from '../../../hooks/useBatchDetails';
import Loader from '@/common/components/composites/Loader'
import BackButton from '@/common/ui/BackButton';


const BatchDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const batchId = params.batchId as string;
  const tripId = params.id as string;

  const { batchDetails, isLoading, error } = useBatchDetails(batchId);

  console.log(batchDetails)

  const handleEditBatch = () => {
    router.push(`/dashboard/trips/${tripId}/batch/${batchId}/edit`);
  };

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading batch details</div>;
  if (!batchDetails) return <div>No batch data</div>;


  return (
    <div>
      <BackButton label="Back to Trip Details" to={`/dashboard/trips/${tripId}`} />
      <div className="pt-10">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-medium text-maintext">Batch Details</h1>
            <p className="text-base text-neutral-500">
              {batchDetails.dateRange}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-green-50 rounded-[10px]">
              <span className="text-xs text-green-700">{batchDetails.status}</span>
            </div>
            <Button 
              variant="text" 
              className="h-10 px-4 bg-white! rounded-2xl shadow-md flex items-center gap-2 hover:bg-gray-50" 
              onClick={handleEditBatch}
            >
              <Edit className="w-4 h-4 text-maintext" />
              <span className="text-sm text-maintext">Edit Batch</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="pt-6">
        <div className="grid grid-cols-4 gap-6">
          <Card className="flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <span className="text-sm text-neutral-500">Revenue</span>
              <div className="w-7 h-7 bg-green-50 rounded-[10px] flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="text-2xl text-maintext tracking-tight">
             <span className='flex items-center'><IndianRupee/>{batchDetails.stats.revenue}</span> 
            </div>
          </Card>
          <Card className="flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <span className="text-sm text-neutral-500">Seats Filled</span>
              <div className="w-7 h-7 bg-blue-50 rounded-[10px] flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl text-maintext tracking-tight">
              {batchDetails.stats.seatsFilledValue}
            </div>
          </Card>
        </div>
      </div>
      <div className="pt-6">
        <div className="flex gap-6">
          <Card className="flex-1 flex flex-col gap-5">
            <h2 className="text-base text-maintext">Batch Information</h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-neutral-500">Meeting Point</span>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-neutral-400" />
                  <span className="text-sm text-maintext">
                    {Array.isArray(batchDetails.batchInfo.meetingPoint) && batchDetails.batchInfo.meetingPoint.length > 0
                      ? batchDetails.batchInfo.meetingPoint.map((point, idx) => {
                          const loc = point.location
                          const locName = typeof loc === 'object' && loc !== null ? loc.name : String(loc)
                          return (
                            <div key={idx} className="text-sm text-maintext">
                              {locName}{point.pickupPrice ? ` — ₹${point.pickupPrice}` : ''}
                            </div>
                          )
                        })
                      : 'No meeting points set'
                    }
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-neutral-500">Drop Points</span>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-neutral-400" />
                  <span className="text-sm text-maintext">
                    {Array.isArray(batchDetails.batchInfo.dropPoint) && batchDetails.batchInfo.dropPoint.length > 0
                      ? batchDetails.batchInfo.dropPoint.map((dp, idx) => {
                          const name = typeof dp === 'object' && dp !== null ? dp.name : String(dp)
                          return <div key={idx}>{name}</div>
                        })
                      : 'No drop points set'
                    }
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-neutral-500">Point of Contact</span>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-linear-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center">
                    <span className="text-xs text-blue-700">
                      {batchDetails.batchInfo.pointOfContact?.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm text-maintext">
                    {batchDetails.batchInfo.pointOfContact} — {batchDetails.batchInfo.contactPhone}
                  </span>
                </div>
              </div>
            </div>
          </Card>
          <Card className="flex-1 flex flex-col gap-4">
            <h2 className="text-base text-maintext">Quick Actions</h2>
            <div className="flex flex-col gap-2">
              <Button
                variant="text"
                className="h-10 px-4 rounded-2xl flex items-center gap-2 hover:bg-gray-50 text-left justify-start"
                onClick={() => router.push(`/dashboard/bookings?tripId=${tripId}&batchId=${batchId}`)}
              >
                <Users className="w-4 h-4 text-neutral-600" />
                <span className="text-sm text-neutral-600">View Bookings</span>
              </Button>
              <Button
                variant="text"
                className="h-10 px-4 rounded-2xl flex items-center gap-2 hover:bg-gray-50 text-left justify-start"
              >
                <Share2 className="w-4 h-4 text-neutral-600" />
                <span className="text-sm text-neutral-600">Share Batch</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BatchDetailsPage;
import React from 'react'

const AuthBranding = () => {
  return (
    <div className="hidden lg:flex lg:w-[45%] bg-linear-to-r from-primary to-[#432DD7] relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to from-primary/90 to-[#432DD7]/90" />
      <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
        <div>
          <h1 className="text-3xl font-semibold font-['Poppins']">Wondrr</h1>
          <p className="text-blue-100 mt-2">Host Admin Dashboard</p>
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-4xl font-normal leading-tight mb-3">
              Manage Your Travel
              <br />
              Business with Ease
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed max-w-md">
              Create trips, track bookings, and grow your adventure business all in one place
            </p>
          </div>
          {/* <div className="flex gap-8 pt-6">
            <div>
              <p className="text-3xl font-normal">500+</p>
              <p className="text-blue-100 text-sm mt-1">Travel Organizers</p>
            </div>
            <div>
              <p className="text-3xl font-normal">10K+</p>
              <p className="text-blue-100 text-sm mt-1">Trips Created</p>
            </div>
            <div>
              <p className="text-3xl font-normal">50K+</p>
              <p className="text-blue-100 text-sm mt-1">Happy Travelers</p>
            </div>
          </div> */}
        </div>
        <div className="border-l-2 border-white/40 pl-4 space-y-2">
          {/* <p className="text-blue-100 italic">
            &quot;Wondrr has transformed how we manage our travel business. The dashboard is intuitive and saves us hours every week.&quot;
          </p>
          <p className="text-white text-sm">-- Shreyansh Agarwal, CEO</p> */}
        </div>
      </div>
    </div>
  )
}

export default AuthBranding

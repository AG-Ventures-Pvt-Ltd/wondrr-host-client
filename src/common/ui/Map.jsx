import React from 'react'
import Image from 'next/image'


const Map = ({ latitude = 30.4547, longitude = 78.0820 }) => {
  const src = `https://api.olamaps.io/tiles/v1/styles/default-light-standard/static/${longitude},${latitude},14/1200x450.png?marker=${longitude}%2C${latitude}%7Cred%7Cscale%3A2&api_key=${process.env.NEXT_PUBLIC_OlaApi}`;
  
    return (
      <div className='mx-4 my-2'>
          <Image 
            src={src} 
            alt="Map Location" 
            className='w-full h-auto rounded-2xl' 
            width={0}
            height={0}
            unoptimized
          />
      </div>
    )
}

export default Map


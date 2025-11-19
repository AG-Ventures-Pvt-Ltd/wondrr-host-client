import React from 'react'
import './loader.css'


const Loader = () => {
    return (
        <div className='flex justify-center items-center h-screen'>
            <div className="loader">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
            </div>
        </div>
    )
}

export default Loader
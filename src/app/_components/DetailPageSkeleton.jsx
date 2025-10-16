import React from 'react'

const DetailPageSkeleton = () => {
    return (
        <div
            className='w-full h-[calc(100vh-90px)] flex flex-col  pb-10 p-4'
        >
            <div className='w-full flex-1'>
                <div className='w-full h-[45px] animate-pulse bg-gray-300 rounded-md'> </div>
                <div className='w-full h-[300px] bg-gray-300 animate-pulse rounded-md mt-10'></div>
                <div className='w-full h-[30px] mt-10 animate-pulse bg-gray-300 rounded-md'> </div>
                <div className='w-full h-[20px] mt-4  animate-pulse bg-gray-300 rounded-md'> </div>
                <div className='w-[60%] h-[20px] mt-4  animate-pulse bg-gray-300 rounded-md'> </div>
                <div className='w-[30%] h-[20px] mt-4 animate-pulse bg-gray-300 rounded-md'> </div>
            </div>
            <div className='w-full h-[60px]   animate-pulse bg-gray-300 rounded-full'> </div>

        </div>
    )
}

export default DetailPageSkeleton
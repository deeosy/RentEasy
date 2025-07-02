import React from 'react'

export default function HowItWorks() {
  return (
    <section className='py-16 bg-white' >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className='text-3xl font-bold text-gray-900 mb-4' >How RentEasy Works</h2>
                <p className='text-gray-600 max-w-2xl mx-auto' >
                    Our platform connects renters directly with landlords and property owners, eliminating middlemen and making the rental process simple and transparent
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className='fas fa-search text-indigo-600 text-2xl'></i>
                    </div>
                    <h3 className='text-xl font-semibold text-gray-900 mb-2' >Search Properties</h3>
                    <p className='text-gray-600' >Browse our extensive listing of properties and use filters to find your perfect match.</p>
                </div>
                <div className="text-center p-6">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className='fas fa-comments text-indigo-600 text-2xl'></i>
                    </div>
                    <h3 className='text-xl font-semibold text-gray-900 mb-2' >Connect Directly</h3>
                    <p className='text-gray-600' >Cummunicate with landlords and property owners directly without any intermediaries or agents.</p>
                </div>
                <div className="text-center p-6">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className='fas fa-home text-indigo-600 text-2xl'></i>
                    </div>
                    <h3 className='text-xl font-semibold text-gray-900 mb-2' >Move In</h3>
                    <p className='text-gray-600' >Schedule viewings, sign agreements and move into your new home with ease.</p>
                </div>
            </div>
        </div>
    </section>
  )
}

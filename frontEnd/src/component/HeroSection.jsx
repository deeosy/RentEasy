import React from 'react'
import heroImage from '../images/rentEasy_heroImage.jpg' 

export default function HeroSection({ handlePremiumFeatureClick }) {
    const popularLocations = ["Accra", "Tema", "Kumasi", "Takoradi", "Tamale", "Cape Coast"];

  return (
    <section className='relative bg-gradient-to-r from-indigo-700 to-indigo-900 overflow-hidden' >
        <div className="absolute inset-0 z-0">
            {/* <img src="https://readdy.ai/api/search-image?query=Modern%20real%20estate%20concept%20with%20elegant%20city%20skyline%20at%20sunset%2C%20soft%20gradient%20lighting%20creating%20a%20warm%20atmosphere.%20The%20image%20shows%20a%20beautiful%20urban%20landscape%20with%20residential%20buildings%20and%20natural%20elements%20like%20trees%20integrated%20into%20the%20cityscape%2C%20perfect%20for%20a%20property%20rental%20website%20hero%20background.&width=1440&height=600&seq=81&orientation=landscape" 
                alt="Hero background" className='w-full h-full object-cover object-center opacity-20' 
            /> */}
            <img src={heroImage} alt="" className='w-full h-full object-cover object-center opacity-20'  />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 ">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ">
                <div>
                    <h1 className='text-4xl md:text-5xl font-bold text-white mb-6 ' >Exclude Agents, Find Your Perfect Home!</h1>
                    <p className='text-indigo-100 text-lg mb-8' >Connect directly with landlords. No middlemen, no hidden fees. Just the perfect place to call home.</p>
                    <div className="bg-white p-1 rounded-lg shadow-lg flex flex-col sm:flex-row">
                        <div className="flex-grow p-2">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className='fas fa-search text-gray-400' ></i>
                                </div>
                                <input type="text" placeholder='Search by location, property type...'
                                    className='block w-full pl-10 pr-3 py-2 border-none text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md'
                                />
                            </div>
                        </div>
                        <button className='bg-indigo-600 text-white px-6 py-3 rounded-md font-medium text-sm sm:text-base !rounded-button whitespace-nowrap cursor-pointer' >
                            Search Now
                        </button>
                    </div>
                    <div className="mt-6">
                        <p className='text-indigo-100 mb-2' >Popular locations:</p>
                        <div className="flex flex-wrap gap-2">
                            {popularLocations.map((location, index) => (
                              <button key={index}
                                className="bg-indigo-800 bg-opacity-50 hover:bg-opacity-70 text-white px-3 py-1 rounded-full text-sm !rounded-button whitespace-nowrap cursor-pointer "
                              >
                                {location}
                              </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="hidden lg:block"></div>
            </div>

        </div>
    </section>
  )
}

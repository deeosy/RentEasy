import React from 'react'

export default function Footer() {
  return (
    <footer className='bg-gray-900 text-white py-12' >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <i className="fas fa-home text-indigo-400 text-2xl mr-2"></i>
              <span className="text-xl font-bold">RentEasy</span>
            </div>
            <p className="text-gray-400 mb-4">Connecting renters and landlords directly, with no middlemen.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white">Home</a></li>
              <li><a href="/search" className="text-gray-400 hover:text-white">Search Properties</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">List Your Property</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Rental Guides</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Accessibility</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 RentEasy. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <i className="fab fa-cc-visa text-2xl text-gray-400"></i>
            <i className="fab fa-cc-mastercard text-2xl text-gray-400"></i>
            <i className="fab fa-cc-paypal text-2xl text-gray-400"></i>
            <i className="fab fa-cc-apple-pay text-2xl text-gray-400"></i>
          </div>
        </div>
      </div>
    </footer>
  )
}

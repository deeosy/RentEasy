import './App.css';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import PropertiesPage from './pages/PropertiesPage';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Header from './component/Header';
import HeroSection from './component/HeroSection';
import FeaturedListings from './component/FeaturedListings';
import listings from './listings';
import HowItWorks from './component/HowItWorks';
import Footer from './component/Footer';
import ListingDetailModal from './component/ListingDetailModal';
import Access from './pages/Access';
import ListPropertyPage from './pages/ListPropertyPage';
import usePropertyStore from './store/usePropertyStore';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import DirectionsPage from './pages/DirectionsPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { isAuth, checkAuth } = usePropertyStore()
  const [selectedListing, setSelectedListing] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth()
  }, [])

  const handleViewDetails = (listing) => {
    setSelectedListing(listing);
    setShowDetailModal(true)
  }

  const handlePremiumFeatureClick = () => {
    navigate('/access')
    setShowDetailModal(false)
  }

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedListing(null)
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Routes>
        <Route path='/' element={
          <>
            <HeroSection handlePremiumFeatureClick={handlePremiumFeatureClick} />
            <FeaturedListings handleViewDetails={handleViewDetails} listings={listings} />
            <HowItWorks />
          </>
        } />
        <Route path='/properties' element={<PropertiesPage />} />
        <Route path="/list-property" element={isAuth ? <ListPropertyPage /> : <Navigate to="/" />} />
        <Route path="/access" element={<Access />} />
        <Route path="/property/:id" element={<PropertyDetailsPage />} />
        <Route path="/directions/:id" element={<DirectionsPage />} />
        {/* 
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/reset-password" element={<ResetPassword />} /> */}
      </Routes>
      <Footer />
      <ListingDetailModal show={showDetailModal} listing={selectedListing} onClose={handleCloseDetailModal} onPremiumClick={handlePremiumFeatureClick} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
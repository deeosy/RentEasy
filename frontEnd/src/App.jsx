import './App.css';
import { Routes, Route,  useNavigate  } from 'react-router-dom'
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


function App() {
  const [isAuth, setIsAuth] = useState(false)
  const [selectedListing, setSelectedListing] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      await axios.get("http://localhost:4001/api", {withCredentials: true})
      setIsAuth(true)
    } catch (error) {
      setIsAuth(false)
    }
  }

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
        <Route path='/search' element={<PropertiesPage />} />
        <Route path="/access" element={<Access isAuth={isAuth} setIsAuth={setIsAuth} checkAuth={checkAuth} />} />
        {/* 
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/properties" element={isAuth ? <PropertiesPage /> : <Navigate to="/" />} />
        <Route path="/reset-password" element={<ResetPassword />} /> */}
      </Routes>
      <Footer />
      <ListingDetailModal show={showDetailModal} listing={selectedListing} onClose={handleCloseDetailModal} onPremiumClick={handlePremiumFeatureClick} />
    </div>
  );
}

export default App;
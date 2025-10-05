
// components/seller-app/SellerPage.tsx
import React, { useEffect } from 'react';
import { useLocation, useParams, Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SellerLayout from '@/components/seller-app/SellerLayout';
import SellerOverview from '@/components/seller-app/pages/SellerOverview';
import ProductQA from '@/components/product/ProductQA';
import CustomerReviewsEnhanced from '@/components/product/CustomerReviewsEnhanced';
import SellerReelsTab from '@/components/seller/tabs/SellerReelsTab';
import SellerPostsTab from '@/components/seller/tabs/SellerPostsTab';
import ProductSectionWrapper from '@/components/product/ProductSectionWrapper';
import BookGenreFlashDeals from '@/components/home/BookGenreFlashDeals';
import { fetchSellerById } from '@/integrations/supabase/sellers';
import { fetchAllProducts } from '@/integrations/supabase/products';
import { supabase } from '@/integrations/supabase/client';

const SellerPage = () => {
  const location = useLocation();
  const { sellerId } = useParams();

  // Fetch public seller data based on URL parameter
  const { data: sellerData, isLoading: sellerLoading } = useQuery({
    queryKey: ['public-seller', sellerId],
    queryFn: async () => {
      if (!sellerId) return null;
      return await fetchSellerById(sellerId);
    },
    enabled: !!sellerId,
  });

  // Mock videos data for reels tab
  const mockVideos = [
    {
      id: '1',
      video_url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
      title: 'Product Demo Video',
      views: 1200,
      likes: 89,
      duration: 60
    }
  ];

  const getSellerLogoUrl = (imagePath?: string): string => {
    if (!imagePath) return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
    const { data } = supabase.storage.from('seller-logos').getPublicUrl(imagePath);
    return data.publicUrl;
  };

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const handleVideoClick = (videoId: string) => {
    console.log('Video clicked:', videoId);
  };

  const handleUploadClick = () => {
    console.log('Upload reel clicked');
  };

  return (
    <SellerLayout 
      showActionButtons={true}
      publicSellerData={sellerData}
      publicSellerLoading={sellerLoading}
      getSellerLogoUrl={getSellerLogoUrl}
      isPublicPage={true}
    >
      <Routes>
        <Route path="/" element={<SellerOverview />} />
        <Route 
          path="/products" 
          element={
            <BookGenreFlashDeals 
              sellerId={sellerId}
            />
          } 
        />
        <Route 
          path="/reels" 
          element={
            <SellerReelsTab
              videos={mockVideos}
              isLoading={false}
              onVideoClick={handleVideoClick}
              onUploadClick={handleUploadClick}
            />
          } 
        />
        <Route path="/posts" element={<SellerPostsTab />} />
        <Route 
          path="/qas" 
          element={
            <div className="w-full bg-white">
              <ProductSectionWrapper>
                <ProductQA productId={sellerId} limit={null} />
              </ProductSectionWrapper>
            </div>
          } 
        />
        <Route 
          path="/reviews" 
          element={
            <div className="w-full bg-white">
              <ProductSectionWrapper>
                <CustomerReviewsEnhanced productId={sellerId} limit={null} />
              </ProductSectionWrapper>
            </div>
          } 
        />
      </Routes>
    </SellerLayout>
  );
};

export default SellerPage;

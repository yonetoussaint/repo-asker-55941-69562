import React, { useState } from 'react';
import { Play, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SellerSummaryHeader from '@/components/seller-app/SellerSummaryHeader';
import ProductFilterBar from '@/components/home/ProductFilterBar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SellerReelsTabProps {
  videos: any[];
  isLoading: boolean;
  onVideoClick: (videoId: string) => void;
  onUploadClick: () => void;
  onEditVideo?: (videoId: string) => void;
  onDeleteVideo?: (videoId: string) => void;
}

const SellerReelsTab: React.FC<SellerReelsTabProps> = ({
  videos,
  isLoading,
  onVideoClick,
  onUploadClick,
  onEditVideo,
  onDeleteVideo
}) => {
  const [deleteVideoId, setDeleteVideoId] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  // Helper function to check if an option is an "All" option
  const isAllOption = (option: string) => {
    return option.toLowerCase().startsWith('all');
  };

  // Auto-select first option for each filter on mount
  React.useEffect(() => {
    const initialFilters: Record<string, string> = {};
    let hasChanges = false;
    
    filterCategories.forEach((filter) => {
      if (!selectedFilters[filter.id] && filter.options.length > 0) {
        initialFilters[filter.id] = filter.options[0];
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      setSelectedFilters(prev => ({ ...prev, ...initialFilters }));
    }
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const filterCategories = [
    {
      id: 'sort',
      label: 'Sort By',
      options: ['All', 'Most Recent', 'Most Viewed', 'Most Liked']
    },
    {
      id: 'duration',
      label: 'Duration',
      options: ['All', 'Under 30s', '30s-1m', 'Over 1m']
    }
  ];

  const handleFilterSelect = (filterId: string, option: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterId]: option
    }));
  };

  const handleFilterClear = (filterId: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterId];
      return newFilters;
    });
  };

  const handleClearAll = () => {
    setSelectedFilters({});
  };

  const handleFilterButtonClick = (filterId: string) => {
    console.log('Filter button clicked:', filterId);
  };

  const stats = [
    { value: videos.length, label: 'Total Reels', color: 'text-blue-600' },
    { value: videos.reduce((sum, v) => sum + (v.views || 0), 0), label: 'Total Views', color: 'text-green-600' },
    { value: videos.reduce((sum, v) => sum + (v.likes || 0), 0), label: 'Total Likes', color: 'text-red-600' }
  ];

  return (
    <div className="w-full bg-white">
      <SellerSummaryHeader
        title="Reels"
        subtitle="Share engaging video content with your audience"
        stats={stats}
        actionButton={{
          label: "Upload Reel",
          icon: Plus,
          onClick: onUploadClick
        }}
        showStats={videos.length > 0}
      />

      <div className="-mx-2">
        <ProductFilterBar
          filterCategories={filterCategories}
          selectedFilters={selectedFilters}
          onFilterSelect={handleFilterSelect}
          onFilterClear={handleFilterClear}
          onClearAll={handleClearAll}
          onFilterButtonClick={handleFilterButtonClick}
        />
      </div>

      <div className="py-4">
        {/* Videos Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-100">
              <div className="aspect-[3/4] bg-gray-200 animate-pulse"></div>
              <div className="p-3">
                <div className="h-3 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-2 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : videos.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video) => (
              <div 
                key={video.id} 
                className="bg-white rounded-lg overflow-hidden border border-gray-100 group hover:shadow-md transition-shadow" 
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <video 
                    src={video.video_url} 
                    className="w-full h-full object-cover cursor-pointer"
                    muted
                    preload="metadata"
                    onClick={() => onVideoClick(video.id)}
                  />
                  
                  {/* Action buttons overlay */}
                  <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEditVideo && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white border-0 shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditVideo(video.id);
                        }}
                      >
                        <Edit className="w-3.5 h-3.5 text-gray-700" />
                      </Button>
                    )}
                    
                    {onDeleteVideo && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 bg-white/90 hover:bg-white border-0 shadow-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Reel</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{video.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteVideo(video.id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>

                  {/* Play button overlay */}
                  <div 
                    className="absolute inset-0 bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors cursor-pointer"
                    onClick={() => onVideoClick(video.id)}
                  >
                    <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                  </div>
                  
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(video.duration)}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <div className="text-white text-sm font-medium line-clamp-2 mb-2">
                      {video.title}
                    </div>
                    <div className="flex items-center gap-3 text-white/80 text-xs">
                      <span>{formatNumber(video.views)} views</span>
                      <span>•</span>
                      <span>{formatNumber(video.likes)} ❤</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-100">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Play className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Reels Yet</h3>
          <p className="text-gray-500 mb-4">Share your first video to engage with customers</p>
          <Button onClick={onUploadClick} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Upload Your First Reel
          </Button>
        </div>
        )}
      </div>
    </div>
  );
};

export default SellerReelsTab;
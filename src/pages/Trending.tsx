import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SpotCard } from '@/components/ui/spot-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Search, Filter, Star, Users, Calendar, MapPin, Navigation } from 'lucide-react';
import { AmalaSpot } from '@/types';
import { spotsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// New imports for Dialog (Modal)
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const Trending = () => {
  const [trendingSpots, setTrendingSpots] = useState<AmalaSpot[]>([]);
  const [filteredSpots, setFilteredSpots] = useState<AmalaSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'recent' | 'popular'>('popular');

  // New state for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpotForModal, setSelectedSpotForModal] = useState<AmalaSpot | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    fetchTrendingSpots();
  }, []);

  useEffect(() => {
    filterAndSortSpots();
  }, [trendingSpots, searchQuery, sortBy]);

  const fetchTrendingSpots = async () => {
    setLoading(true);
    try {
      const spots = await spotsAPI.getTrendingSpots();
      setTrendingSpots(spots);
    } catch (error) {
      console.error('Failed to fetch trending spots:', error);
      toast({
        title: 'Error',
        description: 'Failed to load trending spots. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortSpots = () => {
    let filtered = [...trendingSpots];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(spot =>
        spot.name.toLowerCase().includes(query) ||
        spot.description.toLowerCase().includes(query)
      );
    }

    // Sort based on selected criteria
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => (b.verification_count || 0) - (a.verification_count || 0));
        break;
    }

    setFilteredSpots(filtered);
  };

  // New function to open spot details in a modal
  const handleViewDetails = useCallback((spot: AmalaSpot) => {
    setSelectedSpotForModal(spot);
    setIsModalOpen(true);
  }, []);

  // Reusable function for getting directions
  const handleGetDirections = useCallback((spot: AmalaSpot) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`;
    window.open(url, '_blank');
  }, []);

  const getTrendingStats = () => {
    const totalSpots = trendingSpots.length;
    const verifiedSpots = trendingSpots.filter(spot => spot.verified).length;
    const averageRating = totalSpots > 0 ? trendingSpots.reduce((sum, spot) => sum + (spot.rating || 0), 0) / totalSpots : 0;

    return { totalSpots, verifiedSpots, averageRating };
  };

  const { totalSpots, verifiedSpots, averageRating } = getTrendingStats();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-foreground mb-4 flex items-center">
            <TrendingUp className="w-10 h-10 text-primary mr-3" />
            Trending Amala Spots
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover the most popular and highly-rated Amala destinations in our community
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{totalSpots}</div>
              <p className="text-sm text-muted-foreground">Total Trending Spots</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <div className="text-2xl font-bold text-foreground">{verifiedSpots}</div>
              <p className="text-sm text-muted-foreground">Verified Spots</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-8 h-8 text-accent fill-current" />
              </div>
              <div className="text-2xl font-bold text-foreground">{averageRating.toFixed(1)}</div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search trending spots..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              {(['popular', 'rating', 'recent'] as const).map((sort) => (
                <Button
                  key={sort}
                  variant={sortBy === sort ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy(sort)}
                >
                  {sort === 'popular' && <Users className="w-3 h-3 mr-1" />}
                  {sort === 'rating' && <Star className="w-3 h-3 mr-1" />}
                  {sort === 'recent' && <Calendar className="w-3 h-3 mr-1" />}
                  {sort.charAt(0).toUpperCase() + sort.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredSpots.length} of {totalSpots} trending spots
            </p>
          </div>
        </div>

        {/* Trending Spots Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-80"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredSpots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSpots.map((spot, index) => (
                  <div key={spot.id} className="relative">
                    {/* Trending Badge */}
                    {index < 3 && (
                      <Badge className="absolute top-4 left-4 z-10 bg-gradient-primary text-primary-foreground">
                        #{index + 1} Trending
                      </Badge>
                    )}

                    <SpotCard
                      spot={spot}
                      showActions
                      onClick={() => handleViewDetails(spot)}
                      className="h-full"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <CardTitle className="mb-2">No Results Found</CardTitle>
                  <CardDescription className="mb-4">
                    No trending spots match your search criteria. Try adjusting your search or filters.
                  </CardDescription>
                  <Button variant="outline" onClick={() => {
                    setSearchQuery('');
                    setSortBy('popular');
                  }}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Call to Action */}
        {!loading && filteredSpots.length > 0 && (
          <div className="mt-12 text-center">
            <Card className="bg-gradient-secondary text-secondary-foreground">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-display font-bold mb-4">
                  Found Your New Favorite Spot?
                </h3>
                <p className="text-secondary-foreground/90 mb-6 max-w-2xl mx-auto">
                  Help others discover amazing Amala experiences by sharing your own favorite spots or verifying new submissions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="accent" size="lg">
                    Submit New Spot
                  </Button>
                  <Button variant="outline" size="lg" className="border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/10">
                    Help Verify Spots
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Spot Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          {selectedSpotForModal && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedSpotForModal.name}</DialogTitle>
                <DialogDescription>
                  Details for this trending Amala spot.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <img
                  src={selectedSpotForModal.photo_url || '/placeholder.svg'}
                  alt={selectedSpotForModal.name}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />

                <p className="text-muted-foreground">
                  {selectedSpotForModal.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-mono">
                      {selectedSpotForModal.lat.toFixed(4)}, {selectedSpotForModal.lng.toFixed(4)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      selectedSpotForModal.verified
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {selectedSpotForModal.verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>

                  {selectedSpotForModal.rating && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Rating:</span>
                      <span className="font-medium">
                        ⭐ {selectedSpotForModal.rating.toFixed(1)}/5
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2"> {/* Changed to 1 column for modal aesthetics */}
                  <Button variant="hero" size="sm" onClick={() => handleGetDirections(selectedSpotForModal)}>
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                  {/* Share Spot functionality could also be added here if desired */}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Trending;
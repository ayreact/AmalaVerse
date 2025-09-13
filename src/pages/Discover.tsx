import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SpotCard } from '@/components/ui/spot-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Search, MapPin, Filter, List, Map, Navigation } from 'lucide-react'; // Added Navigation for directions
import { AmalaSpot, SpotFilters } from '@/types'; // Assuming '@/types' exists
import { spotsAPI } from '@/lib/api'; // Assuming '@/lib/api' exists
import mapboxgl, { LngLatBounds } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox access token - IMPORTANT: Use environment variables in production!
// Example: process.env.NEXT_PUBLIC_MAPBOX_TOKEN
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN; // Replace with your actual token or env var

// Helper function to generate Mapbox popup HTML
const mapSpotToHTML = (spot: AmalaSpot) => `
  <div class="p-2">
    <h3 class="font-semibold text-base">${spot.name}</h3>
    <p class="text-sm text-gray-600 mb-2">${spot.description}</p>
    ${spot.verified ? '<span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified</span>' : ''}
    ${spot.rating ? `<p class="text-sm mt-1">⭐ ${spot.rating.toFixed(1)}/5</p>` : ''}
  </div>
`;

const Discover = () => {
  const [spots, setSpots] = useState<AmalaSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [filters, setFilters] = useState<SpotFilters>({ search: '', verified_only: false });
  const [selectedSpot, setSelectedSpot] = useState<AmalaSpot | null>(null);

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]); // To keep track of markers for clearing

  // Effect for fetching spots when filters change
  useEffect(() => {
    const fetchSpots = async () => {
      setLoading(true);
      try {
        const data = await spotsAPI.getSpots(filters);
        setSpots(data);
      } catch (error) {
        console.error('Failed to fetch spots:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpots();
  }, [filters]);

  // Function to fit map bounds to all current spots
  const fitMapToBounds = useCallback(() => {
    if (map.current && spots.length > 0) {
      const bounds = new LngLatBounds();
      spots.forEach(spot => {
        bounds.extend([spot.lng, spot.lat]);
      });
      map.current.fitBounds(bounds, {
        padding: 50, // Padding around the bounds
        duration: 1000,
      });
    }
  }, [spots]);

  // Effect for Mapbox map initialization and cleanup
  useEffect(() => {
    if (viewMode === 'map' && mapContainer.current && !map.current) {
      mapboxgl.accessToken = MAPBOX_TOKEN;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11', // You can change the map style here
        center: [3.3792, 6.5244], // Default: Lagos, Nigeria
        zoom: 10,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true
      }), 'top-right');

      // Cleanup function
      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
          markers.current = []; // Clear markers as map is removed
        }
      };
    }
    // If we switch away from map view, ensure cleanup runs
    if (viewMode === 'list' && map.current) {
        map.current.remove();
        map.current = null;
        markers.current = [];
    }
  }, [viewMode]); // Re-run effect when viewMode changes

  // Effect for updating map markers when spots data changes or map is ready
  useEffect(() => {
    if (map.current && spots.length > 0) {
      // Clear existing markers
      markers.current.forEach(marker => marker.remove());
      markers.current = [];

      // Add new markers
      spots.forEach((spot) => {
        const marker = new mapboxgl.Marker({
          color: spot.verified ? '#e67e22' : '#f39c12', // Orange for verified, yellowish for unverified
        })
          .setLngLat([spot.lng, spot.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(mapSpotToHTML(spot))
          )
          .addTo(map.current!); // Use non-null assertion as we've checked map.current

        marker.getElement().addEventListener('click', () => {
          setSelectedSpot(spot);
        });
        markers.current.push(marker);
      });

      // Fit map to bounds of all new spots
      fitMapToBounds();
    } else if (map.current && spots.length === 0) {
        // If no spots, clear all markers
        markers.current.forEach(marker => marker.remove());
        markers.current = [];
    }
  }, [spots, map.current, fitMapToBounds]); // Re-run when spots or map instance changes

  // Effect to fly to selected spot
  useEffect(() => {
    if (map.current && selectedSpot) {
      map.current.flyTo({
        center: [selectedSpot.lng, selectedSpot.lat],
        zoom: 14, // Zoom in closer when a spot is selected
        essential: true // This ensures the animation always plays
      });

      // Open the popup for the selected spot if it's a marker
      const markerToOpen = markers.current.find(
        marker => {
          const lngLat = marker.getLngLat();
          return lngLat.lng === selectedSpot.lng && lngLat.lat === selectedSpot.lat;
        }
      );
      markerToOpen?.getPopup()?.addTo(map.current);
    }
  }, [selectedSpot, map.current]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // fetchSpots is already triggered by filters dependency, just ensure search value is updated
    // No need to call fetchSpots directly here
  };

  const handleGetDirections = useCallback(() => {
    if (selectedSpot) {
      // Open Google Maps with directions
      const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedSpot.lat},${selectedSpot.lng}`;
      window.open(url, '_blank');
    }
  }, [selectedSpot]);

  const handleShareSpot = useCallback(() => {
    if (selectedSpot) {
      const shareData = {
        title: `Check out ${selectedSpot.name} on Amala Discover!`,
        text: selectedSpot.description,
        url: window.location.href, // Or a specific URL for the spot if available
      };

      if (navigator.share) {
        navigator.share(shareData)
          .then(() => console.log('Spot shared successfully'))
          .catch((error) => console.error('Error sharing spot:', error));
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`)
          .then(() => alert('Spot details copied to clipboard!'))
          .catch((error) => console.error('Failed to copy:', error));
      }
    }
  }, [selectedSpot]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">
            Discover Amala Spots
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore authentic Amala locations verified by our community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search for Amala spots..."
                value={filters.search || ''}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>
            <Button type="submit" variant="hero">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </form>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="verified-only"
                checked={filters.verified_only}
                onCheckedChange={(checked) => setFilters({ ...filters, verified_only: checked })}
              />
              <Label htmlFor="verified-only">Verified spots only</Label>
            </div>

            <div className="flex items-center space-x-2 ml-auto">
              <Button
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('map')}
              >
                <Map className="w-4 h-4 mr-2" />
                Map
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4 mr-2" />
                List
              </Button>
            </div>
          </div>
        </div>

        {/* Map/List View */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {viewMode === 'map' ? (
              // The map container is ONLY rendered when viewMode is 'map'
              <div ref={mapContainer} className="h-96 lg:h-[600px] rounded-lg overflow-hidden shadow-warm w-full" />
            ) : (
              // List view
              <div className="space-y-4">
                {loading ? (
                  <div className="grid gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-muted rounded-lg h-40"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {spots.map((spot) => (
                      <SpotCard
                        key={spot.id}
                        spot={spot}
                        showActions
                        onClick={() => setSelectedSpot(spot)}
                        className="w-full"
                      />
                    ))}

                    {spots.length === 0 && (
                      <div className="text-center py-12">
                        <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          No spots found
                        </h3>
                        <p className="text-muted-foreground">
                          Try adjusting your search criteria or add new spots to help grow our community.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Spot Details Sidebar */}
          <div className="lg:col-span-1">
            {selectedSpot ? (
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>{selectedSpot.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img
                    src={selectedSpot.photo_url || '/placeholder.svg'}
                    alt={selectedSpot.name}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />

                  <p className="text-muted-foreground">
                    {selectedSpot.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-mono">
                        {selectedSpot.lat.toFixed(4)}, {selectedSpot.lng.toFixed(4)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        selectedSpot.verified
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {selectedSpot.verified ? 'Verified' : 'Pending'}
                      </span>
                    </div>

                    {selectedSpot.rating && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Rating:</span>
                        <span className="font-medium">
                          ⭐ {selectedSpot.rating.toFixed(1)}/5
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="hero" size="sm" onClick={handleGetDirections}>
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShareSpot}>
                      Share Spot
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="sticky top-24">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">
                      Select a Spot
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Click on a spot marker or card to view details
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;
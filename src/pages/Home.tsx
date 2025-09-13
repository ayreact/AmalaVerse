import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SpotCard } from '@/components/ui/spot-card';
import { MapPin, MessageCircle, Search, Star, TrendingUp, Users } from 'lucide-react';
import { AmalaSpot } from '@/types';
import { spotsAPI } from '@/lib/api';
import heroImage from '@/assets/hero-3.jpg';

const Home = () => {
  const [trendingSpots, setTrendingSpots] = useState<AmalaSpot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingSpots = async () => {
      try {
        const spots = await spotsAPI.getTrendingSpots();
        setTrendingSpots(spots);
      } catch (error) {
        console.error('Failed to fetch trending spots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingSpots();
  }, []);

  const features = [
    {
      icon: MapPin,
      title: 'Discover Hidden Gems',
      description: 'Find authentic Amala spots verified by our community of food lovers.',
    },
    {
      icon: MessageCircle,
      title: 'AI-Powered Recommendations',
      description: 'Chat with our AI agent to get personalized Amala spot recommendations.',
    },
    {
      icon: Users,
      title: 'Community Verified',
      description: 'Every spot is reviewed and verified by passionate Amala enthusiasts.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <img 
          src={heroImage} 
          alt="Delicious Amala dish"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative container mx-auto px-4 py-32 text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-primary-foreground mb-6">
            Discover Authentic
            <span className="block bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">
              Amala Experiences
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto font-light">
            Join the global community discovering and sharing the most authentic Amala spots. 
            From hidden bukas to renowned kitchens, find your perfect plate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/discover">
              <Button variant="hero" size="xl" className="min-w-48">
                <Search className="w-5 h-5" />
                Start Exploring
              </Button>
            </Link>
            <Link to="/chat">
              <Button variant="secondary" size="xl" className="min-w-48">
                <MessageCircle className="w-5 h-5" />
                Ask AI Agent
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-warm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">
              Why Choose AmalaVerse?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the perfect blend of technology and tradition in your quest for authentic Amala
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-smooth">
                    <Icon className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trending Spots Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-display font-bold text-foreground mb-4 flex items-center">
                <TrendingUp className="w-8 h-8 text-primary mr-3" />
                Trending Spots
              </h2>
              <p className="text-lg text-muted-foreground">
                Popular Amala destinations loved by our community
              </p>
            </div>
            <Link to="/trending">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-64"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingSpots.map((spot) => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  showActions
                  onClick={() => {/* Handle spot click */}}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-display font-bold text-secondary-foreground mb-6">
            Ready to Share Your Favorite Spot?
          </h2>
          <p className="text-lg text-secondary-foreground/90 mb-8 max-w-2xl mx-auto">
            Help grow our community by submitting your favorite Amala spots. 
            Every contribution helps fellow food lovers discover amazing experiences.
          </p>
          <Link to="/submit">
            <Button variant="accent" size="xl">
              Submit a Spot
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
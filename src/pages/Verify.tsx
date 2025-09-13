import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckSquare, ThumbsUp, ThumbsDown, MapPin, Users, Clock } from 'lucide-react';
import { AmalaSpot, VerificationVote } from '@/types';
import { verificationAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Verify = () => {
  const [unverifiedSpots, setUnverifiedSpots] = useState<AmalaSpot[]>([]);
  const [currentSpotIndex, setCurrentSpotIndex] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('auth_token');

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnverifiedSpots();
    }
  }, [isAuthenticated]);

  const fetchUnverifiedSpots = async () => {
    setLoading(true);
    try {
      const spots = await verificationAPI.getVerificationQueue();
      setUnverifiedSpots(spots);
    } catch (error) {
      console.error('Failed to fetch unverified spots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (vote: 'approve' | 'reject') => {
    const currentSpot = unverifiedSpots[currentSpotIndex];
    if (!currentSpot) return;

    setSubmitting(true);
    
    const voteData: VerificationVote = {
      spot_id: currentSpot.id,
      vote,
      comment: comment.trim()
    };

    try {
      await verificationAPI.verifySpot(voteData);
      
      toast({
        title: vote === 'approve' ? 'Spot Approved!' : 'Spot Rejected',
        description: `You have ${vote === 'approve' ? 'approved' : 'rejected'} "${currentSpot.name}". Thank you for helping maintain quality!`,
      });
      
      // Move to next spot or show completion
      if (currentSpotIndex < unverifiedSpots.length - 1) {
        setCurrentSpotIndex(currentSpotIndex + 1);
        setComment('');
      } else {
        // No more spots to verify
        setUnverifiedSpots([]);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit verification. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const skipSpot = () => {
    if (currentSpotIndex < unverifiedSpots.length - 1) {
      setCurrentSpotIndex(currentSpotIndex + 1);
      setComment('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-warm p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckSquare className="w-12 h-12 text-primary mx-auto mb-4" />
            <CardTitle>Login Required</CardTitle>
            <CardDescription>
              You need to be logged in to participate in spot verification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="hero" className="w-full" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/register')}>
                Create Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-64 bg-muted rounded" />
              <div className="h-32 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentSpot = unverifiedSpots[currentSpotIndex];

  if (!currentSpot || unverifiedSpots.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <CheckSquare className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">
              All Caught Up!
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              There are no spots pending verification at the moment. Thank you for helping maintain our community quality!
            </p>
            <div className="space-y-3">
              <Button variant="hero" onClick={() => navigate('/discover')}>
                Explore Verified Spots
              </Button>
              <Button variant="outline" onClick={() => navigate('/submit')}>
                Submit New Spot
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold text-foreground mb-4 flex items-center">
              <CheckSquare className="w-10 h-10 text-primary mr-3" />
              Verify Amala Spots
            </h1>
            <p className="text-lg text-muted-foreground">
              Help maintain quality by reviewing submitted spots. Your verification helps other food lovers discover authentic experiences.
            </p>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Progress
              </span>
              <span className="text-sm text-muted-foreground">
                {currentSpotIndex + 1} of {unverifiedSpots.length}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-primary h-2 rounded-full transition-smooth"
                style={{ width: `${((currentSpotIndex + 1) / unverifiedSpots.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Spot Card */}
          <Card className="shadow-elegant mb-6">
            <div className="relative">
              <img
                src={currentSpot.photo_url || '/placeholder.svg'}
                alt={currentSpot.name}
                className="w-full h-64 object-cover rounded-t-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
              <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-1">
                <span className="text-xs font-medium text-foreground">Pending Verification</span>
              </div>
            </div>
            
            <CardHeader>
              <CardTitle className="text-xl">{currentSpot.name}</CardTitle>
              <CardDescription className="text-base">
                {currentSpot.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {currentSpot.lat.toFixed(4)}, {currentSpot.lng.toFixed(4)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>Submitted by user</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{new Date(currentSpot.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckSquare className="w-4 h-4 text-muted-foreground" />
                  <span>{currentSpot.verification_count || 0} votes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Form */}
          <Card className="shadow-warm">
            <CardHeader>
              <CardTitle className="text-lg">Your Verification</CardTitle>
              <CardDescription>
                Does this spot look authentic and appropriate for AmalaVerse?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="comment">Comment (Optional)</Label>
                <Textarea
                  id="comment"
                  placeholder="Share your thoughts about this spot..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="hero"
                  className="flex-1"
                  onClick={() => handleVote('approve')}
                  disabled={submitting}
                >
                  <ThumbsUp className="w-4 h-4" />
                  Approve Spot
                </Button>
                
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleVote('reject')}
                  disabled={submitting}
                >
                  <ThumbsDown className="w-4 h-4" />
                  Reject Spot
                </Button>
                
                <Button
                  variant="outline"
                  onClick={skipSpot}
                  disabled={submitting}
                >
                  Skip
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                Your verification helps maintain the quality and authenticity of our Amala spot directory.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Verify;
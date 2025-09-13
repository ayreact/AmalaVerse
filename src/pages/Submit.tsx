import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, MapPin, Loader2, Camera, CheckCircle } from 'lucide-react';
import { spotsAPI } from '@/lib/api';
import { SpotSubmission } from '@/types';
import { useToast } from '@/hooks/use-toast';

const Submit = () => {
  const [formData, setFormData] = useState<SpotSubmission>({
    name: '',
    description: '',
    lat: 0,
    lng: 0,
    photo_url: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('auth_token');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
          toast({
            title: 'Location captured!',
            description: 'Your current location has been set for this spot.',
          });
        },
        (error) => {
          setLoading(false);
          setError('Unable to get your location. Please enter coordinates manually.');
          console.error('Location error:', error);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // In a real app, you would upload the image to Cloudinary first
      let photoUrl = formData.photo_url;
      
      if (imageFile) {
        // Mock Cloudinary upload - in real app, this would be actual upload
        photoUrl = URL.createObjectURL(imageFile);
        // const uploadResult = await uploadToCloudinary(imageFile);
        // photoUrl = uploadResult.secure_url;
      }

      const spotData = { ...formData, photo_url: photoUrl };
      await spotsAPI.submitSpot(spotData);
      
      toast({
        title: 'Spot submitted successfully!',
        description: 'Thank you for contributing to our community. Your spot is now pending verification.',
      });
      
      setStep(3); // Success step
      setTimeout(() => {
        navigate('/discover');
      }, 2000);
      
    } catch (err) {
      setError('Failed to submit spot. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-warm p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
            <CardTitle>Login Required</CardTitle>
            <CardDescription>
              You need to be logged in to submit a new Amala spot.
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

  if (step === 3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-warm p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8">
            <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Spot Submitted!</h2>
            <p className="text-muted-foreground mb-4">
              Your Amala spot has been submitted and is pending community verification.
            </p>
            <Button variant="hero" onClick={() => navigate('/discover')}>
              Explore Spots
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">
            Submit New Amala Spot
          </h1>
          <p className="text-lg text-muted-foreground">
            Help grow our community by sharing your favorite Amala location
          </p>
        </div>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Spot Details
            </CardTitle>
            <CardDescription>
              Provide information about the Amala spot you'd like to share
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="photo">Photo *</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-smooth">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg mx-auto"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                        }}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Camera className="w-12 h-12 text-muted-foreground mx-auto" />
                      <div>
                        <Button type="button" variant="outline" size="sm" asChild>
                          <label htmlFor="photo" className="cursor-pointer">
                            Choose Photo
                          </label>
                        </Button>
                        <input
                          id="photo"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          required
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Upload a clear photo of the Amala spot
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Spot Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Mama Cass Buka"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what makes this Amala spot special..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="min-h-[100px]"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Location *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={getCurrentLocation}
                    disabled={loading}
                  >
                    {loading && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                    <MapPin className="w-3 h-3 mr-1" />
                    Use Current Location
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lat">Latitude</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="any"
                      placeholder="6.5244"
                      value={formData.lat || ''}
                      onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lng">Longitude</Label>
                    <Input
                      id="lng"
                      type="number"
                      step="any"
                      placeholder="3.3792"
                      value={formData.lng || ''}
                      onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Submitting...' : 'Submit Spot'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Submit;
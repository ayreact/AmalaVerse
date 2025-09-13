import { AmalaSpot } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { MapPin, Star, Users } from 'lucide-react';
import { Button } from './button';

interface SpotCardProps {
  spot: AmalaSpot;
  onClick?: () => void;
  showActions?: boolean;
  className?: string;
}

export const SpotCard = ({ spot, onClick, showActions = false, className }: SpotCardProps) => {
  return (
    <Card className={`glass-card hover:shadow-glow transition-glass cursor-pointer group border-glass-border ${className}`} onClick={onClick}>
      <div className="relative">
        <img
          src={spot.photo_url || '/placeholder.svg'}
          alt={spot.name}
          className="w-full h-48 object-cover rounded-t-2xl group-hover:scale-105 transition-glass"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        {spot.verified && (
          <Badge className="absolute top-2 right-2 glass text-primary backdrop-blur-md border-glass-border">
            Verified
          </Badge>
        )}
        {spot.rating && (
          <div className="absolute top-2 left-2 glass rounded-xl px-2 py-1 flex items-center space-x-1">
            <Star className="w-3 h-3 fill-accent text-accent" />
            <span className="text-xs font-medium">{spot.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg group-hover:bg-gradient-primary group-hover:bg-clip-text group-hover:text-transparent transition-glass line-clamp-2 font-display">
            {spot.name}
          </CardTitle>
        </div>
        <CardDescription className="line-clamp-2 text-muted-foreground">
          {spot.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center space-x-1">
            <MapPin className="w-3 h-3" />
            <span>
              {spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}
            </span>
          </div>
          {spot.verification_count !== undefined && (
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{spot.verification_count} votes</span>
            </div>
          )}
        </div>
        
        {showActions && (
          <div className="flex space-x-2">
            <Button variant="glass" size="sm" className="flex-1">
              View Details
            </Button>
            <Button variant="primary" size="sm" className="flex-1">
              Get Directions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
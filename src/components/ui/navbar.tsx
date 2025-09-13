import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './button';
import { MapPin, Menu, X, MessageCircle, Upload, CheckSquare, Home, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { authAPI } from '@/lib/api';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('auth_token');

  const handleLogout = () => {
    authAPI.logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/discover', label: 'Discover', icon: MapPin },
    { href: '/submit', label: 'Submit Spot', icon: Upload },
    { href: '/chat', label: 'AI Chat', icon: MessageCircle },
    { href: '/verify', label: 'Verify', icon: CheckSquare },
    { href: '/trending', label: 'Trending', icon: TrendingUp },
  ];

  return (
    <nav className="glass-card sticky top-0 z-50 border-b border-glass-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:shadow-glow transition-glass">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold bg-gradient-primary bg-clip-text text-transparent">
              AmalaVerse
            </span>
          </Link>

          {/* Desktop Navigation - Hide some items on medium screens */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="glass-button flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-glass"
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Medium Screen Navigation - Compact version */}
          <div className="hidden md:flex lg:hidden items-center space-x-1">
            {navLinks.slice(0, 4).map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="glass-button flex items-center justify-center p-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-glass"
                  title={link.label}
                >
                  <Icon className="w-4 h-4" />
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <Button variant="glass" onClick={handleLogout} size="sm">
                Logout
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="glass" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="glass"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={cn(
        "md:hidden glass border-t border-glass-border transition-all duration-300 ease-in-out",
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      )}>
        <div className="px-4 py-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="glass-button flex items-center space-x-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-glass"
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          
          <div className="pt-2 border-t border-glass-border">
            {isAuthenticated ? (
              <Button variant="glass" onClick={handleLogout} className="w-full">
                Logout
              </Button>
            ) : (
              <div className="space-y-2">
                <Link to="/login" onClick={() => setIsOpen(false)} className="block">
                  <Button variant="glass" className="w-full">Login</Button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block">
                  <Button variant="primary" className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
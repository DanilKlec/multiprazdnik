import { 
  Beaker, 
  Droplet, 
  Music, 
  Sparkles, 
  Home, 
  Car,
  Phone,
  MapPin,
  Instagram,
  Menu,
  X,
  ArrowRight,
  Star,
  Heart,
  Calendar,
  Compass,
  Sparkle,
  MessageSquare,
  Plus,
  Check,
  ChevronRight,
  Gift,
  Smile,
  Users
} from 'lucide-react';

export const IconResolver = ({ name, className = '', size = 24 }: { name: string; className?: string; size?: number }) => {
  switch (name) {
    case 'Beaker':
      return <Beaker className={className} size={size} />;
    case 'Droplet':
      return <Droplet className={className} size={size} />;
    case 'Music':
      return <Music className={className} size={size} />;
    case 'Sparkles':
      return <Sparkles className={className} size={size} />;
    case 'Home':
      return <Home className={className} size={size} />;
    case 'Car':
      return <Car className={className} size={size} />;
    case 'Phone':
      return <Phone className={className} size={size} />;
    case 'MapPin':
      return <MapPin className={className} size={size} />;
    case 'Instagram':
      return <Instagram className={className} size={size} />;
    case 'Menu':
      return <Menu className={className} size={size} />;
    case 'X':
      return <X className={className} size={size} />;
    case 'ArrowRight':
      return <ArrowRight className={className} size={size} />;
    case 'Star':
      return <Star className={className} size={size} />;
    case 'Heart':
      return <Heart className={className} size={size} />;
    case 'Calendar':
      return <Calendar className={className} size={size} />;
    case 'Compass':
      return <Compass className={className} size={size} />;
    case 'Sparkle':
      return <Sparkle className={className} size={size} />;
    case 'MessageSquare':
      return <MessageSquare className={className} size={size} />;
    case 'Plus':
      return <Plus className={className} size={size} />;
    case 'Check':
      return <Check className={className} size={size} />;
    case 'ChevronRight':
      return <ChevronRight className={className} size={size} />;
    case 'Gift':
      return <Gift className={className} size={size} />;
    case 'Smile':
      return <Smile className={className} size={size} />;
    case 'Users':
      return <Users className={className} size={size} />;
    default:
      return <Sparkles className={className} size={size} />;
  }
};

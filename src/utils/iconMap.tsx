import React from 'react';
import {
  Pickaxe,
  Hammer,
  Cog,
  Droplet,
  FlaskConical,
  Building2,
  Truck,
  Wrench,
  Package,
  HardHat,
  Layers,
  Activity,
  LucideProps,
} from 'lucide-react';

export const renderServiceIcon = (iconName?: string, props: { className?: string; size?: number | string } = { className: 'w-6 h-6 text-amber-500' }) => {
  switch (iconName) {
    case 'Pickaxe':
      return <Pickaxe {...props} />;
    case 'Hammer':
      return <Hammer {...props} />;
    case 'Cog':
      return <Cog {...props} />;
    case 'Droplet':
      return <Droplet {...props} />;
    case 'FlaskConical':
      return <FlaskConical {...props} />;
    case 'Building2':
      return <Building2 {...props} />;
    case 'Truck':
      return <Truck {...props} />;
    case 'Wrench':
      return <Wrench {...props} />;
    case 'Package':
      return <Package {...props} />;
    case 'Layers':
      return <Layers {...props} />;
    case 'Activity':
      return <Activity {...props} />;
    default:
      return <HardHat {...props} />;
  }
};

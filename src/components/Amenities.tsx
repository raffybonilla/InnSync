'use client';

interface AmenitiesProps {
  amenities?: string[];
  maxDisplay?: number;
  layout?: 'row' | 'grid';
  size?: 'sm' | 'md' | 'lg';
}

const AMENITIES_MAP: Record<string, { label: string; icon: string; description: string }> = {
  wifi: { label: 'Free Wi-Fi', icon: '📶', description: 'High-speed internet' },
  pool: { label: 'Pool Access', icon: '🏊', description: 'Swimming pool' },
  breakfast: { label: 'Breakfast', icon: '🍳', description: 'Free breakfast included' },
  tv: { label: 'Smart TV', icon: '📺', description: 'Entertainment system' },
  aircon: { label: 'Air Conditioning', icon: '❄️', description: 'Climate control' },
  mini_fridge: { label: 'Mini Bar/Fridge', icon: '🧊', description: 'In-room refrigerator' },
  hairdryer: { label: 'Hair Dryer', icon: '💇', description: 'Professional hair dryer' },
  dining: { label: 'Dining Area', icon: '🍽️', description: 'Dining room' },
  bathrobe: { label: 'Bathrobe & Slippers', icon: '🧥', description: 'Luxury amenities' },
  workspace: { label: 'Work Desk', icon: '💼', description: 'Business center' },
  safe: { label: 'In-room Safe', icon: '🔐', description: 'Security deposit box' },
  view: { label: 'City/Ocean View', icon: '🌆', description: 'Scenic view' },
};

export default function Amenities({
  amenities = [],
  maxDisplay = 6,
  layout = 'grid',
  size = 'md',
}: AmenitiesProps) {
  if (!amenities || amenities.length === 0) {
    return null;
  }

  const displayAmenities = amenities.slice(0, maxDisplay);
  const remainingCount = amenities.length - maxDisplay;

  const sizeClasses = {
    sm: 'text-xs gap-2',
    md: 'text-sm gap-3',
    lg: 'text-base gap-4',
  };

  const iconSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  if (layout === 'row') {
    return (
      <div className={`flex flex-wrap ${sizeClasses[size]}`}>
        {displayAmenities.map((amenityId) => {
          const amenity = AMENITIES_MAP[amenityId];
          if (!amenity) return null;
          return (
            <div
              key={amenityId}
              className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-full"
            >
              <span className={iconSizes[size]}>{amenity.icon}</span>
              <span className="font-medium text-slate-700">{amenity.label}</span>
            </div>
          );
        })}
        {remainingCount > 0 && (
          <div className="flex items-center gap-1 bg-blue-100 px-3 py-1.5 rounded-full">
            <span className="font-semibold text-blue-700">+{remainingCount} more</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 ${sizeClasses[size]}`}>
      {displayAmenities.map((amenityId) => {
        const amenity = AMENITIES_MAP[amenityId];
        if (!amenity) return null;
        return (
          <div
            key={amenityId}
            className="flex flex-col items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
          >
            <span className={`${iconSizes[size]} mb-1`}>{amenity.icon}</span>
            <span className="font-medium text-center text-slate-700">{amenity.label}</span>
          </div>
        );
      })}
      {remainingCount > 0 && (
        <div className="flex flex-col items-center justify-center p-3 bg-blue-50 rounded-lg">
          <span className={`${iconSizes[size]} mb-1`}>✨</span>
          <span className="font-semibold text-center text-blue-700">+{remainingCount}</span>
        </div>
      )}
    </div>
  );
}

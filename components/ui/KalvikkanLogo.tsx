import React from 'react';

interface KalvikkanLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
  lightText?: boolean;
}

export const KalvikkanLogo: React.FC<KalvikkanLogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = true,
  className = '',
  lightText = false,
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Eye + Graduation Cap + Trend Arrow Logo Icon */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full crest-glow"
        >
          {/* Royal crest: navy disc, double gold ring, crown */}
          <circle cx="100" cy="104" r="94" fill="#0c1535" />
          <circle cx="100" cy="104" r="94" fill="none" stroke="#D4AF37" strokeWidth="6" />
          <circle cx="100" cy="104" r="83" fill="none" stroke="#F5C542" strokeWidth="1.5" strokeDasharray="3 4" />
          <path d="M 72,22 L 80,6 L 90,16 L 100,2 L 110,16 L 120,6 L 128,22 Z" fill="#F5C542" stroke="#B8891A" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="80" cy="6" r="3" fill="#fff" /><circle cx="100" cy="2" r="3.5" fill="#fff" /><circle cx="120" cy="6" r="3" fill="#fff" />

          {/* Sun Rays */}
          <line x1="100" y1="15" x2="100" y2="32" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
          <line x1="60" y1="30" x2="70" y2="44" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
          <line x1="140" y1="30" x2="130" y2="44" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
          <line x1="30" y1="58" x2="46" y2="68" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
          <line x1="170" y1="58" x2="154" y2="68" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />

          {/* Outer Blue Eye Frame */}
          <path
            d="M 20,110 Q 100,45 180,110 Q 100,165 20,110 Z"
            fill="none"
            stroke="#F5C542"
            strokeWidth="11"
            strokeLinejoin="round"
          />

          {/* Inner Iris */}
          <circle cx="100" cy="106" r="32" fill="#14214F" stroke="#D4AF37" strokeWidth="3" />

          {/* Graduation Cap Silhouette inside Iris */}
          <path d="M 82,104 L 100,94 L 118,104 L 100,114 Z" fill="#FFFFFF" />
          <path d="M 88,108 L 88,116 Q 100,122 112,116 L 112,108 Z" fill="#E2E8F0" />
          <circle cx="100" cy="94" r="2.5" fill="#F59E0B" />
          <line x1="100" y1="94" x2="114" y2="102" stroke="#F59E0B" strokeWidth="2" />

          {/* Open Book Base */}
          <path
            d="M 30,135 Q 100,165 100,140 Q 100,165 170,135 Q 100,185 30,135 Z"
            fill="#8FADF5"
          />

          {/* Green Upward Growth Arrow */}
          <path
            d="M 125,145 Q 155,120 180,60"
            fill="none"
            stroke="#10B981"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <polygon points="180,45 165,65 185,75" fill="#10B981" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 font-black tracking-tight leading-none">
            <span className={`${textSizes[size]} ${lightText ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
              கல்வி
            </span>
            <span className={`${textSizes[size]} text-gold-600 dark:text-gold-300 font-extrabold`}>
              கண்
            </span>
          </div>

          <span className="text-[10px] uppercase font-bold tracking-widest text-gold-600 dark:text-gold-400 mt-0.5">
            KALVIKKAN AI
          </span>

          {showTagline && (
            <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400 tracking-wider">
              கற்றல் | முன்னேற்றம் | சிறந்த எதிர்காலம்
            </span>
          )}
        </div>
      )}
    </div>
  );
};

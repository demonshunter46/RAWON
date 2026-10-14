import React from 'react';

interface RawonLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
  showIcon?: boolean;
}

export const RetroRawonWordmark: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const fontSize = size === 'sm' ? 'text-xl' : size === 'lg' ? 'text-4xl' : 'text-2xl sm:text-[28px]';
  const shadowScale = size === 'sm' ? 0.75 : size === 'lg' ? 1.35 : 1;
  const s = (val: number) => (val * shadowScale).toFixed(1);

  // Stepped 3D multi-layer shadow replicating the retro 70s/80s layered drop shadow:
  // Layer 1: Deep Teal (#0C7C79)
  // Layer 2: Vibrant Amber Orange (#F28522)
  // Layer 3: Burnt Terracotta (#CE4915)
  // Base: Soft ambient shadow
  const retro3DShadow = `
    ${s(0.6)}px ${s(1.0)}px 0 #0C7C79,
    ${s(1.2)}px ${s(1.9)}px 0 #0C7C79,
    ${s(1.8)}px ${s(2.7)}px 0 #0C7C79,
    ${s(2.4)}px ${s(3.5)}px 0 #0C7C79,
    ${s(3.0)}px ${s(4.4)}px 0 #F28522,
    ${s(3.6)}px ${s(5.2)}px 0 #F28522,
    ${s(4.2)}px ${s(6.0)}px 0 #F28522,
    ${s(4.8)}px ${s(6.8)}px 0 #F28522,
    ${s(5.4)}px ${s(7.8)}px 0 #CE4915,
    ${s(6.0)}px ${s(8.6)}px 0 #CE4915,
    ${s(6.6)}px ${s(9.4)}px 0 #CE4915,
    ${s(7.2)}px ${s(10.2)}px 0 #CE4915,
    ${s(7.0)}px ${s(13.0)}px 6px rgba(32, 43, 42, 0.22)
  `;

  return (
    <div className={`inline-block select-none pb-1.5 pr-2.5 ${className}`}>
      <span
        className={`${fontSize} font-black italic tracking-wider font-['Poppins'] select-none block leading-none`}
        style={{
          color: '#FFF8D6',
          WebkitTextStroke: size === 'lg' ? '0.8px #FFF8D6' : '0.5px #FFF8D6',
          textShadow: retro3DShadow,
        }}
        aria-label="RAWON"
      >
        RAWON
      </span>
    </div>
  );
};

export const RawonLogo: React.FC<RawonLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  showIcon = true,
}) => {
  const iconDimensions = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';
  const subtitleSize = size === 'sm' ? 'text-[8.5px]' : size === 'lg' ? 'text-xs' : 'text-[9.5px]';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Icon with gradient border and cyan dot */}
      {showIcon && (
        <div className={`relative ${iconDimensions} shrink-0`}>
          <div className="w-full h-full rounded-[14px] p-[2.5px] bg-gradient-to-br from-[#ff9559] via-[#ce4915] to-[#07b3b3] shadow-sm">
            <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center relative overflow-hidden">
              <svg
                viewBox="0 0 100 100"
                className="w-4/5 h-4/5 text-[#ce4915]"
                fill="currentColor"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="7"
                />
                <polygon
                  points="50,16 64,50 50,84 36,50"
                  fill="currentColor"
                  transform="rotate(45 50 50)"
                />
                <circle cx="50" cy="50" r="5" fill="#ffffff" />
              </svg>
            </div>
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#07b3b3] ring-2 ring-white shadow-xs" />
        </div>
      )}

      {/* Retro 3D Wordmark Branding */}
      <div>
        <RetroRawonWordmark size={size} />

        {/* by EduTech X */}
        <div className="flex items-center gap-1.5 -mt-0.5">
          <span className="text-[10px] font-medium text-[#6c7a78]">by</span>
          <span className="text-[10.5px] font-bold text-[#117d78] tracking-tight bg-[#e1f4f0] px-1.5 py-0.5 rounded border border-[#117d78]/20">
            EduTech X
          </span>
        </div>

        {showSubtitle && (
          <div className={`${subtitleSize} font-medium text-[#6c7a78] leading-tight mt-1 max-w-[190px]`}>
            Resilient Allocation &amp; Workload Optimization Network
          </div>
        )}
      </div>
    </div>
  );
};

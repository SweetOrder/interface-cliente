import React from "react";

interface SweetOrderLogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const SweetOrderLogo: React.FC<SweetOrderLogoProps> = ({ className, ...props }) => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <g clipPath="url(#clip0_1_2)">
        {/* Shopping Cart */}
        <path
          d="M10.5 34.5C12.1569 34.5 13.5 33.1569 13.5 31.5C13.5 29.8431 12.1569 28.5 10.5 28.5C8.84315 28.5 7.5 29.8431 7.5 31.5C7.5 33.1569 8.84315 34.5 10.5 34.5Z"
          stroke="#7e728a"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M28.5 34.5C30.1569 34.5 31.5 33.1569 31.5 31.5C31.5 29.8431 30.1569 28.5 28.5 28.5C26.8431 28.5 25.5 29.8431 25.5 31.5C25.5 33.1569 26.8431 34.5 28.5 34.5Z"
          stroke="#7e728a"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.5 1.5H7.5L11.49 20.3775C11.6389 21.0786 12.0291 21.7055 12.6001 22.1435C13.1712 22.5815 13.8863 22.8024 14.6025 22.7625H27.675C28.3912 22.8024 29.1063 22.5815 29.6774 22.1435C30.2484 21.7055 30.6386 21.0786 30.7875 20.3775L33 9H9"
          stroke="#7e728a"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Cart background */}
        <rect x="6" y="8" width="28" height="16" rx="2" fill="#b6e6ea" />

        {/* Two-tier Cake with Cherry */}
        <path
          d="M18 6C18.8284 6 19.5 5.32843 19.5 4.5C19.5 3.67157 18.8284 3 18 3C17.1716 3 16.5 3.67157 16.5 4.5C16.5 5.32843 17.1716 6 18 6Z"
          fill="#ff6b6b"
        />
        <path
          d="M19.9503 4.5C19.9503 4.5 20.4375 3.75 20.7 3.375C20.9625 3 21.375 3 21.4875 3.375C21.6 3.75 21.6 4.5 21.6 4.5"
          stroke="#7e728a"
          strokeWidth="0.5"
          strokeLinecap="round"
        />
        
        {/* Cake Body - Bottom Tier */}
        <rect x="12" y="9" width="12" height="6" rx="1" fill="#fff4e6" />
        <path
          d="M12 10C12 9.44772 12.4477 9 13 9H23C23.5523 9 24 9.44772 24 10V10.5C24 10.7761 23.7761 11 23.5 11H12.5C12.2239 11 12 10.7761 12 10.5V10Z"
          fill="#fcd1d1"
        />
        
        {/* Cake Body - Top Tier */}
        <rect x="14" y="15" width="8" height="6" rx="1" fill="#fff4e6" />
        <path
          d="M14 16C14 15.4477 14.4477 15 15 15H21C21.5523 15 22 15.4477 22 16V16.5C22 16.7761 21.7761 17 21.5 17H14.5C14.2239 17 14 16.7761 14 16.5V16Z"
          fill="#fcd1d1"
        />
        
        {/* Frosting on top tier */}
        <path
          d="M14 15.5C14 15.2239 14.2239 15 14.5 15H21.5C21.7761 15 22 15.2239 22 15.5C22 15.7761 21.7761 16 21.5 16H14.5C14.2239 16 14 15.7761 14 15.5Z"
          fill="#fcd1d1"
        />
        
        {/* Frosting on bottom tier */}
        <path
          d="M12 10C12 9.44772 12.4477 9 13 9H23C23.5523 9 24 9.44772 24 10C24 10.5523 23.5523 11 23 11H13C12.4477 11 12 10.5523 12 10Z"
          fill="#fcd1d1"
        />

        {/* Grid lines for cart */}
        <path d="M10 8V22" stroke="#7e728a" strokeWidth="0.75" />
        <path d="M14 8V22" stroke="#7e728a" strokeWidth="0.75" />
        <path d="M18 8V22" stroke="#7e728a" strokeWidth="0.75" />
        <path d="M22 8V22" stroke="#7e728a" strokeWidth="0.75" />
        <path d="M26 8V22" stroke="#7e728a" strokeWidth="0.75" />
        <path d="M30 8V22" stroke="#7e728a" strokeWidth="0.75" />
        <path d="M6 12H34" stroke="#7e728a" strokeWidth="0.75" />
        <path d="M6 16H34" stroke="#7e728a" strokeWidth="0.75" />
        <path d="M6 20H34" stroke="#7e728a" strokeWidth="0.75" />
      </g>
      <defs>
        <clipPath id="clip0_1_2">
          <rect width="48" height="48" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

import React from "react";

interface SweetOrderTextLogoProps {
  className?: string;
}

export const SweetOrderTextLogo: React.FC<SweetOrderTextLogoProps> = ({ className }) => {
  return (
    <div className={`font-bold text-3xl font-montserrat tracking-wide ${className}`}>
      <span className="text-[#f74ea7]">Sweet</span>
      <span className="text-[#4ECDC4]">Order</span>
    </div>
  );
};
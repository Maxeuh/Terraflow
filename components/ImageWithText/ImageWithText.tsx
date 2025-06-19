import React from "react";

interface ImageWithTextProps {
  lien : string
  imageUrl: string;
  altText?: string;
  maincaption: string;
  secondarycaption : string
  width?: string; // ex: "w-48", "w-full"
}

const ImageWithText: React.FC<ImageWithTextProps> = ({
  lien,
  imageUrl,
  altText = "",
  maincaption,
  secondarycaption,
  width = "w-48",
}) => {
  return (
    <div className={`flex flex-col items-center ${width}`}>
        <a href={lien} target="_blank" rel="noopener noreferrer">
      <img src={imageUrl} alt={altText} className="rounded-lg shadow-md" />
      
      <h2 className="mt-4 text-xl font-bold text-gray-900 text-center">{maincaption}</h2>
      <p className="mt-2 text-sm text-gray-600 text-center">{secondarycaption}</p>
      </a>
    </div>
    
  );
};

export default ImageWithText;
import Image from 'next/image';
import React from 'react';

type ProfileImageProps = {
  src?: string | null;
  className?: string;
};

function ProfileImage({ src, className = '' }: ProfileImageProps) {
  return (
    <div className={`relative overflow-hidden rounded-full ${className}`}>
      {src == null ? null : <Image src={src} alt="Profile Image" quality={100} fill />}
    </div>
  );
}

export default ProfileImage;

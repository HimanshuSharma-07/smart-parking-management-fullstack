import React from "react";

interface UserProfileProps {
  name: string;
  image?: string; // optional profile image
}

const UserProfile: React.FC<UserProfileProps> = ({ name, image }) => {
  // Generate initials if no image
  const getInitials = (name: string) => {
    const names = name.split(" ");
    return names.map(n => n[0]).join("").toUpperCase();
  };

  return (
    <div className="flex items-center gap-3">
     
      {/* Profile Image or Initials */}
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-10 h-10 rounded-full object-cover border"
        />
      ) : (
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {getInitials(name)}
        </div>
      )}
    </div>
  );
};

export default UserProfile;

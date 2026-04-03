import api from "./api";
import { AuthUser } from "../store/authSlice";

export interface UpdateProfileData {
  fullName?: string;
  phoneNo?: string;
  email?: string;
}

export const updateProfileDetails = async (data: UpdateProfileData) => {
  const response = await api.patch<{ data: AuthUser }>("/users/update-details", data);
  return response.data.data;
};

export const updateProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append("profileImg", file);
  
  const response = await api.patch<{ data: AuthUser }>("/users/update-profile-img", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
};

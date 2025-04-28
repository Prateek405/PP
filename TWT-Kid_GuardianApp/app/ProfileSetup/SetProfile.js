import React from 'react'
import ProfileForm from "./index"
import { useRouter } from "expo-router";
import { addProfileData } from "../../utils/sqlite.js";



  const router = useRouter();

  const handleSubmit = async (data) => {
    try {
      await addProfileData(data);
      router.push("start/First");
    } catch (error) {
      console.error("Error storing user data in SetProfile", error);
    }
}
  

export default function SetProfile() {
  return (
    <div><ProfileForm onSubmit={handleSubmit}/></div>
  )
}

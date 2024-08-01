// Profile.js
import React, { useEffect, useState } from "react";
import EditProfileForm from "./editProfileForm";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://lai24a-k6.tekomits.my.id/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await response.json();
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleEditProfile = async ({ newUsername, newEmail }) => {
    try {
      // Custom validation to check if any changes were made
      if (userData.username === newUsername && userData.email === newEmail) {
        setErrorMessage("No changes were made.");
        return;
      }

      // Logic to handle editing profile
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newUsername, newEmail }),
      });
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      // Update user data after successful update
      // ...

      setUserData((prevUserData) => ({
        ...prevUserData,
        username: newUsername,
        email: newEmail,
      }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.message === "Failed to update profile") {
        // Handle specific error message from server
        setErrorMessage("Username already exists or an error occurred while updating profile.");
      } else {
        // Handle other error messages
        setErrorMessage("An error occurred while updating profile.");
      }
    }
  };

  return (
    <div>
      <h1>User Profile</h1>
      {userData && (
        <>
          {!isEditing ? (
            <>
              <p>Username: {userData.username}</p>
              <p>Email: {userData.email}</p>
              <button className="edit-profile-button" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            </>
          ) : (
            <EditProfileForm newUsername={newUsername} setNewUsername={setNewUsername} newEmail={newEmail} setNewEmail={setNewEmail} onSubmit={handleEditProfile} onCancel={() => setIsEditing(false)} errorMessage={errorMessage} />
          )}
        </>
      )}
    </div>
  );
};

export default Profile;

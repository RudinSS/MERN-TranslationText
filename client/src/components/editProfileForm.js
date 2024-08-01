import React, { useState } from "react";
import ChangePasswordForm from "./changePassword";

const EditProfileForm = ({ newUsername, setNewUsername, newEmail, setNewEmail, onSubmit, onCancel, errorMessage }) => {
  const [loading, setLoading] = useState(false);
  const [changePasswordMessage, setChangePasswordMessage] = useState("");
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false); // State untuk menampilkan form perubahan password

  const handleChangePassword = async ({ oldPassword, newPassword }) => {
    try {
      const response = await fetch("https://lai24a-k6.tekomits.my.id/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await response.text();
      setChangePasswordMessage(data);
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await onSubmit({ newUsername, newEmail });

    setLoading(false);
  };

  return (
    <div className="edit-profile-container">
      <form onSubmit={handleFormSubmit}>
        <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="New Username" required />
        <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="New Email (Optional)" />

        <div className="button-group">
          <button type="button" className="back-button" onClick={onCancel}>
            Back
          </button>
          <button type="submit" className="update-profile-button" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>

        {errorMessage && <p>{errorMessage}</p>}
      </form>

      {/* Tautan untuk membuka form perubahan password */}
      <button className="edit-profile-button" onClick={() => setShowChangePasswordForm(!showChangePasswordForm)}>
        {showChangePasswordForm ? "Hide" : "Change Password"}
      </button>

      {/* Form perubahan password */}
      {showChangePasswordForm && <ChangePasswordForm onSubmit={handleChangePassword} errorMessage={changePasswordMessage} />}
    </div>
  );
};

export default EditProfileForm;

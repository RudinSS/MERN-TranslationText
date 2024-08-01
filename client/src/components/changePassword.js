import React, { useState } from "react";

const ChangePasswordForm = ({ onSubmit, errorMessage }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate password fields
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    // Call onSubmit function with password data
    await onSubmit({ oldPassword, newPassword });

    setLoading(false);
  };

  return (
    <div className="change-password-container">
      <form onSubmit={handleFormSubmit}>
        <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Old Password" required />
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" required />
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" required />

        <button type="submit" className="edit-profile-button" disabled={loading}>
          {loading ? "Changing..." : "Change Password"}
        </button>

        {errorMessage && <p>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default ChangePasswordForm;

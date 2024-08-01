// src/components/Logout.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Hapus token dari localStorage dan arahkan ke halaman login
    localStorage.removeItem("token");
    navigate("/");
  }, [navigate]);

  return null; // Tidak perlu menampilkan apapun
};

export default Logout;

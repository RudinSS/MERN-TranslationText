// src/components/History.js
import React, { useEffect, useState } from "react";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("https://lai24a-k6.tekomits.my.id/api/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setHistory(data);
      } catch (error) {
        setError("Error fetching translation history: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleRemove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://lai24a-k6.tekomits.my.id/api/history/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error removing translation");
      }

      // Refresh history after successful removal
      const fetchedHistory = await response.json();
      setHistory(fetchedHistory);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="translation-history">
      <h2>Translation History</h2>
      <table>
        <thead>
          <tr>
            <th>Created At</th>
            <th>Original Text</th>
            <th>Translated Text</th>
            <th>Source Language</th>
            <th>Target Language</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item) => (
            <tr key={item._id}>
              <td>{new Date(item.createdAt).toLocaleString()}</td>
              <td>{item.originalText}</td>
              <td>{item.translatedText}</td>
              <td>{item.sourceLanguage}</td>
              <td>{item.targetLanguage}</td>
              <td>
                <button onClick={() => handleRemove(item._id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;

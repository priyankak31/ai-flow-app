import React from "react";
import BASE_URL from "./config";


function HistoryPanel({ onClose }) {
  const [history, setHistory] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
  fetch(`${BASE_URL}/api/history`)
      .then((res) => res.json())
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="history-panel">
      <button className="close-history" onClick={onClose}>
        ✕
      </button>

      <h2>📚 Saved History</h2>

      {loading ? (
        <p className="empty-history">Loading...</p>
      ) : history.length === 0 ? (
        <p className="empty-history">No saved conversations yet.</p>
      ) : (
        history.map((item) => (
          <div key={item._id} className="history-item">
            <div className="history-prompt">Q: {item.prompt}</div>
            <div className="history-response">A: {item.response}</div>
            <div className="history-date">
              {new Date(item.savedAt).toLocaleString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default HistoryPanel;

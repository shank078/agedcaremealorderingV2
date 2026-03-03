import { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import "../styles/KitchenPage.css";

/* =========================================================
   KitchenPage
   ---------------------------------------------------------
   Operational dashboard for kitchen team.
   - Groups by category (Mains, Vegetables, Desserts, Carbs)
   - Sorted descending by count
   - Clickable counts reveal room numbers
   - Production-safe structure
========================================================= */

export default function KitchenPage() {

  /* =========================================================
     State
  ========================================================= */

  const [selectedDate, setSelectedDate] = useState("");
  const [mealType, setMealType] = useState("Lunch");

  const [summary, setSummary] = useState({
    mains: {},
    vegetables: {},
    desserts: {},
    carbs: {},
  });

  const [roomLists, setRoomLists] = useState({});
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);

  /* =========================================================
     Data Loader
  ========================================================= */

  async function loadKitchenData() {

    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    try {
      setLoading(true);

      const snapshot = await getDocs(
        collection(db, "orders", selectedDate, "residents")
      );

      // Structured grouping
      const groupedCounts = {
        mains: {},
        vegetables: {},
        desserts: {},
        carbs: {},
      };

      const groupedRooms = {
        mains: {},
        vegetables: {},
        desserts: {},
        carbs: {},
      };

      // Utility: Add item to group
      function addItem(group, name, room) {
        if (!name) return;

        groupedCounts[group][name] =
          (groupedCounts[group][name] || 0) + 1;

        groupedRooms[group][name] =
          groupedRooms[group][name] || [];

        groupedRooms[group][name].push(room);
      }

      snapshot.forEach((doc) => {
        const data = doc.data();
        const meal = data[mealType.toLowerCase()];
        if (!meal) return;

        const room = data.roomNumber;

        // MAIN
        addItem("mains", meal.main?.name, room);

        // CARB
        addItem("carbs", meal.carb, room);

        // VEGETABLES
        meal.veg?.forEach((v) =>
          addItem("vegetables", v.name, room)
        );

        // DESSERTS
        meal.dessert?.forEach((d) =>
          addItem("desserts", d.name, room)
        );
      });

      setSummary(groupedCounts);
      setRoomLists(groupedRooms);

    } catch (error) {
      console.error("Kitchen load error:", error);
      alert("Failed to load kitchen data.");
    } finally {
      setLoading(false);
    }
  }

  /* =========================================================
     Modal Handler
  ========================================================= */

  function openModal(group, item) {
    setModal({
      group,
      item,
      rooms:
        (roomLists[group]?.[item] || [])
          .sort((a, b) => a - b),
    });
  }

  /* =========================================================
     Render Section
     - Descending order
     - Clean grouping
  ========================================================= */

  function renderSection(title, groupKey) {

    const data = summary[groupKey] || {};

    const sorted = Object.entries(data)
      .sort((a, b) => b[1] - a[1]); // DESC

    if (sorted.length === 0) return null;

    return (
      <div className="kitchen-section">
        <h3>{title}</h3>

        {sorted.map(([name, count]) => (
          <div key={name} className="kitchen-item">
            <span className="kitchen-item-name">
              {name}
            </span>

            <span
              className="kitchen-count"
              onClick={() => openModal(groupKey, name)}
            >
              {count}
            </span>
          </div>
        ))}
      </div>
    );
  }

  /* =========================================================
     Render
  ========================================================= */

  return (
    <div className="kitchen-page">
      <div className="kitchen-card">

        <h1 className="kitchen-title">
          Kitchen Summary
        </h1>

        {/* Controls */}
        <div className="kitchen-controls">

          <input
            type="date"
            className="kitchen-date"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(e.target.value)
            }
          />

          <select
            className="kitchen-select"
            value={mealType}
            onChange={(e) =>
              setMealType(e.target.value)
            }
          >
            <option>Lunch</option>
            <option>Dinner</option>
          </select>

          <button
            className="btn"
            onClick={loadKitchenData}
          >
            Load
          </button>

        </div>

        {/* Loading */}
        {loading && <p>Loading...</p>}

        {/* Summary Sections */}
        {!loading && (
          <div className="kitchen-grid">

            {renderSection("Mains", "mains")}
            {renderSection("Vegetables", "vegetables")}
            {renderSection("Desserts", "desserts")}
            {renderSection("Carbs", "carbs")}

          </div>
        )}

        {/* Modal */}
        {modal && (
          <div
            className="kitchen-modal-overlay"
            onClick={() => setModal(null)}
          >
            <div
              className="kitchen-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{modal.item}</h2>

              <div className="kitchen-room-list">
                {modal.rooms.length === 0 ? (
                  <p>No rooms</p>
                ) : (
                  modal.rooms.map((room, i) => (
                    <div
                      key={i}
                      className="kitchen-room"
                    >
                      {room}
                    </div>
                  ))
                )}
              </div>

              <button
                className="btn"
                onClick={() => setModal(null)}
              >
                Close
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

import DateSelector from "../components/DateSelector";
import MealSelector from "../components/MealSelector";

import "../styles/KitchenPage.css";

/* =========================================================
   Utility
   ---------------------------------------------------------
   Local-safe date formatting (same as OrderPage)
========================================================= */

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/* =========================================================
   KitchenPage
   ---------------------------------------------------------
   Operational dashboard for kitchen team.

   UX Flow:
   1. Select date (Today / Tomorrow / Custom)
   2. Select meal (Lunch / Dinner)
   3. Header collapses to summary title
   4. Data auto-loads
   5. Sections grouped + sorted descending
   6. Click count → show room numbers
========================================================= */

export default function KitchenPage() {

  /* =========================================================
     Date Setup (Same Pattern as OrderPage)
  ========================================================= */

  const todayDate = new Date();
  const tomorrowDate = new Date();
  tomorrowDate.setDate(todayDate.getDate() + 1);

  const today = formatDate(todayDate);
  const tomorrow = formatDate(tomorrowDate);

  /* =========================================================
     State
  ========================================================= */

  const [selectedDate, setSelectedDate] = useState(null);
  const [mealType, setMealType] = useState(null);

  const [summary, setSummary] = useState({
    mains: {},
    vegetables: {},
    desserts: {},
    carbs: {},
    salad: {},
  });

  const [roomLists, setRoomLists] = useState({});
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);

  /* =========================================================
     Data Loader
     ---------------------------------------------------------
     Groups data by category.
     Fully defensive against undefined structures.
  ========================================================= */

  async function loadKitchenData() {

    if (!selectedDate || !mealType) return;

    try {
      setLoading(true);

      const snapshot = await getDocs(
        collection(db, "orders", selectedDate, "residents")
      );

      const groupedCounts = {
        mains: {},
        vegetables: {},
        desserts: {},
        carbs: {},
        salad: {},
      };

      const groupedRooms = {
        mains: {},
        vegetables: {},
        desserts: {},
        carbs: {},
        salad: {},
      };

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
        const meal = data?.[mealType.toLowerCase()];
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

        // SALAD
        if (meal.salad) {
          addItem("salad", "Salad", room);
        }
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
     Auto Load Trigger
     ---------------------------------------------------------
     Kitchen behaves reactively like OrderPage.
  ========================================================= */

  useEffect(() => {
    if (!selectedDate || !mealType) return;
    loadKitchenData();
  }, [selectedDate, mealType]);

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
     ---------------------------------------------------------
     Sorted descending by count.
  ========================================================= */

  function renderSection(title, groupKey) {

    const data = summary[groupKey] || {};

    const sorted = Object.entries(data)
      .sort((a, b) => b[1] - a[1]);

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
     Derived UI State
  ========================================================= */

  const isReady = selectedDate && mealType;
  /* =========================================================
   Derived Data State
   ---------------------------------------------------------
   Determines if any section has real data.
   Prevents blank UI rendering.
========================================================= */

const hasData = Object.values(summary).some(
  (group) => Object.keys(group).length > 0
);

  /* =========================================================
     Render
  ========================================================= */

  return (
    <div className="page">
      <div className="order-card">

        {!isReady ? (
          <>
            <h1 className="page-title">
              Kitchen Summary
            </h1>

            <DateSelector
              today={today}
              tomorrow={tomorrow}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              setMealType={setMealType}
            />

            <MealSelector
              selectedDate={selectedDate}
              mealType={mealType}
              setMealType={setMealType}
            />
          </>
        ) : (
          <h1
            className="order-summary-title"
            onClick={() => setMealType(null)}
          >
            {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-AU", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })} ({mealType})
          </h1>
        )}

        {loading && <p>Loading...</p>}

       {/* =========================================================
    Summary Rendering
    - Loading handled separately
    - Empty state explicitly handled
========================================================= */}

{isReady && !loading && hasData && (
  <div className="kitchen-grid">
    {renderSection("Mains", "mains")}
    {renderSection("Vegetables", "vegetables")}
    {renderSection("Desserts", "desserts")}
    {renderSection("Carbs", "carbs")}
    {renderSection("Salad", "salad")}
  </div>
)}

{isReady && !loading && !hasData && (
  <div className="kitchen-empty">
    No orders found for this date and meal.
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
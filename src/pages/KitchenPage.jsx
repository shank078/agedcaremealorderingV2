import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

import DateSelector from "../components/DateSelector";
import MealSelector from "../components/MealSelector";

import KitchenDashboard from "../components/kitchen/KitchenDashboard";
import KitchenSection from "../components/kitchen/KitchenSection";
import SpecialRequestSection from "../components/kitchen/SpecialRequestSection";

import "../styles/KitchenPage.css";

/* =========================================================
   Utility
   ---------------------------------------------------------
   Local-safe date formatting (same pattern as OrderPage)
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
   Responsibilities:
   - Owns data loading
   - Owns modal state
   - Orchestrates layout
   - No layout rendering logic
========================================================= */

export default function KitchenPage() {

  /* =========================================================
     Date Setup
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
    carbs: {},
    salad: {},
    desserts: {},
    specialRequests: [],
  });

  const [roomLists, setRoomLists] = useState({});
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);

  /* =========================================================
     Data Loader
     ---------------------------------------------------------
     Groups data deterministically.
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
        carbs: {},
        salad: {},
        desserts: {},
        specialRequests: [],
      };

      const groupedRooms = {
        mains: {},
        vegetables: {},
        carbs: {},
        salad: {},
        desserts: {},
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

        addItem("mains", meal.main?.name, room);
        addItem("carbs", meal.carb, room);

        meal.veg?.forEach((v) =>
          addItem("vegetables", v.name, room)
        );

        meal.dessert?.forEach((d) =>
          addItem("desserts", d.name, room)
        );

        if (meal.salad) {
          addItem("salad", "Salad", room);
        }

        if (
          meal.specialRequest &&
          meal.specialRequest.trim() !== ""
        ) {
          groupedCounts.specialRequests.push({
            room,
            request: meal.specialRequest.trim(),
          });
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
     Auto Load
  ========================================================= */

  useEffect(() => {
    if (!selectedDate || !mealType) return;
    loadKitchenData();
  }, [selectedDate, mealType]);

  /* =========================================================
     Modal Logic
  ========================================================= */

  function openModal(group, item) {
    setModal({
      type: "normal",
      item,
      rooms:
        (roomLists[group]?.[item] || [])
          .sort((a, b) => a - b),
    });
  }

  /* =========================================================
     Derived State
  ========================================================= */

  const isReady = selectedDate && mealType;

  const hasData = Object.values(summary).some((group) => {
    if (Array.isArray(group)) return group.length > 0;
    return Object.keys(group).length > 0;
  });

  /* =========================================================
     Section Delegators
     ---------------------------------------------------------
     KitchenPage passes data into presentation components.
  ========================================================= */

  const renderMains = () => (
    <KitchenSection
      title="Mains"
      data={summary.mains}
      onCountClick={(name) =>
        openModal("mains", name)
      }
    />
  );

  const renderVegetables = () => (
    <KitchenSection
      title="Vegetables"
      data={summary.vegetables}
      onCountClick={(name) =>
        openModal("vegetables", name)
      }
    />
  );

  const renderCarbs = () => (
    <KitchenSection
      title="Carbs"
      data={summary.carbs}
      onCountClick={(name) =>
        openModal("carbs", name)
      }
    />
  );

  const renderSalad = () => (
    <KitchenSection
      title="Salad"
      data={summary.salad}
      onCountClick={(name) =>
        openModal("salad", name)
      }
    />
  );

  const renderDesserts = () => (
    <KitchenSection
      title="Desserts"
      data={summary.desserts}
      onCountClick={(name) =>
        openModal("desserts", name)
      }
    />
  );

  const renderSpecialRequests = () => (
    <SpecialRequestSection
      list={summary.specialRequests}
      onOpen={(list) =>
        setModal({
          type: "special",
          items: list.sort(
            (a, b) => a.room - b.room
          ),
        })
      }
    />
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
            {new Date(
              selectedDate + "T00:00:00"
            ).toLocaleDateString("en-AU", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })} ({mealType})
          </h1>
        )}

        {loading && <p>Loading...</p>}

        {isReady && !loading && hasData && (
          <KitchenDashboard
            renderMains={renderMains}
            renderVegetables={renderVegetables}
            renderCarbs={renderCarbs}
            renderSalad={renderSalad}
            renderDesserts={renderDesserts}
            renderSpecialRequests={renderSpecialRequests}
          />
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
              {modal.type === "special" ? (
                <>
                  <h2>Special Requests</h2>

                  <div className="kitchen-special-list">
                    {modal.items.map((item, i) => (
                      <div
                        key={i}
                        className="kitchen-special-item"
                      >
                        <strong>
                          Room {item.room}
                        </strong>
                        <div>{item.request}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h2>{modal.item}</h2>

                  <div className="kitchen-room-list">
                    {modal.rooms.map((room, i) => (
                      <div
                        key={i}
                        className="kitchen-room"
                      >
                        {room}
                      </div>
                    ))}
                  </div>
                </>
              )}

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
import { useEffect, useState } from "react";
import { getMenuByDate } from "../services/menuService";
import { getActiveResidents } from "../services/residentService";
import { saveResidentOrder, getResidentOrder } from "../services/orderService";

import DateSelector from "../components/DateSelector";
import MealSelector from "../components/MealSelector";
import RoomLookup from "../components/RoomLookup";
import MenuSection from "../components/MenuSection";
import SaveBar from "../components/SaveBar";

/* =========================
   Utility
========================= */

// ✅ Local-safe date formatting (no UTC conversion)
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* =========================
   Component
========================= */

export default function OrderPage() {

  /* =========================
     Date Setup
  ========================= */

  const todayDate = new Date();
  const tomorrowDate = new Date();
  tomorrowDate.setDate(todayDate.getDate() + 1);

  const today = formatDate(todayDate);
  const tomorrow = formatDate(tomorrowDate);

  /* =========================
     State
  ========================= */

  const [selectedDate, setSelectedDate] = useState(null);
  const [mealType, setMealType] = useState(null);
  const [roomNumber, setRoomNumber] = useState("");
  const [resident, setResident] = useState(null);
  const [residents, setResidents] = useState([]);

  // 🔴 Room validation error
  const [roomError, setRoomError] = useState("");

  // 🔵 Existing order message
  const [existingOrderMessage, setExistingOrderMessage] = useState("");

  const [menu, setMenu] = useState(null);
  const [menuLoading, setMenuLoading] = useState(false);

  const [selected, setSelected] = useState({
    main: "",
    veg: [],
    dessert: [],
    salad: false,
    specialRequest: "",
  });

  /* =========================
     Effects
  ========================= */

  // Load residents
  useEffect(() => {
    async function loadResidents() {
      const data = await getActiveResidents();
      setResidents(data);
    }
    loadResidents();
  }, []);

  // Load menu
  useEffect(() => {
    if (!selectedDate || !mealType) return;

    async function loadMenu() {
      setMenuLoading(true);
      const data = await getMenuByDate(selectedDate);
      setMenu(data);
      setMenuLoading(false);
    }

    loadMenu();
  }, [selectedDate, mealType]);

  // Find resident when room changes
  useEffect(() => {
    const found = residents.find(
      (r) => r.roomNumber === roomNumber
    );

    setResident(found || null);

    if (found) {
      setRoomError("");
    }

  }, [roomNumber, residents]);

  /* =========================
     Derived Data
  ========================= */

  const currentMenu =
    mealType === "Lunch" ? menu?.lunch : menu?.dinner;

  /* =========================
     Existing Order Detection
  ========================= */

  useEffect(() => {

    async function checkExistingOrder() {

      if (!resident || !selectedDate || !mealType || !currentMenu) {
        setExistingOrderMessage("");
        return;
      }

      const existing = await getResidentOrder(selectedDate, resident.id);

      if (existing && existing[mealType.toLowerCase()]) {

        const orderData = existing[mealType.toLowerCase()];

        // Map main
        const mainKey = Object.keys(currentMenu).find(
          (key) => currentMenu[key] === orderData.main
        );

        // Map veg
        const vegKeys = Object.keys(currentMenu).filter(
          (key) => orderData.veg?.includes(currentMenu[key])
        );

        // Map dessert
        const dessertKeys = Object.keys(currentMenu).filter(
          (key) => orderData.dessert?.includes(currentMenu[key])
        );

        setSelected({
          main: mainKey || "",
          veg: vegKeys || [],
          dessert: dessertKeys || [],
          salad: orderData.salad || false,
          specialRequest: orderData.specialRequest || "",
        });

        setExistingOrderMessage(
          "Existing order found for this resident. You may edit and resave."
        );

      } else {
        setExistingOrderMessage("");
      }
    }

    checkExistingOrder();

  }, [resident, selectedDate, mealType, currentMenu]);

  /* =========================
     UI State
  ========================= */

  const isOrdering = selectedDate && mealType;

  /* =========================
     Handlers
  ========================= */

  async function handleSave() {

    if (!resident) {
      setRoomError("Please enter a valid room number.");
      return false;
    }

    if (!currentMenu) return false;

    const carbEntry = Object.entries(currentMenu)
      .find(([key]) => key.startsWith("c"));

    const convertSelections = {
      main: selected.main
        ? currentMenu[selected.main]
        : null,

      carb: carbEntry ? carbEntry[1] : null,

      veg: selected.veg.map(
        (key) => currentMenu[key]
      ),

      dessert: selected.dessert.map(
        (key) => currentMenu[key]
      ),

      salad: selected.salad,
      specialRequest: selected.specialRequest.trim(),
    };

    await saveResidentOrder(selectedDate, resident.id, {
      roomNumber: resident.roomNumber,
      [mealType.toLowerCase()]: convertSelections,
    });

    return true;
  }

  /* =========================
     Render
  ========================= */

  return (
    <div className="page">
      <div className="order-card">

        {!isOrdering ? (
          <>
            <h1 className="page-title">Meal Ordering</h1>

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

        <RoomLookup
          selectedDate={selectedDate}
          mealType={mealType}
          roomNumber={roomNumber}
          setRoomNumber={setRoomNumber}
          resident={resident}
          roomError={roomError}
        />

        {existingOrderMessage && (
          <div className="existing-order-message">
            {existingOrderMessage}
          </div>
        )}

        <MenuSection
          selectedDate={selectedDate}
          mealType={mealType}
          menuLoading={menuLoading}
          currentMenu={currentMenu}
          selected={selected}
          setSelected={setSelected}
        />

        <SaveBar
          selectedDate={selectedDate}
          mealType={mealType}
          resident={resident}
          currentMenu={currentMenu}
          selected={selected}
          handleSave={handleSave}
        />

      </div>
    </div>
  );
}
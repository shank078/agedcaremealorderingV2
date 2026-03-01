import { useEffect, useState } from "react";
import { getMenuByDate } from "../services/menuService";
import { getActiveResidents } from "../services/residentService";
import { saveResidentOrder } from "../services/orderService";

import DateSelector from "../components/DateSelector";
import MealSelector from "../components/MealSelector";
import RoomLookup from "../components/RoomLookup";
import MenuSection from "../components/MenuSection";
import SaveBar from "../components/SaveBar";

/* =========================
   Utility
========================= */

function formatDate(date) {
  return date.toISOString().split("T")[0];
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

  // Load residents once
  useEffect(() => {
    async function loadResidents() {
      const data = await getActiveResidents();
      setResidents(data);
    }
    loadResidents();
  }, []);

  // Load menu when date + meal selected
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
  }, [roomNumber, residents]);

  /* =========================
     Derived Data
  ========================= */

  const currentMenu =
    mealType === "Lunch" ? menu?.lunch : menu?.dinner;

/* =========================
   UI State
========================= */

const isOrdering = selectedDate && mealType;
  /* =========================
     Handlers
  ========================= */
async function handleSave() {
  if (!resident || !currentMenu) return;

  // Find carb automatically (prefix "c")
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

  salad: selected.salad,   // ✅ NEW
  specialRequest: selected.specialRequest.trim(), // ✅ NEW
};
  await saveResidentOrder(selectedDate, resident.id, {
    roomNumber: resident.roomNumber,
    [mealType.toLowerCase()]: convertSelections,
  });
}
  

  /* =========================
     Render
  ========================= */

  return (
    <div className="page">
      <div className="order-card">

        {/* Page Title */}
       {/* =========================
    Header / Mode Switch
========================= */}

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
    onClick={() => {
      setMealType(null);
    }}
  >
    {new Date(selectedDate).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })} ({mealType})
  </h1>
)}

        {/* Room Lookup */}
        <RoomLookup
          selectedDate={selectedDate}
          mealType={mealType}
          roomNumber={roomNumber}
          setRoomNumber={setRoomNumber}
          resident={resident}
        />

        {/* Menu Options */}
        <MenuSection
          selectedDate={selectedDate}
          mealType={mealType}
          menuLoading={menuLoading}
          currentMenu={currentMenu}
          selected={selected}
          setSelected={setSelected}
        />

        {/* Save Action */}
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
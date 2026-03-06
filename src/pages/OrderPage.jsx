import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { getMenuByDate } from "../services/menuService";
import { getActiveResidents } from "../services/residentService";
import { saveResidentOrder, getResidentOrder } from "../services/orderService";
import DateSelector from "../components/DateSelector";
import MealSelector from "../components/MealSelector";
import RoomLookup from "../components/RoomLookup";
import MenuSection from "../components/MenuSection";
import SaveBar from "../components/SaveBar";
import { normalizeRoomInput } from "../utils/roomUtils";

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
   Date Setup (Stable Values)
========================= */

const today = useMemo(() => {
  const d = new Date();
  return formatDate(d);
}, []);

const tomorrow = useMemo(() => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return formatDate(d);
}, []);

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
/* =========================
   Resident Identity Tracker
   - Tracks previous resident ID
   - Used to detect true resident switch
   - Prevents wiping selections on temporary null
========================= */
const previousResidentIdRef = useRef(null);
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
 }, [today, tomorrow]);

  // 🔥 Preload today & tomorrow menu once (ordering speed boost)
useEffect(() => {
  async function preloadMenus() {
    await Promise.all([
      getMenuByDate(today),
      getMenuByDate(tomorrow),
    ]);
  }

  preloadMenus();
}, [today, tomorrow]);

  // Load menu
 useEffect(() => {
  if (!selectedDate) return;

  async function loadMenu() {
    setMenuLoading(true);
    const data = await getMenuByDate(selectedDate);
    setMenu(data);
    setMenuLoading(false);
  }

  loadMenu();
}, [selectedDate]);

  // Find resident when room changes
 useEffect(() => {

  const roomSort = normalizeRoomInput(roomNumber);

  if (!roomSort) {
    setResident(null);
    return;
  }

  const found = residents.find(
    (r) => r.roomSort === roomSort
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

  // =====================================================
// Order State Loader
// Selected state is derived from:
// resident.id + selectedDate + mealType
// Prevents cross-resident state leakage
// =====================================================

useEffect(() => {

  async function loadOrder() {

    const mealKey = mealType?.toLowerCase();

  // =========================
// Guard: Require date + meal + menu
// Do NOT wipe selections here
// =========================

if (!selectedDate || !mealKey || !currentMenu) {
  return;
}

// =========================
// Guard: Resident temporarily missing (user typing)
// Do NOT wipe selections
// =========================

if (!resident?.id) {
  return;
}
// =========================
// Identity Change Detection
// Reset selections ONLY when
// switching to a different resident
// =========================

if (
  previousResidentIdRef.current &&
  resident?.id &&
  previousResidentIdRef.current !== resident.id
) {
  setSelected({
    main: "",
    veg: [],
    dessert: [],
    salad: false,
    specialRequest: "",
  });

  setExistingOrderMessage("");
}

// Update tracker
// Detect if user already started an order
const userStartedOrder =
  selected.main ||
  selected.veg.length > 0 ||
  selected.dessert.length > 0 ||
  selected.salad ||
  selected.specialRequest;

// If room is entered AFTER user started selecting food,
// do not overwrite selections
if (!previousResidentIdRef.current && userStartedOrder) {
  previousResidentIdRef.current = resident.id;
  return;
}

// Update resident tracker AFTER checks
previousResidentIdRef.current = resident.id;
    const existing = await getResidentOrder(
      selectedDate,
      resident.id
    );

    const orderData = existing?.[mealKey];

    if (!orderData) {
      // No order exists → clean state
      setSelected({
        main: "",
        veg: [],
        dessert: [],
        salad: false,
        specialRequest: "",
      });
      setExistingOrderMessage("");
      return;
    }

    // Map structured order
    setSelected({
      main: orderData.main?.id || "",
      veg: orderData.veg?.map(v => v.id) || [],
      dessert: orderData.dessert?.map(d => d.id) || [],
      salad: orderData.salad || false,
      specialRequest: orderData.specialRequest || "",
    });

    setExistingOrderMessage(
      "Existing order found. You may edit and resave."
    );

  }

  loadOrder();

}, [resident?.id, selectedDate, mealType, currentMenu]);

  /* =========================
     UI State
  ========================= */

  const isOrdering = selectedDate && mealType;

  /* =========================
     Handlers
  ========================= */

const handleSave = useCallback(async () => {
  if (!resident) {
    setRoomError("Please enter a valid room number.");
    return false;
  }

  if (!currentMenu) return false;

  const selectedMainObj =
    currentMenu?.mains?.find(
      (item) => item.id === selected.main
    ) || null;

  const selectedVegObjs =
    currentMenu?.vegetables?.filter(
      (item) => selected.veg.includes(item.id)
    ) || [];

  const selectedDessertObjs =
    currentMenu?.desserts?.filter(
      (item) => selected.dessert.includes(item.id)
    ) || [];

  const convertSelections = {
    main: selectedMainObj,
    carb: currentMenu?.carb || null,
    veg: selectedVegObjs,
    dessert: selectedDessertObjs,
    salad: selected.salad,
    specialRequest: selected.specialRequest.trim(),
  };

  await saveResidentOrder(selectedDate, resident.id, {
    roomNumber: resident.roomNumber,
    [mealType.toLowerCase()]: convertSelections,
  });



  return true;
}, [resident, currentMenu, selected, selectedDate, mealType]);

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
  onClick={() => {
    setMealType(null);
    setExistingOrderMessage("");
  }}
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
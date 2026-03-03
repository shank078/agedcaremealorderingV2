import { useMemo, useEffect } from "react";

export default function MenuSection({
  selectedDate,
  mealType,
  menuLoading,
  currentMenu,
  selected,
  setSelected,
}) {
  if (!selectedDate || !mealType) return null;

  /* =========================
     Helpers
  ========================= */
 const handleSingleSelect = (category, key) => {
  setSelected((prev) => {
if (category === "main") {
   if (prev.main === key) {
    return {
      ...prev,
      main: "",      // clear main
      veg: [],       // clear vegetables when no main
    };
  }

  return {
    ...prev,

    // Select main
    main: key,

    // Turn off salad
    salad: false,

    // Restore vegetables if they were cleared
    veg:
  prev.veg.length === 0
    ? vegetables.map((vegItem) => vegItem.id)
    : prev.veg,
  };
}

    return {
      ...prev,
      [category]: key,
    };
  });
};

  const handleMultiSelect = (category, key, maxLimit = null) => {
    setSelected((prev) => {
      const alreadySelected = prev[category].includes(key);

      // Deselect if already selected
      if (alreadySelected) {
        return {
          ...prev,
          [category]: prev[category].filter((item) => item !== key),
        };
      }

      // Limit check (dessert max 2)
      if (maxLimit && prev[category].length >= maxLimit) {
        return prev;
      }

      return {
        ...prev,
        [category]: [...prev[category], key],
      };
    });
  };

  /* =========================
   Render Options (Array-Based Structure)
   Items are objects: { id, name }
   Order preserved from Firestore
========================= */

const renderOptions = (items, category, isMulti = false, maxLimit = null) => {
  if (!items.length) return null;

  return items.map((item) => {
    const { id, name } = item;

    const isSelected = isMulti
      ? selected[category]?.includes(id)
      : selected[category] === id;

    return (
      <button
        key={id}
        onClick={() =>
          isMulti
            ? handleMultiSelect(category, id, maxLimit)
            : handleSingleSelect(category, id)
        }
        className={`btn btn--option ${
          isSelected ? "btn--active" : ""
        }`}
      >
        {name}
      </button>
    );
  });
};
/* =========================
   Derived Menu Data (Array-Based Structure)
   Professional approach:
   - Database defines order
   - UI consumes arrays directly
========================= */

const mains = currentMenu?.mains || [];
const vegetables = currentMenu?.vegetables || [];
const desserts = currentMenu?.desserts || [];
const carb = currentMenu?.carb || null;

  /* =========================
     UI States
  ========================= */

  if (menuLoading) {
    return <div className="menu-loading">Loading menu...</div>;
  }

  if (!menuLoading && !currentMenu) {
    return (
      <div className="menu-error">
        No {mealType} menu available
      </div>
    );
  }

  /* =========================
     Render
  ========================= */

  return (
    <>
      {/* ================= Mains ================= */}
      <div className="menu-section">
        <h3>Mains</h3>

        <div className="option-grid">
          {renderOptions(mains, "main")}
        </div>

        {/* Carb display (non-selectable) */}
  {carb && (
  <div className="with-side">
    <span className="with-label">With:</span>
    <span className="with-value">{carb}</span>
  </div>
)}
      </div>
      {/* Salad Plate (static UI option) */}
{/* Salad + Special Request Row */}
<div className="menu-section menu-section--compact">
  <div className="salad-special-row">

    {/* Salad Button */}
    <button
      className={`btn btn--option ${
        selected.salad ? "btn--active" : ""
      }`}
      onClick={() =>
        setSelected((prev) => ({
          ...prev,
          salad: !prev.salad,
          main: !prev.salad ? "" : prev.main,
          veg: !prev.salad ? [] : prev.veg,
        }))
      }
    >
      🥗 Salad Plate
    </button>

    {/* Special Request Input */}
    <input
      type="text"
      className="special-request-input"
      placeholder="Special request"
      value={selected.specialRequest}
      onChange={(e) => {
        const value = e.target.value;

        setSelected((prev) => ({
          ...prev,
          specialRequest: value,
          veg:
            value.trim() !== "" && !prev.main
              ? []
              : prev.veg,
        }));
      }}
      maxLength={120}
    />

  </div>
</div>

      {/* ================= Vegetables ================= */}
      <div className="menu-section">
        <h3>Vegetables</h3>

        <div className="option-grid">
          {renderOptions(vegetables, "veg", true)}
        </div>
      </div>

      {/* ================= Dessert ================= */}
      <div className="menu-section">
        <h3>Dessert</h3>

        <div className="option-grid">
          {renderOptions(desserts, "dessert", true, 2)}
        </div>
      </div>
    </>
  );
}
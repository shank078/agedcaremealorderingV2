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

  const getCategoryItems = (prefix) => {
    if (!currentMenu) return [];

    return Object.entries(currentMenu).filter(([key]) =>
      key.startsWith(prefix)
    );
  };

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
        ? vegetables.map(([vegKey]) => vegKey)
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

  const renderOptions = (items, category, isMulti = false, maxLimit = null) => {
    if (!items.length) return null;

    return items.map(([key, value]) => {
      const isSelected = isMulti
        ? selected[category]?.includes(key)
        : selected[category] === key;

      return (
        <button
          key={key}
          onClick={() =>
            isMulti
              ? handleMultiSelect(category, key, maxLimit)
              : handleSingleSelect(category, key)
          }
          className={`btn btn--option ${
            isSelected ? "btn--active" : ""
          }`}
        >
          {value}
        </button>
      );
    });
  };

  /* =========================
     Derived Menu Data
  ========================= */

  const mains = useMemo(() => getCategoryItems("m"), [currentMenu]);
  const carbs = useMemo(() => getCategoryItems("c"), [currentMenu]);
  const vegetables = useMemo(() => getCategoryItems("v"), [currentMenu]);
  useEffect(() => {
  if (vegetables.length > 0 && selected.veg.length === 0) {
    setSelected((prev) => ({
      ...prev,
      veg: vegetables.map(([key]) => key),
    }));
  }
}, [vegetables]);
  const desserts = useMemo(() => getCategoryItems("d"), [currentMenu]);

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
        {carbs.length > 0 &&
  carbs.map(([key, value]) => (
    <div key={key} className="with-side">
  <span className="with-label">With:</span>
  <span className="with-value">{value}</span>
</div>
  ))}
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
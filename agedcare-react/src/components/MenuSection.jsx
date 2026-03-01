export default function MenuSection({
  selectedDate,
  mealType,
  menuLoading,
  currentMenu,
  selected,
  setSelected,
}) {
  if (!selectedDate || !mealType) return null;

  function renderOptions(prefix, category) {
    if (!currentMenu) return null;

    return Object.entries(currentMenu)
      .filter(([key]) => key.startsWith(prefix))
      .map(([key, value]) => (
        <button
          key={key}
          onClick={() =>
            setSelected((prev) => ({
              ...prev,
              [category]: key,
            }))
          }
          className={`btn btn--option ${
            selected[category] === key
              ? "btn--active btn--selected"
              : ""
          }`}
        >
          {value}
        </button>
      ));
  }

  return (
    <>
      {menuLoading && (
        <div className="menu-loading">
          Loading menu...
        </div>
      )}

      {!menuLoading && !currentMenu && (
        <div className="menu-error">
          No {mealType} menu available
        </div>
      )}

      {currentMenu && (
        <>
          <div className="menu-section">
            <h3>Mains</h3>
            <div className="option-grid">
              {renderOptions("m", "main")}
            </div>
          </div>

          <div className="menu-section">
            <h3>Vegetables</h3>
            <div className="option-grid">
              {renderOptions("v", "veg")}
            </div>
          </div>

          <div className="menu-section">
            <h3>Dessert</h3>
            <div className="option-grid">
              {renderOptions("d", "dessert")}
            </div>
          </div>
        </>
      )}
    </>
  );
}
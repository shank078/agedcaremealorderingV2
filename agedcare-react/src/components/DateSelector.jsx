/* =========================
   Date Selector Component
========================= */

export default function DateSelector({
  today,
  tomorrow,
  selectedDate,
  setSelectedDate,
  setMealType,
}) {

 function handleCustomDate(e) {
  const selected = new Date(e.target.value);
  const formatted = selected.toISOString().split("T")[0];

  setSelectedDate(formatted);
  setMealType(null);
}
  return (
    <div className="date-selector">

      {/* Today / Tomorrow Buttons */}
      <div className="date-buttons">
        <button
          onClick={() => {
            setSelectedDate(today);
            setMealType(null);
          }}
          className={`btn ${
            selectedDate === today ? "btn--active" : ""
          }`}
        >
          Today
        </button>

        <button
          onClick={() => {
            setSelectedDate(tomorrow);
            setMealType(null);
          }}
          className={`btn ${
            selectedDate === tomorrow ? "btn--active" : ""
          }`}
        >
          Tomorrow
        </button>
      </div>

      {/* Custom Date Picker */}
      <div className="custom-date-slot">
        <input
          type="date"
          className="date-input"
          onChange={handleCustomDate}
        />
      </div>

    </div>
  );
}
export default function MealSelector({
  selectedDate,
  mealType,
  setMealType,
}) {
  if (!selectedDate) return null;

  return (
    <div className="meal-selector">
      <button
        onClick={() => setMealType("Lunch")}
        className={`btn btn--meal ${
  mealType === "Lunch" ? "btn--active" : ""
}`}
      >
        Lunch
      </button>

      <button
        onClick={() => setMealType("Dinner")}
        className={`btn btn--meal ${
  mealType === "Dinner" ? "btn--active" : ""
}`}
      >
        Dinner
      </button>
    </div>
  );
}
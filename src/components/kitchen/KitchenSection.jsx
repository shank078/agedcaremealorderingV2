/* =========================================================
   KitchenSection
   ---------------------------------------------------------
   Reusable card component for:
   - Mains
   - Vegetables
   - Carbs
   - Salad
   - Desserts

   Pure presentation component.
========================================================= */

export default function KitchenSection({
  title,
  data,
  onCountClick,
}) {
  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  const sorted = Object.entries(data).sort(
    (a, b) => b[1] - a[1]
  );

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
            onClick={() => onCountClick(name)}
          >
            {count}
          </span>
        </div>
      ))}
    </div>
  );
}
/* =========================================================
   KitchenDashboard
   ---------------------------------------------------------
   Responsible ONLY for structured row layout.
   No data logic.
   No Firestore.
   No modal logic.
   Pure layout orchestration.
========================================================= */

export default function KitchenDashboard({
  renderMains,
  renderVegetables,
  renderCarbs,
  renderSalad,
  renderDesserts,
  renderSpecialRequests,
}) {
  return (
    <div className="kitchen-dashboard">

      {/* Row 1 — Core Production */}
      <div className="kitchen-row">
        {renderMains()}
        {renderVegetables()}
      </div>

      {/* Row 2 — Bulk Prep */}
      <div className="kitchen-row">
        {renderCarbs()}
        {renderSalad()}
      </div>

      {/* Row 3 — Finishing & Exceptions */}
      <div className="kitchen-row">
        {renderDesserts()}
        {renderSpecialRequests()}
      </div>

    </div>
  );
}
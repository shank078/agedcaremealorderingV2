/* =========================================================
   SpecialRequestSection
   ---------------------------------------------------------
   Displays summary count of special requests.
   Uses modal callback to display full list.
========================================================= */

export default function SpecialRequestSection({
  list,
  onOpen,
}) {
  if (!list || list.length === 0) {
    return null;
  }

  return (
    <div className="kitchen-section">
      <h3>Special Requests</h3>

      <div className="kitchen-item">
        <span className="kitchen-item-name">
          Special Requests
        </span>

        <span
          className="kitchen-count"
          onClick={() => onOpen(list)}
        >
          {list.length}
        </span>
      </div>
    </div>
  );
}
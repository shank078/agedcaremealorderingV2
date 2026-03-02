/* =========================
   Save Action Bar
   - Immediate feedback
   - Saving state
   - Success state
   - Professional UX
========================= */

import { useState } from "react";

export default function SaveBar({
  selectedDate,
  mealType,
  resident,
  currentMenu,
  selected,
  handleSave,
}) {
  // =========================
  // Status: idle | saving | success
  // =========================
  const [status, setStatus] = useState("idle");

  // Hide until date + meal selected
  if (!selectedDate || !mealType) return null;

  // ✅ Check if anything at all is selected
const hasAnySelection =
  selected?.main ||
  selected?.salad ||
  selected?.veg?.length > 0 ||
  selected?.dessert?.length > 0 ||
  selected?.specialRequest?.trim() !== "";

// ✅ Disable only if:
// - no resident
// - no menu loaded
// - nothing selected
// - currently saving
const isDisabled =

  !currentMenu ||
  !hasAnySelection ||
  status === "saving";

  async function handleClick() {
    if (isDisabled) return;

    // Immediate UI feedback
    setStatus("saving");

    try {
     const success = await handleSave();

if (success) {
  setStatus("success");

  setTimeout(() => {
    setStatus("idle");
  }, 2000);
} else {
  setStatus("idle");
}

      // Reset back to idle after 2 seconds
      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("Save failed:", error);
      setStatus("idle");
    }
  }

  return (
    <div className="save-container">
      <button
        className={`save-button ${
          status === "success" ? "save-button--success" : ""
        }`}
        onClick={handleClick}
        disabled={isDisabled}
      >
        {status === "saving"
          ? "Saving..."
          : status === "success"
          ? "Order Saved ✓"
          : "Save Order"}
      </button>

      {status === "success" && (
        <div className="save-message">
          Order saved for {resident?.name} –{" "}
          {new Date(selectedDate).toLocaleDateString("en-AU", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}{" "}
          ({mealType})
        </div>
      )}
    </div>
  );
}
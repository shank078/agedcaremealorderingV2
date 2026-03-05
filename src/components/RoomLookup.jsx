import { normalizeRoomInput } from "../utils/roomUtils";

export default function RoomLookup({
  selectedDate,
  mealType,
  roomNumber,
  setRoomNumber,
  resident,
  roomError
}) {

  if (!selectedDate || !mealType) return null;

  function handleRoomChange(e) {

    const input = e.target.value;

    // keep raw value in input field
    setRoomNumber(input);

    // normalized value available if needed
    const roomSort = normalizeRoomInput(input);

    // debugging / future logic
    console.log("Normalized roomSort:", roomSort);
  }

  return (
    <>
      {/* =========================
          Room Number Input
      ========================= */}
      <input
        type="text"
        placeholder="Enter Room Number"
        value={roomNumber}
        onChange={handleRoomChange}
        className="room-input"
      />

      {roomError && (
        <p className="room-error">{roomError}</p>
      )}

      {/* =========================
          Error Message
      ========================= */}
      {roomNumber && !resident && (
        <div className="room-error">
          No resident found for this room
        </div>
      )}

      {/* =========================
          Valid Resident Display
      ========================= */}
      {resident && (
        <div className="room-success">
          Room {resident.roomNumber} — {resident.displayName} ✓
        </div>
      )}
    </>
  );
}
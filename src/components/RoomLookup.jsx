export default function RoomLookup({
  selectedDate,
  mealType,
  roomNumber,
  setRoomNumber,
  resident,
  roomError
}) {
  if (!selectedDate || !mealType) return null;

  return (
    <>
      {/* =========================
          Room Number Input
      ========================= */}
      <input
        type="text"
        placeholder="Enter Room Number"
        value={roomNumber}
        onChange={(e) => setRoomNumber(e.target.value)}
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
          Room {resident.roomNumber} — {resident.name} ✓
        </div>
      )}
    </>
  );
}
// src/utils/roomUtils.js

/*
=====================================================
ROOM PREFIX MAP
=====================================================

Defines how each room prefix converts into roomSort.

Example:
C67 → 100 + 67 = 167
D12 → 200 + 12 = 212
*/

const ROOM_PREFIX_MAP = {
  C: 100,
  D: 200,
  G: 300,
  A: 400,
  M: 500,
  I: 600,
  N: 700
};


/*
=====================================================
NORMALIZE ROOM INPUT
=====================================================

Accepts user input and converts it into roomSort.

Supported input:

C67
c67
167

Returns:

167
*/

export function normalizeRoomInput(input) {

  if (!input) return null;

  const value = input.trim().toUpperCase();


  /*
  Case 1
  User types numeric roomSort directly
  Example: 167
  */

  if (!isNaN(value)) {
    return Number(value);
  }


  /*
  Case 2
  User types prefixed room number
  Example: C67
  */

  const prefix = value[0];
  const number = parseInt(value.slice(1));

  if (!ROOM_PREFIX_MAP[prefix]) {
    return null;
  }

  if (isNaN(number)) {
    return null;
  }

  return ROOM_PREFIX_MAP[prefix] + number;

}


/*
=====================================================
FORMAT ROOM NUMBER (OPTIONAL HELPER)
=====================================================

Converts roomSort back to readable format.

Example:
167 → C67
*/

export function formatRoomNumber(roomSort) {

  if (!roomSort) return null;

  const block = Math.floor(roomSort / 100) * 100;
  const number = roomSort % 100;

  const prefix = Object.keys(ROOM_PREFIX_MAP)
    .find(key => ROOM_PREFIX_MAP[key] === block);

  if (!prefix) return null;

  return `${prefix}${number}`;

}
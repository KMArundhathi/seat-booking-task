
"use client";

import { useState } from "react";
import Swal from "sweetalert2";

export default function Home() {

  // Defining seat rows and columns
  const rows = ["A", "B", "C", "D", "E", "F"];
  const cols = Array.from({ length: 10 }, (_, i) => i + 1);

  //seat pricing categories with prices and colors
  const seatPricing = {
    Silver: { price: 100, color: "bg-gray-300", rows: ["A", "B"] },
    Gold: { price: 150, color: "bg-yellow-300", rows: ["C", "D"] },
    Platinum: { price: 200, color: "bg-blue-300", rows: ["E", "F"] },
  };

  // Mapping of rows to their respective seat categories, prices, and colors
  const rowToCategory = Object.entries(seatPricing).reduce((acc, [category, { price, rows }]) => {
    rows.forEach(row => acc[row] = { price, category, color: seatPricing[category].color });
    return acc;
  }, {});

  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seat, row) => {
    setSelectedSeats((prev) => {
      //remove if the seat is already selected
      if (prev.some((s) => s.seat === seat)) {
        return prev.filter((s) => s.seat !== seat);
      }
      // showing alert if the user selects more than 8 seats
      if (prev.length >= 8) {
        Swal.fire({ icon: "error", title: "Limit Reached", text: "Max 8 seats allowed!" });
        return prev;
      }
      // add the selected seat with its price and category
      return [...prev, { seat, price: rowToCategory[row].price, category: rowToCategory[row].category }];
    });
  };

  // Calculate total cost of selected seats
  const totalCost = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const handleBooking = () => {
    // show a warning alert for when no seats are selected
    if (selectedSeats.length === 0) {
      Swal.fire({ icon: "warning", title: "No Seats Selected", text: "Select at least one seat!" });
      return;
    }
    // confirmation popup before finalizing booking
    Swal.fire({
      title: "Confirm Booking",
      text: `Booking ${selectedSeats.length} seat(s) for ₹${totalCost}.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed!",
    }).then((result) => {
      if (result.isConfirmed) {
        // If confirmed, show success message and reset seat selection
        Swal.fire({ icon: "success", title: "Booking Confirmed!" });
        setSelectedSeats([]);
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-6">Seat Booking System</h1>
      <div className="grid md:grid-cols-2 gap-10 w-full max-w-4xl">
        {/* Seat Selection */}
        <div className="flex flex-col items-center">
          <div className="space-y-4">
            {rows.map((row) => (
              <div key={row} className="flex space-x-2">
                {cols.map((col) => {
                  const seat = `${row}${col}`;
                  const { color } = rowToCategory[row];
                  const isSelected = selectedSeats.some((s) => s.seat === seat);
                  return (
                    <div
                      key={seat}
                      className={`w-10 h-10 flex items-center justify-center border rounded cursor-pointer transition-all ${isSelected ? color : "bg-white"
                        } border-green-600`}
                      onClick={() => toggleSeat(seat, row)}
                    >
                      {seat}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Pricing Info */}
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-lg font-semibold">The seats have dynamic pricing</h2>
            <ul className="mt-2 text-sm">
              {Object.entries(seatPricing).map(([category, { price, rows }]) => (
                <li key={category} className="text-gray-700">
                  <span className="font-bold">{category}:</span> ₹{price} (Rows {rows.join(", ")})
                </li>
              ))}
            </ul>
          </div>

          {/* Selected Seats */}
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-lg font-semibold">Selected Seats</h2>
            {selectedSeats.length === 0 ? (
              <p className="text-gray-500 text-center mt-2">No seats selected</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {selectedSeats.map((s, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{s.seat} ({s.category})</span>
                    <span>₹{s.price}</span>
                  </li>
                ))}
              </ul>
            )}
            <hr className="my-3" />
            <div className="text-lg font-bold flex justify-between">
              <span>Total:</span>
              <span>₹{totalCost}</span>
            </div>
            <button
              className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              onClick={handleBooking}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


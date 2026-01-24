import React, { useState } from "react";
import { MapPin, Package, Truck, CheckCircle } from "lucide-react";

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleTrack = () => {
    if (trackingId.trim() !== "") {
      setShowResult(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Track Your Order</h1>
        <p className="text-gray-500 mb-6">
          Enter your tracking ID to see the current status of your shipment.
        </p>

        {/* Input Section */}
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="Enter Tracking ID"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleTrack}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Track
          </button>
        </div>

        {/* Tracking Result */}
        {showResult && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Tracking ID</span>
              <span className="font-semibold">{trackingId}</span>
            </div>

            {/* Timeline */}
            <div className="border-l-2 border-blue-600 pl-6 space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="text-green-600" />
                <div>
                  <h3 className="font-semibold">Order Confirmed</h3>
                  <p className="text-sm text-gray-500">Your order has been placed successfully.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Package className="text-blue-600" />
                <div>
                  <h3 className="font-semibold">Package Prepared</h3>
                  <p className="text-sm text-gray-500">Items are packed and ready for dispatch.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Truck className="text-orange-500" />
                <div>
                  <h3 className="font-semibold">Out for Delivery</h3>
                  <p className="text-sm text-gray-500">Courier is on the way to your location.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="text-gray-400" />
                <div>
                  <h3 className="font-semibold text-gray-400">Delivered</h3>
                  <p className="text-sm text-gray-400">Package will be delivered soon.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

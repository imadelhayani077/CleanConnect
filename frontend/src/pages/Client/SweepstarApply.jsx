import { useSweepstarContext } from "@/Helper/SweepstarContext";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Import the context hook

export default function SweepstarApply() {
    const [formData, setFormData] = useState({
        bio: "",
        id_number: "",
        hourly_rate: 25.0,
    });

    // Destructure functions and state from the Context
    const { applyToBecomeSweepstar, loading, errors } = useSweepstarContext();
    const navigate = useNavigate();
    const [successMsg, setSuccessMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg("");

        // Call the context function
        const success = await applyToBecomeSweepstar(formData);

        if (success) {
            setSuccessMsg("Application submitted! Redirecting...");
            // Redirect user to their dashboard after 2 seconds
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Become a Sweepstar
            </h2>

            {/* Show Success Message */}
            {successMsg && (
                <div className="p-3 mb-4 bg-green-100 text-green-700 rounded border border-green-200">
                    {successMsg}
                </div>
            )}

            {/* Show Error Message from Context */}
            {errors && (
                <div className="p-3 mb-4 bg-red-100 text-red-700 rounded border border-red-200">
                    {errors}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* ID Number */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-medium">
                        ID / Passport Number
                    </label>
                    <input
                        type="text"
                        required
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.id_number}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                id_number: e.target.value,
                            })
                        }
                        placeholder="e.g. 900101 5000 089"
                    />
                </div>

                {/* Hourly Rate */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-medium">
                        Desired Hourly Rate ($)
                    </label>
                    <input
                        type="number"
                        min="10"
                        step="0.50"
                        required
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.hourly_rate}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                hourly_rate: e.target.value,
                            })
                        }
                    />
                </div>

                {/* Bio */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2 font-medium">
                        Why should we hire you? (Bio)
                    </label>
                    <textarea
                        required
                        rows="4"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={formData.bio}
                        onChange={(e) =>
                            setFormData({ ...formData, bio: e.target.value })
                        }
                        placeholder="Tell us about your experience..."
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full text-white py-2 rounded transition font-semibold ${
                        loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {loading ? "Submitting..." : "Submit Application"}
                </button>
            </form>
        </div>
    );
}

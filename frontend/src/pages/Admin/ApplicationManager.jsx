import React, { useEffect } from "react";
// Import the hook we created in the previous step
import { useSweepstarContext } from "../../Helper/SweepstarContext";

export default function ApplicationManager() {
    // Destructure the values/functions directly from the Context
    const {
        applications,
        fetchPendingApplications,
        approveApplication,
        rejectApplication,
        loading,
    } = useSweepstarContext();

    // 1. Fetch data when component loads
    useEffect(() => {
        fetchPendingApplications();
    }, []);

    // 2. Handle Approve
    const handleApprove = async (id) => {
        if (
            !window.confirm(
                "Are you sure you want to promote this user to Sweepstar?"
            )
        )
            return;
        await approveApplication(id); // Context handles the API and list update
    };

    // 3. Handle Reject
    const handleReject = async (id) => {
        if (!window.confirm("Reject this application?")) return;
        await rejectApplication(id); // Context handles the API and list update
    };

    if (loading)
        return <p className="p-4 text-gray-500">Loading applications...</p>;

    return (
        <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-xl font-bold mb-4">
                Pending Sweepstar Applications
            </h3>

            {applications.length === 0 ? (
                <p className="text-gray-500">No pending applications.</p>
            ) : (
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="p-3 font-semibold text-gray-700">
                                Name
                            </th>
                            <th className="p-3 font-semibold text-gray-700">
                                Email
                            </th>
                            <th className="p-3 font-semibold text-gray-700">
                                ID Number
                            </th>
                            <th className="p-3 font-semibold text-gray-700">
                                Rate
                            </th>
                            <th className="p-3 font-semibold text-gray-700">
                                Bio
                            </th>
                            <th className="p-3 font-semibold text-gray-700">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr
                                key={app.id}
                                className="border-b hover:bg-gray-50"
                            >
                                <td className="p-3">{app.user.name}</td>
                                <td className="p-3 text-sm text-gray-600">
                                    {app.user.email}
                                </td>
                                <td className="p-3">{app.id_number}</td>
                                <td className="p-3 font-medium text-green-600">
                                    ${app.hourly_rate}/hr
                                </td>
                                <td
                                    className="p-3 text-sm italic text-gray-500 max-w-xs truncate"
                                    title={app.bio}
                                >
                                    {app.bio}
                                </td>
                                <td className="p-3 space-x-2 flex">
                                    <button
                                        onClick={() => handleApprove(app.id)}
                                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(app.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

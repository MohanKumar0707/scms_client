import React, { useEffect, useState } from "react";

function AssignedComplaint() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const registerNo = sessionStorage.getItem("registerNo");

  useEffect(() => {
    if (!registerNo) return;

    const fetchAssignedComplaints = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/staff/assigned/${registerNo}`
        );
        const data = await res.json();
        setComplaints(data);
      } catch (err) {
        console.error("Error fetching complaints", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedComplaints();
  }, [registerNo]);

  if (loading) {
    return <div className="p-6">Loading assigned complaints...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Assigned Complaints</h1>

      {complaints.length === 0 ? (
        <p className="text-gray-500">No complaints assigned to you.</p>
      ) : (
        <div className="grid gap-4">
          {complaints.map((c) => (
            <div
              key={c._id}
              className="border rounded-xl p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-lg">{c.title}</h2>
                <span className="text-sm px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
                  {c.status}
                </span>
              </div>

              <p className="text-gray-600 mb-3">{c.description}</p>

              <div className="text-sm text-gray-500 space-y-1">
                <p>
                  <strong>Student:</strong>{" "}
                  {c.student?.name} ({c.student?.registerNo})
                </p>
                <p>
                  <strong>Category:</strong> {c.category?.name}
                </p>
                <p>
                  <strong>Department:</strong> {c.department?.name}
                </p>
                <p>
                  <strong>Priority:</strong> {c.priority}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AssignedComplaint;

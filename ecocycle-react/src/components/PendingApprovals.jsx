import { useEffect, useState } from "react";

export default function PendingApprovals() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch pending users
  const fetchPendingUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/pending");
      const data = await res.json();
      setPendingUsers(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setMessage("Error fetching pending users.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  // Approve user
  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/approve/${id}`, {
        method: "PATCH",
      });
      if (res.ok) {
        setMessage("User approved!");
        fetchPendingUsers();
      } else {
        setMessage("Error approving user.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Connection error while approving user.");
    }
  };

  // Reject user
  const handleReject = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/reject/${id}`, {
        method: "PATCH",
      });
      if (res.ok) {
        setMessage("User rejected!");
        fetchPendingUsers();
      } else {
        setMessage("Error rejecting user.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Connection error while rejecting user.");
    }
  };

  if (loading) return <p>Loading pending users...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pending Community Users</h2>
      {message && <p className="mb-2 text-green-600">{message}</p>}

      {pendingUsers.length === 0 ? (
        <p>No pending users at the moment.</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Partner Type</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {pendingUsers.map((user) => (
              <tr key={user._id}>
                <td className="px-4 py-2 border">{user.name}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border">{user.partnerType}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleApprove(user._id)}
                    className="bg-green-500 text-white px-2 py-1 mr-2 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(user._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
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

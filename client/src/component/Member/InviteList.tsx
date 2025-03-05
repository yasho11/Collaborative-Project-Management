import React, { useEffect, useState } from "react";
import api from "../../axios/api";

interface Invitation {
  workspaceId: string;
  workspaceName: string;
  token: string;
  expiresAt: string;
}

const InvitationList = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
   fetchInvitations();
  }, []);
  const fetchInvitations = async () => {
    try {
      console.log(`Trying to fetch data!`);
      const response = await api.get("/workspaces/mem/invitelist");
      const data = response.data; // No need for .json()
  
      console.log("API Response:", data); // Debug log
  
      if (!data || !Array.isArray(data.invitations)) {
        throw new Error("Invalid response format");
      }
  
      setInvitations(data.invitations);
    } catch (err) {
      console.error("Error fetching invitations:", err);
      setError("Failed to fetch invitations.");
    } finally {
      setLoading(false);
    }
  };
  
  const acceptInvite = async (token: string) => {
    try {
      await api.post("/workspaces/join", { token });
      setInvitations((prev) => prev.filter((inv) => inv.token !== token));
      alert("Successfully joined the workspace!");
    } catch (err) {
      console.error("Error accepting invitation:", err);
      setError("Failed to join workspace.");
    }
  };

  if (loading) return <p>Loading invitations...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Pending Invitations</h2>
      {invitations.length === 0 ? (
        <p>No pending invitations.</p>
      ) : (
        <ul>
          {invitations.map((inv) => (
            <li
              key={inv.token}
              className="border-b py-3 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{inv.workspaceName}</p>
                <p className="text-gray-500 text-sm">
                  Expires: {new Date(inv.expiresAt).toLocaleDateString()}
                </p>
              </div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => acceptInvite(inv.token)}
              >
                Accept
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InvitationList;

import { useState } from "react";
import api from "../../axios/api";

interface InviteForm {
  email: string;
}

interface AddMemberProps {
  parentId: string;
  type: string;
}

const AddMember = ({ parentId, type }: AddMemberProps) => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response = await api.post(`/${type}/invite`, { email, parentId });
      setMessage(response.data.message);
      setEmail(""); // Reset email input after successful invite
    } catch (err: any) {
      setError(err.response?.data?.message || "Error sending invitation");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Invite Member</h2>

      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">User Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Send Invite
        </button>
      </form>
    </div>
  );
};

export default AddMember;

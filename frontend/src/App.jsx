import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    city: "",
  });

  const [saving, setSaving] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/users");

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Create user
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.age || !formData.city) {
      setError("Please fill all fields");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          age: Number(formData.age),
          city: formData.city,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create user");
      }

      // Add newly created user to UI
      setUsers((prevUsers) => [...prevUsers, data]);

      // Clear form
      setFormData({
        name: "",
        age: "",
        city: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete user");
      }

      // Remove user from UI
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-wide text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.7)]">
            USER MANAGEMENT
          </h1>

          <p className="mt-2 text-gray-400">
            Create, view and delete users
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
            {error}
          </div>
        )}

        {/* Create User Form */}
        <div className="mb-10 rounded-2xl border border-cyan-400/30 bg-[#0b1025] p-6 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
          <h2 className="mb-6 text-2xl font-bold text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.5)]">
            + Create New User
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 md:grid-cols-4"
          >
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-cyan-300">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                className="w-full rounded-xl border border-cyan-400/30 bg-[#050816] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>

            {/* Age */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-cyan-300">
                Age
              </label>

              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter age"
                min="1"
                className="w-full rounded-xl border border-cyan-400/30 bg-[#050816] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>

            {/* City */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-cyan-300">
                City
              </label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                className="w-full rounded-xl border border-cyan-400/30 bg-[#050816] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
              />
            </div>

            {/* Submit */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-cyan-400 px-5 py-3 font-bold text-black transition hover:bg-cyan-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.7)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Create User"}
              </button>
            </div>
          </form>
        </div>

        {/* Users */}
        <div className="overflow-hidden rounded-2xl border border-purple-400/30 bg-[#0b1025] shadow-[0_0_35px_rgba(168,85,247,0.12)]">

          <div className="flex items-center justify-between border-b border-purple-400/20 px-6 py-5">
            <h2 className="text-2xl font-bold text-purple-400">
              Users
            </h2>

            <span className="rounded-full border border-green-400/40 bg-green-400/10 px-4 py-1 text-sm font-semibold text-green-400 shadow-[0_0_12px_rgba(74,222,128,0.2)]">
              {users.length} Users
            </span>
          </div>

          {loading && (
            <div className="p-10 text-center text-cyan-400">
              <div className="animate-pulse text-lg">
                Loading users...
              </div>
            </div>
          )}

          {!loading && !error && users.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              No users found. Create your first user above.
            </div>
          )}

          {!loading && users.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#111936]">
                  <tr>
                    <th className="px-6 py-4 text-sm font-bold text-cyan-400">
                      ID
                    </th>

                    <th className="px-6 py-4 text-sm font-bold text-cyan-400">
                      Name
                    </th>

                    <th className="px-6 py-4 text-sm font-bold text-cyan-400">
                      Age
                    </th>

                    <th className="px-6 py-4 text-sm font-bold text-cyan-400">
                      City
                    </th>

                    <th className="px-6 py-4 text-sm font-bold text-cyan-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-gray-800 transition hover:bg-cyan-400/5"
                    >
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {user._id}
                      </td>

                      <td className="px-6 py-4 font-semibold text-white">
                        {user.name}
                      </td>

                      <td className="px-6 py-4 text-gray-300">
                        {user.age}
                      </td>

                      <td className="px-6 py-4 text-gray-300">
                        {user.city}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-400 transition hover:bg-red-500 hover:text-white hover:shadow-[0_0_18px_rgba(239,68,68,0.6)]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-600">
          MongoDB + Express + React + Node.js
        </p>
      </div>
    </div>
  );
}

export default App;


import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        return response.json();
      })
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">
          Users
        </h1>

        {loading && (
          <div className="rounded-lg bg-white p-6 text-center shadow">
            Loading users...
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-hidden rounded-xl bg-white shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Age</th>
                    <th className="px-6 py-4">City</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-gray-200 last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {user._id}
                      </td>

                      <td className="px-6 py-4 font-medium text-gray-800">
                        {user.name}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {user.age}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {user.city}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <p className="p-6 text-center text-gray-500">
                No users found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;


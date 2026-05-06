import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getMe, getNotifications, markNotificationsRead, getPlatformSummary } from "../utils/api";
import { connectWebSocket, disconnectWebSocket } from "../utils/websocket";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [org, setOrg] = useState(null);
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.push("/login"); return; }

    async function loadData() {
      try {
        const [userData, summaryData, notifData] = await Promise.all([
          getMe(token),
          getPlatformSummary(token),
          getNotifications(token),
        ]);

        if (userData.detail === "Invalid token") {
          localStorage.removeItem("access_token");
          router.push("/login");
          return;
        }

        setUser(userData);
        setOrg({ name: summaryData.organization });
        setSub({ plan: summaryData.plan });
        setNotifications(notifData);
        setLoading(false);

        connectWebSocket(token, (event) => {
          if (event.type !== "NOTIFICATION") {
            setNotifications((prev) => [
              {
                id: Date.now(),
                message: event.data.message,
                event_type: event.type,
                is_read: false,
                created_at: new Date().toISOString(),
              },
              ...prev.slice(0, 9),
            ]);
          }
        });
      } catch (error) {
        console.error("Failed to load dashboard:", error);
        setLoading(false);
      }
    }

    loadData();
    return () => disconnectWebSocket();
  }, []);

  const handleLogout = () => {
    disconnectWebSocket();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/login");
  };

  const handleMarkRead = async () => {
    const token = localStorage.getItem("access_token");
    await markNotificationsRead(token);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-800">
        <div className="text-xl font-bold text-indigo-400">{org?.name}</div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{user?.email}</span>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative border border-gray-700 px-3 py-2 rounded-lg text-sm hover:border-gray-500 transition"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50">
                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
                  <span className="font-bold text-sm">Notifications</span>
                  <button onClick={handleMarkRead} className="text-gray-400 hover:text-white text-xs">
                    Mark all read
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-6">No notifications yet</p>
                ) : (
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((n, i) => (
                      <div key={n.id || i} className={`px-4 py-3 border-b border-gray-800 ${!n.is_read ? "bg-gray-800" : ""}`}>
                        <p className="text-sm text-white">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(n.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <button onClick={handleLogout} className="border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-lg text-sm transition">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-400 mb-8">Here is your organization overview.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Organization</p>
            <p className="text-2xl font-bold">{org?.name}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Your Role</p>
            <p className="text-2xl font-bold capitalize">{user?.role}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Current Plan</p>
            <p className="text-2xl font-bold capitalize">{sub?.plan}</p>
          </div>
        </div>

        {notifications.filter(n => !n.is_read).length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
            <h2 className="font-bold text-lg mb-4">Live Activity</h2>
            <div className="space-y-2">
              {notifications.filter(n => !n.is_read).slice(0, 3).map((n, i) => (
                <div key={n.id || i} className="flex items-center gap-3 text-sm">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
                  <span className="text-gray-300">{n.message}</span>
                  <span className="text-gray-500 text-xs ml-auto">
                    {new Date(n.created_at).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="font-bold text-lg mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a href="/chat" className="bg-indigo-700 hover:bg-indigo-600 border border-indigo-600 rounded-lg px-4 py-3 text-sm text-center">AI Assistant</a>
            <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 text-sm text-center">API Docs</a>
            <a href="#" className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 text-sm text-center">Invite Member</a>
            <a href="#" className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 text-sm text-center">Manage Keys</a>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getMe, getMyOrg, getSubscription } from "../utils/api";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [org, setOrg] = useState(null);
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.push("/login"); return; }
    async function loadData() {
      const [userData, orgData, subData] = await Promise.all([
        getMe(token), getMyOrg(token), getSubscription(token),
      ]);
      if (userData.detail === "Invalid token") {
        localStorage.removeItem("access_token");
        router.push("/login");
        return;
      }
      setUser(userData);
      setOrg(orgData);
      setSub(subData);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/login");
  };

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
          <button onClick={handleLogout} className="border border-gray-700 px-4 py-2 rounded-lg text-sm">Logout</button>
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
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="font-bold text-lg mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 text-sm text-center">API Docs</a>
            <a href="#" className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 text-sm text-center">Invite Member</a>
            <a href="#" className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 text-sm text-center">Manage Keys</a>
            <a href="#" className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-3 text-sm text-center">Upgrade Plan</a>
          </div>
        </div>
      </div>
    </div>
  );
}
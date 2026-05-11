import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const API_URL = "http://localhost:8000";

export default function Billing() {
  const router = useRouter();
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.push("/login"); return; }

    async function loadBilling() {
      const res = await fetch(`${API_URL}/billing/info`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setBilling(data);
      setLoading(false);
    }

    loadBilling();
  }, []);

  const handleUpgrade = async (plan) => {
    const token = localStorage.getItem("access_token");
    setCheckoutLoading(plan);

    const res = await fetch(`${API_URL}/billing/checkout/${plan}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();

    if (data.checkout_url) {
      window.location.href = data.checkout_url;
    }
    setCheckoutLoading("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: ["Up to 5 users", "Basic AI queries", "Email support"],
      plan: "free",
      color: "border-gray-700"
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      features: ["Unlimited users", "Advanced AI insights", "Priority support", "API access"],
      plan: "pro",
      color: "border-indigo-600"
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      features: ["Everything in Pro", "Custom AI models", "Dedicated support", "SLA guarantee"],
      plan: "enterprise",
      color: "border-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-800">
        <div className="text-xl font-bold text-indigo-400">Billing</div>
        <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm transition">
          Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">
        <h1 className="text-3xl font-bold mb-2">Subscription Plans</h1>
        <p className="text-gray-400 mb-10">
          Current plan: <span className="text-indigo-400 font-bold capitalize">{billing?.plan}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div key={p.plan} className={`bg-gray-900 border-2 ${p.color} rounded-2xl p-6 ${billing?.plan === p.plan ? "ring-2 ring-indigo-500" : ""}`}>
              {billing?.plan === p.plan && (
                <span className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-full mb-4 inline-block">
                  Current Plan
                </span>
              )}
              <h2 className="text-2xl font-bold mb-1">{p.name}</h2>
              <div className="mb-4">
                <span className="text-4xl font-bold">{p.price}</span>
                <span className="text-gray-400 text-sm ml-2">{p.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-green-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              {billing?.plan === p.plan ? (
                <button disabled className="w-full bg-gray-700 py-3 rounded-lg text-sm opacity-50 cursor-not-allowed">
                  Current Plan
                </button>
              ) : p.plan === "free" ? (
                <button disabled className="w-full bg-gray-700 py-3 rounded-lg text-sm opacity-50 cursor-not-allowed">
                  Free Forever
                </button>
              ) : (
                <button
                  onClick={() => handleUpgrade(p.plan)}
                  disabled={checkoutLoading === p.plan}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg text-sm font-medium transition disabled:opacity-50"
                >
                  {checkoutLoading === p.plan ? "Loading..." : `Upgrade to ${p.name}`}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
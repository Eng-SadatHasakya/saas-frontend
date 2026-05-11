import Link from "next/link";

export default function BillingSuccess() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-400 mb-8">
          Your subscription has been upgraded. Your new plan is now active.
        </p>
        <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-lg font-medium transition">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
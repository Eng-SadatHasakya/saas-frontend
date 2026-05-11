import Link from "next/link";

export default function BillingCancel() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">❌</div>
        <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
        <p className="text-gray-400 mb-8">
          Your payment was cancelled. No charges were made.
        </p>
        <Link href="/dashboard" className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-lg font-medium transition">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
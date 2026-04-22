import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-800">
        <div className="text-xl font-bold text-indigo-400">SaaS Backend</div>
        <div className="flex gap-4">
          <Link href="/login" className="text-gray-300 hover:text-white transition">
            Login
          </Link>
          <Link href="/register" className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-32">
        <div className="inline-flex items-center gap-2 bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs px-4 py-2 rounded-full mb-8">
          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
          v1.0.0 — Production Ready
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          Multi-Tenant
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-400">
            SaaS Backend
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mb-10 leading-relaxed">
          A production-grade API with organization isolation, JWT authentication,
          role-based access, subscriptions, and invite system.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/register" className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-lg font-medium transition">
            Start for Free
          </Link>
          <a href="http://localhost:8000/docs" target="_blank" className="border border-gray-700 hover:border-gray-500 px-8 py-3 rounded-lg font-medium transition">
            API Docs
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Built for production</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "🔐", title: "JWT Authentication", desc: "Access + refresh tokens with secure rotation and revocation." },
            { icon: "👥", title: "Multi-Tenancy", desc: "Complete organization isolation — no tenant sees another's data." },
            { icon: "📧", title: "Invite System", desc: "Token-based invite flow for onboarding team members." },
            { icon: "💳", title: "Subscriptions", desc: "Free, Pro and Enterprise plans with expiry management." },
            { icon: "🔑", title: "API Keys", desc: "Generate and manage API keys with sk_ prefix and expiry." },
            { icon: "⚡", title: "Rate Limiting", desc: "Brute-force protection on all authentication endpoints." },
          ].map((f) => (
            <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-indigo-800 transition">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        Built by{" "}
        <a href="https://github.com/Eng-SadatHasakya" className="text-indigo-400 hover:underline">
          Eng. Sadat Hasakya
        </a>{" "}
        · SaaS Backend v1.0.0
      </footer>
    </div>
  );
}
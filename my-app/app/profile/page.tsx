import Profile from "../components/profile";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  return (
    <div className="min-h-screen gradient-header">
      <header className="py-8 px-6 text-white shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="PharmaShe Logo"
              width={100}
              height={100}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "var(--font-league-spartan)" }}>PharmaShe</h1>
              <p className="text-lg opacity-90">Women&apos;s Health Drug Interaction & Analysis Platform</p>
            </div>
          </div>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-sm font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-12 px-6">
        <Profile />
      </main>

      <footer className="bg-[rgb(86,109,150)] text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm">
          <p className="opacity-75">
            PharmaShe is an educational tool. Always consult healthcare professionals before making medication decisions.
          </p>
        </div>
      </footer>
    </div>
  );
}
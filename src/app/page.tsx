import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, Users, Shield, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-black/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="font-bold text-xl tracking-tighter">
            placement<span className="text-gray-400">.diaries</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:bg-gray-900">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-white text-black hover:bg-gray-100">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-7xl font-bold mb-6 leading-tight">
            Your story,
            <br />
            <span className="text-gray-400">anonymous</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            A safe space for college students to share placement struggles, celebrate wins,
            and find support from peers. No real names. No judgment. Just real conversations.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                Start Anonymous <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-700 text-white hover:bg-gray-900"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Visual Demo */}
        <div className="mb-20 rounded-lg border border-gray-800 bg-gradient-to-b from-gray-900 to-black p-8 sm:p-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { name: "SilentWolf", status: "Rejected after final round..." },
              { name: "MidnightCoder", status: "Finally got placed! 🎉" },
              { name: "LostGraduate", status: "8 rejections in a row..." },
            ].map((user) => (
              <div key={user.name} className="p-4 rounded border border-gray-800">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-3" />
                <div className="font-semibold text-sm mb-2">{user.name}</div>
                <div className="text-xs text-gray-500">{user.status}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="border-t border-gray-800 bg-gray-950 py-20 sm:py-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-16 text-center">
            Built for your privacy
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Lock,
                title: "100% Anonymous",
                desc: "Your real identity stays hidden. We never store or share personal info.",
              },
              {
                icon: Shield,
                title: "Secure by Default",
                desc: "Military-grade encryption and secure authentication for your peace of mind.",
              },
              {
                icon: Users,
                title: "Real Community",
                desc: "Connect with peers going through the same journey. Find support and solidarity.",
              },
              {
                icon: Zap,
                title: "Always Free",
                desc: "No ads, no premium features. Pure peer support, forever free.",
              },
            ].map((feature) => (
              <div key={feature.title} className="p-6 rounded-lg border border-gray-800 hover:border-gray-700 transition">
                <feature.icon className="w-8 h-8 mb-4 text-gray-400" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 text-center">
        <h2 className="text-4xl font-bold mb-6">
          You're not alone in this journey
        </h2>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Join hundreds of students sharing their placement stories anonymously.
          Find support, share experiences, and celebrate together.
        </p>
        <Link href="/register">
          <Button size="lg" className="bg-white text-black hover:bg-gray-100">
            Get Started Now
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>© 2024 Placement Diaries. Built for students, by students.</p>
        </div>
      </footer>
    </div>
  );
}
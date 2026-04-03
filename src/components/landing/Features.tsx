import { Zap, Lock, BarChart3 } from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Enterprise Shielding</h2>
          <p className="text-muted-foreground">
            Sophisticated detection layers built for modern high-traffic environments.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group p-8 rounded-2xl border border-border/40 bg-card/50 hover:bg-card hover:border-primary/40 transition-all duration-300">
            <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Real-Time Processing</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Asynchronous threat logging ensures zero latency for your legitimate users while
              reporting threats instantly.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="group p-8 rounded-2xl border border-border/40 bg-card/50 hover:bg-card hover:border-primary/40 transition-all duration-300">
            <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Active Blocking</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Integrated IPS module drops malicious payloads before they hit your database.
              Configurable via "block: true" mode.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="group p-8 rounded-2xl border border-border/40 bg-card/50 hover:bg-card hover:border-primary/40 transition-all duration-300">
            <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">In-Depth Analytics</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Visualize attack patterns on a high-contrast dashboard with severity scoring and IP
              attribution.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

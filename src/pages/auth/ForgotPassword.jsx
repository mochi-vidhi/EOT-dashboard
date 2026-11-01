import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function ForgotPassword() {
  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-card">
          <div className="flex flex-col items-center mb-6 text-center">
            <img
              src="/etech-logo.png"
              alt="ETech Digital Solutions"
              className="h-14 w-auto object-contain dark:hidden drop-shadow-xs"
            />
            <img
              src="/etech-logo-white.png"
              alt="ETech Digital Solutions"
              className="h-14 w-auto object-contain hidden dark:block drop-shadow-xs"
            />
            <h1 className="text-xl font-bold text-foreground tracking-tight mt-3">Forgot Password</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Enter your email and we&apos;ll send a reset link.
            </p>
          </div>

          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">Email address</label>
              <Input type="email" placeholder="Enter your email address" className="h-11 px-3.5 text-sm rounded-xl" />
            </div>
            <Button className="w-full h-11 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
              Send Reset Link
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={14} /> Back to login
            </Link>
          </div>
        </div>
      </div>
      <div className="login-right" aria-hidden="true">
        <img src="/EOTCrane.png" alt="EOT Crane" className="login-right-image" draggable={false} />
        <div className="login-right-overlay" />
      </div>
    </div>
  );
}


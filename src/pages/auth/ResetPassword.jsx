import { Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function ResetPassword() {
  const [show, setShow] = useState(false);
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
            <h1 className="text-xl font-bold text-foreground tracking-tight mt-3">Reset Password</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Enter your new password below.</p>
          </div>

          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">New password</label>
              <div className="relative">
                <Input type={show ? "text" : "password"} placeholder="Enter new password" className="h-11 px-3.5 pr-11 text-sm rounded-xl" />
                <button type="button" onClick={() => setShow(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">Confirm password</label>
              <Input type="password" placeholder="Confirm new password" className="h-11 px-3.5 text-sm rounded-xl" />
            </div>
            <Button className="w-full h-11 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
              Reset Password
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


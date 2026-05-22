import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ShieldCheck, Loader2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await login(name, email);
      toast.success("Successfully signed in!");
      onClose();
    } catch (err) {
      toast.error("Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-200 shadow-xl rounded-xl p-6">
        <DialogHeader className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Welcome to CivicShield
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm max-w-sm">
            Sign in to personalize your documents and track your filings offline. No data ever leaves your device.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
              Full Name
            </label>
            <Input
              type="text"
              placeholder="e.g. Rajesh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 flex items-center justify-center gap-2 mt-6 active:scale-98 transition-transform"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In Instantly"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

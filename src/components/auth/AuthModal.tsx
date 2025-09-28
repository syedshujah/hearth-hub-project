import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "signup";
}

const AuthModal = ({ isOpen, onClose, defaultMode = "login" }: AuthModalProps) => {
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);

  // jab modal band ho to reset ho jaye
  useEffect(() => {
    if (!isOpen) {
      setMode(defaultMode); // Close hone pe reset ho jaye
    }
  }, [isOpen, defaultMode]);

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {mode === "login" ? (
          <LoginForm onToggleMode={toggleMode} onClose={onClose} />
        ) : (
          <SignUpForm onToggleMode={toggleMode} onClose={onClose} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;

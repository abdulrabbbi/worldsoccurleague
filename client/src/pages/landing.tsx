import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Auto-redirect to login
    setLocation("/auth/login");
  }, [setLocation]);

  return null;
}

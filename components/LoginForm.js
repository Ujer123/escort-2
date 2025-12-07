'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!form.password) newErrors.password = "Password is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        alert("Login successful!");
        
        // Trigger a custom event to notify navbar of login
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('authStateChanged'));
        }
        
        // Redirect based on role to role-based dashboard
        if (data.role === "admin" || data.role === "agency" || data.role === "escort") {
          router.push("/dashboard/role-based");
        } else {
          router.push("/");
        }
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 p-8 flex items-center justify-center">
      <form 
    onSubmit={handleSubmit} 
    className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 bg-opacity-90 backdrop-blur-md p-8 rounded-xl text-white space-y-6 w-full max-w-md shadow-2xl"
  >
    <h2 className="text-3xl font-extrabold text-center mb-8 tracking-wide">Login</h2>
        
        <div>
          <input
            className={`w-full p-3 placeholder:text-white text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white border-2 border-white ${
              errors.email ? 'border-2 border-red-500' : ''
            }`}
            name="email"
            type="email"
            placeholder="Email *"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <input
            className={`w-full p-3 placeholder:text-white text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white border-2 border-white ${
              errors.password ? 'border-2 border-red-500' : ''
            }`}
            type="password"
            name="password"
            placeholder="Password *"
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-md font-semibold transition-all duration-200 shadow-lg"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center">
          <a href="/register" className="text-purple-200 hover:text-purple-100">
            Don&apos;t have an account? Register here
          </a>
        </div>
      </form>
    </div>
  );
}

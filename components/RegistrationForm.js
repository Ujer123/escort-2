'use client'
import { useState } from "react";

export default function RegistrationForm() {
  const [form, setForm] = useState({
    role: "visitor",
    email: "",
    password: "",
    phone: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
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
    else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    // Phone validation for specific roles
    if (['escort', 'agency', 'landlord'].includes(form.role)) {
      if (!form.phone) newErrors.phone = "Phone is required for this role";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        console.log("User created:", data.user);
        
        // Reset form
        setForm({
          role: "visitor",
          email: "",
          password: "",
          phone: "",
        });
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const roleDisplayNames = {
    escort: "Independent Escort",
    agency: "Escort Agency", 
    landlord: "Landlord",
    visitor: "Visitor",
    admin: "Administrator"
  };

  return (
    <div className="min-h-screen bg-purple-50 p-8 flex items-center justify-center">
      <form 
    onSubmit={handleSubmit} 
    className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 bg-opacity-90 backdrop-blur-md p-8 rounded-xl text-white space-y-6 w-full max-w-md shadow-2xl"
  >
    <h2 className="text-3xl font-extrabold text-center mb-8 tracking-wide">Registration</h2>
        
        {/* Role Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium">Select Role:</label>
          <div className="grid grid-cols-2 gap-3">
            {["escort", "agency", "landlord", "visitor", "admin"].map((role) => (
               <label 
            key={role} 
            className={`flex items-center space-x-2 cursor-pointer p-2 rounded border border-transparent hover:border-purple-400 transition-colors ${
              form.role === role ? 'bg-purple-700 border-purple-400' : ''
            }`}
          >
                <input
                  type="radio"
                  name="role"
                  value={role}
                  checked={form.role === role}
                  onChange={handleChange}
                  className="text-white focus:ring-white"
                />
                <span className="text-sm">{roleDisplayNames[role]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Email Field */}
        <div>
          <input
            className={`w-full p-3 rounded-md focus:outline-none focus:ring-2 placeholder:text-white text-white focus:ring-white border-white border-2 ${
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

        {/* Password Field */}
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

        {/* Phone Field - Show only for specific roles */}
        {['escort', 'agency', 'landlord'].includes(form.role) && (
          <div>
            <input
              className={`w-full p-3 placeholder:text-white text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white ${
                errors.phone ? 'border-2 border-red-500' : ''
              }`}
              name="phone"
              type="tel"
              placeholder="Phone * (required for this role)"
              value={form.phone}
              onChange={handleChange}
            />
            {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
          </div>
        )}

        {/* Submit Button */}
          <button
      type="submit"
      disabled={loading}
      className="w-full bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-md font-semibold transition-all duration-200 shadow-lg"
    >
      {loading ? "Registering..." : "Finish"}
    </button>

        {/* Role Info */}
        <div className="text-center text-sm text-purple-200">
          {form.role === 'visitor' ? 
            "Visitors only need email and password" :
            "Phone number is required for this role"
          }
        </div>
      </form>
    </div>
  );
}
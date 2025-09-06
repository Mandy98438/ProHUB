import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import LiquidEther from '../common/LiquidEther';

interface LoginProps {
  onToggleMode: () => void;
}

export const Login: React.FC<LoginProps> = ({ onToggleMode }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const success = await login(formData.email, formData.password);
    setIsLoading(false);

    if (!success) {
      setErrors({ email: 'Invalid email or password' });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Liquid Ether Background Effect */}
      <div className="absolute inset-0 z-0">
        <LiquidEther
          colors={['#ff0080', '#00ffff', '#8000ff', '#ff8000', '#0080ff']}
          mouseForce={35}
          cursorSize={120}
          isViscous={true}
          viscous={15}
          iterationsViscous={16}
          iterationsPoisson={24}
          resolution={0.8}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.6}
          autoIntensity={3.5}
          takeoverDuration={0.25}
          autoResumeDelay={2000}
          autoRampDuration={1.2}
        />
      </div>
      
      {/* Overlay for better readability */}
      <div className="absolute inset-0 z-10 bg-black/10"></div>
      
      <div className="max-w-md w-full space-y-8 relative z-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-white/80 drop-shadow">
            Sign in to your account to continue
          </p>
        </div>
        
        <form className="mt-8 space-y-6 bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-2xl ring-1 ring-white/20" onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            placeholder="Enter your email"
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={errors.password}
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="text-blue-300 hover:text-blue-200">
                Forgot Password?
              </a>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-white/80">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onToggleMode}
                className="text-blue-300 hover:text-blue-200 font-medium"
              >
                Create one
              </button>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-gradient-to-r from-white/20 to-white/25 backdrop-blur-sm rounded-xl border border-white/40 shadow-lg">
            <p className="text-sm text-white font-semibold mb-2 drop-shadow">
              Demo Credentials:
            </p>
            <p className="text-xs text-white/95 font-mono">
              Email: john@example.com<br />
              Password: password123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
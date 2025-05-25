import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [authError, setAuthError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();
  
  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    
    try {
      const { error } = await login(data.email, data.password);
      
      if (error) {
        setAuthError(error.message);
        return;
      }
      
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      setAuthError('An unexpected error occurred');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Or{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            create a new account
          </Link>
        </p>
      </div>
      
      {authError && (
        <Alert variant="error" title="Login failed">
          {authError}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          error={errors.email?.message}
        />
        
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
          error={errors.password?.message}
        />
        
        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Sign in
        </Button>
      </form>
    </div>
  );
}
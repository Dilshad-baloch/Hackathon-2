import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuthStore();
  const [authError, setAuthError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();
  
  const password = watch('password');
  
  const onSubmit = async (data: RegisterFormData) => {
    setAuthError(null);
    
    try {
      const { error } = await registerUser(data.email, data.password, data.fullName);
      
      if (error) {
        setAuthError(error.message);
        return;
      }
      
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      setAuthError('An unexpected error occurred');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            sign in to your existing account
          </Link>
        </p>
      </div>
      
      {authError && (
        <Alert variant="error" title="Registration failed">
          {authError}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Full Name"
          autoComplete="name"
          placeholder="Enter your full name"
          {...register('fullName', {
            required: 'Full name is required',
          })}
          error={errors.fullName?.message}
        />
        
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
          autoComplete="new-password"
          placeholder="Create a password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
          error={errors.password?.message}
        />
        
        <Input
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          placeholder="Confirm your password"
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
          error={errors.confirmPassword?.message}
        />
        
        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Create Account
        </Button>
      </form>
    </div>
  );
}
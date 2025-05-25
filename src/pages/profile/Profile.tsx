import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { User } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

interface ProfileFormData {
  full_name: string;
  email: string;
}

export default function Profile() {
  const { user, profile, updateProfile } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      full_name: profile?.full_name || '',
      email: profile?.email || user?.email || '',
    },
  });
  
  const onSubmit = async (data: ProfileFormData) => {
    setIsUpdating(true);
    
    try {
      const { error } = await updateProfile({
        full_name: data.full_name,
      });
      
      if (error) {
        toast.error('Failed to update profile');
        return;
      }
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-1 text-gray-600">
          Manage your account information
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  {...register('full_name', {
                    required: 'Full name is required',
                  })}
                  error={errors.full_name?.message}
                />
                
                <Input
                  label="Email Address"
                  type="email"
                  disabled
                  {...register('email')}
                />
                
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    isLoading={isUpdating}
                    disabled={isUpdating}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <User className="h-12 w-12" />
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {profile?.full_name || user?.email}
                </h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              
              <div className="pt-2">
                <div className="flex items-center justify-between border-t border-gray-200 py-3">
                  <span className="text-sm font-medium text-gray-500">Role</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {profile?.role === 'admin' ? 'Administrator' : 'Customer'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between border-t border-gray-200 py-3">
                  <span className="text-sm font-medium text-gray-500">Member Since</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {new Date(profile?.created_at || '').toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
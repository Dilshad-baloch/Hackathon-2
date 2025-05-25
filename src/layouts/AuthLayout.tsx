import { Outlet } from 'react-router-dom';
import { CalendarClock } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
  <video
    autoPlay
    loop
    muted
    className="absolute inset-0 w-full h-full object-cover"
  >
    <source src="src/stores/10915129-hd_3840_2160_30fps (1) (1) (1) (1).mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  <div className="relative flex h-full items-center justify-center p-12 bg-bue-600 bg-opacity-60">
    <div className="max-w-lg text-center">
      <div className="mb-8 flex justify-center">
        <CalendarClock className="h-16 w-16 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-white">Event Management System</h1>
      <p className="mt-4 text-xl text-blue-100">
        Create and manage events, track participants, and more with our comprehensive event management platform.
      </p>
    </div>
  </div>
</div>

      
      {/* Right side - Auth forms */}
      <div className="flex w-full items-center justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:hidden">
            <CalendarClock className="mx-auto h-12 w-12 text-blue-600" />
            <h1 className="mt-4 text-3xl font-bold text-gray-900">Event Management System</h1>
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
}


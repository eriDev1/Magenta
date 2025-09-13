import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        {/* Left side - Background Image with overlay */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <Image
            src="/auth-background.jpg"
            alt="Mageta Background"
            fill
            className="object-cover"
            priority
          />
          {/* Subtle gradient overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent"></div>
        </div>
        
        {/* Right side - Form with sophisticated styling */}
        <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md">
            {/* Mobile branding */}
            <div className="text-center mb-8 lg:hidden">
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-white">M</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Mageta</h1>
              <p className="text-sm text-gray-500">Task Management Platform</p>
            </div>
            
            {/* Form container with subtle styling */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

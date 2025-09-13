import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex min-h-screen">
        <div className="flex-1 flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            {children}
          </div>
        </div>
        
        <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 to-purple-600 items-center justify-center p-12">
          <div className="text-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <span className="text-4xl font-bold text-white">M</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Welcome to Mageta</h1>
            <p className="text-xl text-blue-100 mb-8">
              Your powerful task management platform
            </p>
            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Organize tasks efficiently</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Collaborate with your team</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Track progress in real-time</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h1>
      <p className="text-gray-600">We encountered an error processing your request</p>
    </div>
    
    <div className="p-8 text-center">
        {params?.error ? (
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Error details:</p>
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
              {params.error}
            </p>
          </div>
        ) : (
          <p className="text-gray-600 mb-6">
            An unspecified error occurred. Please try again.
          </p>
        )}
        <div className="space-y-3">
          <Link
            href="/auth/login"
            className="inline-flex items-center px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors duration-200 mr-3"
          >
            Try again
          </Link>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-all duration-200"
          >
            Go home
          </Link>
        </div>
      </div>
  );
}

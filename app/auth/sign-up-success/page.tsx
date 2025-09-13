import {
  Card,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <><div className="text-center mb-8 pt-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 ">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2 ">Welcome to Mageta!</h1>
      <p className="text-gray-600">Your account has been created successfully</p>
    </div><div className="p-8 text-center">
        <p className="text-gray-600 mb-6">
          We&apos;ve sent you a confirmation email. Please check your inbox and click the link to verify your account before signing in.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Go to sign in
        </Link>
      </div></>
  );
}

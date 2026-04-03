import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <p className="text-gray-600 mb-6 max-w-md">This page does not exist or was moved.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
      >
        Back to home
      </Link>
    </main>
  );
}

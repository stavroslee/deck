import Link from 'next/link';

const Cancel = () => {
  return (
    <div className="p-5 max-w-2xl mx-auto text-center bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-4xl mb-8">Subscription Cancelled</h1>
      <p className="text-lg text-gray-400 mb-8">
        Your subscription process was cancelled. If you have any questions, feel free to contact support.
      </p>
      <div className="flex justify-center space-x-4">
        <Link href="/subscriptions">
          <button className="px-4 py-2 bg-blue-500 text-black rounded-lg">Try Again</button>
        </Link>
        <Link href="/">
          <button className="px-4 py-2 bg-gray-700 text-white rounded-lg">Go to Home</button>
        </Link>
      </div>
    </div>
  );
};

export default Cancel;

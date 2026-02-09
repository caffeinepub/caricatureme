import { CheckCircle2 } from 'lucide-react';

export default function SuccessNotification() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-500 dark:border-green-600 rounded-xl p-6 mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-1">
            Payment Successful
          </h3>
          <p className="text-sm text-green-700 dark:text-green-300">
            Your payment has been processed successfully.
          </p>
        </div>
      </div>
    </div>
  );
}

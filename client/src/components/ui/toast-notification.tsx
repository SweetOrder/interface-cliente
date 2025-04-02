import { CheckCircle } from "lucide-react";

interface ToastNotificationProps {
  title: string;
  message: string;
  visible: boolean;
  onClose: () => void;
}

export default function ToastNotification({ title, message, visible, onClose }: ToastNotificationProps) {
  if (!visible) return null;
  
  // Hide the toast after 3 seconds
  setTimeout(() => {
    onClose();
  }, 3000);
  
  return (
    <div className="fixed bottom-20 right-4 bg-white shadow-lg rounded-lg p-3 flex items-center max-w-xs z-50 transform translate-y-0 transition-transform">
      <div className="bg-[#4ECDC4] w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
        <CheckCircle className="h-5 w-5 text-white" />
      </div>
      <div className="ml-3">
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-[#555555] text-xs">{message}</p>
      </div>
    </div>
  );
}

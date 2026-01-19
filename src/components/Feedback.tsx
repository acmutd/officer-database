import { MessageSquare } from 'lucide-react';

export function FeedbackButton() {
  const handleFeedbackClick = () => {
    const googleFormUrl = 'https://forms.gle/8bdLXyjDXcS2DtVU8';
    window.open(googleFormUrl, '_blank');
  };

  return (
    <button
      onClick={handleFeedbackClick}
      className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-full shadow-2xl shadow-indigo-500/50 hover:shadow-indigo-500/70 hover:scale-110 transition-all duration-300 flex items-center justify-center group animate-pulse hover:animate-none"
    >
      <MessageSquare className="w-7 h-7 text-white group-hover:rotate-12 transition-transform" />
      <span className="absolute right-full mr-4 bg-slate-900 border border-indigo-500/30 text-white px-4 py-2 rounded-xl text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
        Send Feedback
      </span>
    </button>
  );
}
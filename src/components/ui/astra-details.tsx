
import { Mail, Phone, User } from "lucide-react";

export default function AstraDetails() {
  const contacts = [
    {
      name: "Elijah Walker",
      email: "etw220001@utdallas.edu",
      phone: "615-853-9037",
    },
    {
      name: "John Cole",
      email: "John.Cole@utdallas.edu",
      phone: "972-883-6353",
    },
  ];

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-full p-5">
      <h3 className="pl-2 text-xl font-semibold text-white mb-2">
        Reservation Details
      </h3>

      <div className="h-px w-44 bg-white/20 mb-4 ml-2" />

      <div className="space-y-4">
        {contacts.map((contact, index) => (
          <div
            key={index}
            className=" bg-black/60 border border-white/10 rounded-lg p-4">

            <div className="space-y-2 pl-1">
              <p className="text-white font-medium">{contact.name}</p>

              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2 flex-1">
                  <Mail size={14} className="text-zinc-500" />
                  <span className="text-sm text-zinc-400">
                    {contact.email}
                  </span>
                </div>
                <button
                  onClick={() => copy(contact.email)}
                  className="p-1.5 rounded-md hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                </button>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-2 flex-1">
                  <Phone size={14} className="text-zinc-500" />
                  <span className="text-sm text-zinc-400">
                    {contact.phone}
                  </span>
                </div>
                <button
                  onClick={() => copy(contact.phone)}
                  className="p-1.5 rounded-md hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
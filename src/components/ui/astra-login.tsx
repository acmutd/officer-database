import { useState } from "react";
import { Eye, EyeOff, Copy } from "lucide-react";

export default function AstraLoginCredentials(){

    const [showPassword, setShowPassword] = useState(false);
   
   const username = "studentorg";
   const password = "Tobor2526!";

    const copy = (text: string) => {
        navigator.clipboard.writeText(text);
    };
    
    return (
    <div className="w-full p-5">

      <h3 className="pl-2 text-xl font-semibold text-white mb-2">
        Login Credentials
      </h3>

      
      <div className="h-px w-40 bg-white/20 mb-4 ml-2" />

      
      <div className=" mb-5">
        <label className=" pl-2 block text-xs text-zinc-400 mb-2 tracking-wider">
          Username
        </label>

        <div className="flex items-center bg-black/60 border border-white/10 rounded-lg px-3 py-2">

          <input
            readOnly
            value={username}
            className="flex-1 bg-transparent outline-none text-white text-sm"
          />

          <button
            onClick={() => copy(username)}
            className="p-1.5 rounded-md hover:bg-white/10"
          >
            <Copy size={16} className="text-zinc-400" />
          </button>

        </div>
      </div>

      <div>
        <label className="pl-2 block text-xs text-zinc-400 mb-2 tracking-wider">
          Password
        </label>

        <div className="flex items-center bg-black/60 border border-white/10 rounded-lg px-3 py-2">

          <input
            type={showPassword ? "text" : "password"}
            readOnly
            value={password}
            className="flex-1 bg-transparent outline-none text-white text-sm"
          />

          <button
            onClick={() => setShowPassword(!showPassword)}
            className="p-1.5 rounded-md hover:bg-white/10"
          >
            {showPassword ? (
              <EyeOff size={16} className="text-zinc-400" />
            ) : (
              <Eye size={16} className="text-zinc-400" />
            )}
          </button>

          <button
            onClick={() => copy(password)}
            className="p-1.5 rounded-md hover:bg-white/10 ml-1"
          >
            <Copy size={16} className="text-zinc-400" />
          </button>

        </div>
      </div>
      
      <div className="mt-6 text-sm text-white/60 text-center">
        Go to{" "}
        <a
          href="https://www.aaiscloud.com/UTXDallas/logon.aspx?ReturnUrl=%2futxdallas%2fcalendars%2fdailygridcalendar.aspx"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-white transition underline-offset-4 hover:underline"
        >
          Astra
        </a>{" "}
        or use{" "}
        <a
          href="https://github.com/acmutd/form-autocomplete-ext"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-white transition underline-offset-4 hover:underline"
        >
          Autofill
        </a>
      </div>
        

    </div>
  );
}
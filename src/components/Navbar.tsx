import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Link } from "@tanstack/react-router";


const activeLinkClasses =
    "text-white font-semibold underline decoration-2 underline-offset-[6px]";
const linkClasses =
    "text-sm sm:text-base text-white/80 font-medium transition-colors duration-200 hover:text-white";


export function Navbar() {
    const { logout } = useAuth();


    return (
        <nav className="fixed top-0 left-0 right-0 z-50 py-2 bg-black/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-2 flex items-center justify-center">
        
            <div className="flex items-center gap-4 sm:gap-8 md:gap-12">

                <Link
                    to="/directory"
                    className={linkClasses}
                    activeProps={{ className: activeLinkClasses }}
                >
                    directory
                </Link>
               
                <img src="/acm.png" alt="ACM Logo" className="h-8 sm:h-10 md:h-11" />
                <Link
                    to="/profile"
                    className={linkClasses}
                    activeProps={{ className: activeLinkClasses }}
                >
                    my profile
                </Link>
            </div>

            <button
                onClick={() => logout()}
                className="absolute right-2 sm:right-4 md:right-8 flex items-center justify-center shrink-0 h-9 w-9 sm:h-10 sm:w-10 rounded-full  text-white transition-all duration-200 hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-transparent"
                aria-label="Log Out"
                title="Log Out"
            >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            </div>
        </nav>
    );
}



import { Link } from 'react-router-dom';
import { GiRobotHelmet } from "react-icons/gi";
import { Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar() {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = ["Dashboard", "Jobs", "Analyse", "History", "Account"];

    return (
        <header className="p-5">
            <nav className="border-b border-gray-200">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link
                                to="/"
                                className="text-4xl font-bold text-white-800 flex items-center justify-center gap-2 text-white">
                                HR Hero <GiRobotHelmet />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-center gap-8">
                                {navItems.map((item) => (
                                    <Link
                                        to={`/${item.toLowerCase()}`}
                                        key={item}
                                        className="text-white">
                                        {item}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-gray-100 hover:text-gray-900"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMobileMenuOpen ? (
                                    <X className="h-6 w-6 cursor-pointer" />
                                ) : (
                                    <Menu className="h-6 w-6 cursor-pointer" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200">
                        <div className="space-y-1 px-4 pb-3 pt-2">
                            {navItems.map((item) => (
                                <Link
                                    to={`/${item.toLowerCase()}`}
                                    key={item}
                                    className="block rounded-md px-3 py-2 text-white hover:bg-gray-100 hover:text-gray-900">
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav >
        </header >
    );
}


export default Navbar;
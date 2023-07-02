import { Button } from '@chakra-ui/react';
import Link from 'next/link';
import { useUser } from '../providers/user';

const Navbar = () => {
  const { logout } = useUser()
  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link className="text-white font-bold text-xl" href="/">
              My efrei
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link className="text-white hover:bg-gray-700 px-3 py-2 rounded-md" href="/app/students">
              Students
            </Link>
            <Link className="text-white hover:bg-gray-700 px-3 py-2 rounded-md" href="/app/classes">
              Classes
            </Link>
            <Button onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import Navbar from '../components/Navbar';

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};

export default Layout;

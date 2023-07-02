import Layout from '@/core/layouts/AppLayout';
import React from 'react';

const PresentationPage = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-8">School Management App</h1>
        <p className="text-lg mb-8 text-center">
          Welcome to our school management app, where you can easily manage students, grades, classes,
          and more. Simplify your administrative tasks and streamline your school operations with our
          intuitive and powerful features.
        </p>
        <a
          href="#"
          className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Get Started
        </a>
      </div>
    </Layout>
  );
};

export default PresentationPage;


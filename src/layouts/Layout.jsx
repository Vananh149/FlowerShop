import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../ui/shared/Header';
import Footer from '../ui/shared/Footer';

export default function Layout() {
    return (
        <div className="font-sans text-[#4A4A4A] min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

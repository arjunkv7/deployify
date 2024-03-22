import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
    <React.Fragment>
        <div className="navigationWrapper">
            <Navbar />
            <main>{children}</main>
        </div>
    </React.Fragment>
    );
};
export default Layout;
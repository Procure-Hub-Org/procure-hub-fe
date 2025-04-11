import React, { useState } from 'react';


import Sidebar from "../components/Sidebar/Sidebar";
import OutlinedButton from '../components/Button/OutlinedButton';
import Layout from "../components/Layout/Layout";

import '../styles/SellerDashboard.css';


const procurementRequests = [
    {
        id: 1,
        title: 'Procurement of Office Supplies',
        description: 'Need a supplier for various office stationery items.',
        deadline: '2025-04-30',
        budget: '$2,000',
        category: 'Office Supplies',
    },
    {
        id: 2,
        title: 'IT Equipment Purchase',
        description: 'Looking for laptops and accessories for new employees.',
        deadline: '2025-05-10',
        budget: '$10,000',
        category: 'Electronics',
    },
    {
        id: 3,
        title: 'Procurement of Office Supplies',
        description: 'Need a supplier for various office stationery items.',
        deadline: '2025-04-30',
        budget: '$2,000',
        category: 'Office Supplies',
    },
    {
        id: 4,
        title: 'IT Equipment Purchase',
        description: 'Looking for laptops and accessories for new employees.',
        deadline: '2025-05-10',
        budget: '$10,000',
        category: 'Electronics',
    },
    {
        id: 5,
        title: 'Procurement of Office Supplies',
        description: 'Need a supplier for various office stationery items.',
        deadline: '2025-04-30',
        budget: '$2,000',
        category: 'Office Supplies',
    },
    {
        id: 6,
        title: 'IT Equipment Purchase',
        description: 'Looking for laptops and accessories for new employees.',
        deadline: '2025-05-10',
        budget: '$10,000',
        category: 'Electronics',
    },
];

const SellerDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <Layout>
            <div className='dashboard-layout'>

                <div className="left-column">
                        <OutlinedButton onClick={() => setSidebarOpen(true)}>
                            Open Sidebar
                        </OutlinedButton>
                    {sidebarOpen && (
                        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                    )}
                </div>

                <div className="dashboard-container">
                    <main className="dashboard-main">
                        <h2>Lista procurement requestova</h2>
                        <div className="item-list">
                            {procurementRequests.map((request) => (
                                <div key={request.id} className="item-card">
                                    <div>
                                        <h3 className="font-bold text-lg">{request.title}</h3>
                                        <p className="text-sm text-gray-700">{request.description}</p>
                                        <p className="text-sm">Deadline: {request.deadline}</p>
                                        <p className="text-sm">Estimated Budget: {request.budget}</p>
                                        <p className="text-sm">Category: {request.category}</p>
                                    </div>
                                    <button className="btn ml-4">Follow</button>
                                </div>
                            ))}
                        </div>
                    </main>
                </div>

            </div>
        </Layout>
    );
};


export default SellerDashboard;

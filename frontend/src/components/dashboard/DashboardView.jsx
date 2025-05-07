import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { inventoryService } from '../../services/inventoryService';
import DashboardChart from './DashboardChart';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const DashboardView = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        shipmentActivity: [],
        topItems: [],
        inventoryStats: null,
        lowStockItems: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch dashboard data
                const data = await inventoryService.getDashboardData();
                
                // Fetch all items to calculate stats
                const items = await inventoryService.getAll();
                
                // Calculate inventory stats
                const totalValue = items.reduce(
                    (sum, item) => sum + (item.quantity * (item.unit_price || 0)),
                    0
                );
                
                // Fetch low stock items
                const lowStock = await inventoryService.getLowStock();
                
                // Format data for charts
                setDashboardData({
                    shipmentActivity: {
                        labels: ['Incoming', 'Outgoing'],
                        datasets: [{
                            data: [
                                data.shipment_activity.find(s => s.type === 'IN')?.count || 0,
                                data.shipment_activity.find(s => s.type === 'OUT')?.count || 0
                            ],
                            backgroundColor: [
                                'rgba(75, 192, 192, 0.5)',
                                'rgba(255, 99, 132, 0.5)'
                            ],
                            borderColor: [
                                'rgb(75, 192, 192)',
                                'rgb(255, 99, 132)'
                            ]
                        }]
                    },
                    topItems: {
                        labels: data.top_items.map(item => item.name),
                        datasets: [
                            {
                                label: 'Current Quantity',
                                data: data.top_items.map(item => item.quantity),
                                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                                borderColor: 'rgb(54, 162, 235)',
                                borderWidth: 1
                            },
                            {
                                label: 'Minimum Stock',
                                data: data.top_items.map(item => item.minimum_stock),
                                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                borderColor: 'rgb(255, 99, 132)',
                                borderWidth: 1
                            }
                        ]
                    },
                    inventoryStats: {
                        totalItems: items.length,
                        totalValue: totalValue,
                        lowStockItems: lowStock.length
                    },
                    lowStockItems: lowStock
                });
            } catch (err) {
                setError('Failed to load dashboard data');
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="text-center p-4">Loading dashboard data...</div>;
    }

    if (error) {
        return <div className="text-red-600 p-4">{error}</div>;
    }

    return (
        <div>
            {/* Inventory stats */}
            {dashboardData.inventoryStats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-sm text-gray-600">Total Items</h2>
                        <p className="text-xl font-bold">{dashboardData.inventoryStats.totalItems}</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-sm text-gray-600">Total Value</h2>
                        <p className="text-xl font-bold">
                            ${dashboardData.inventoryStats.totalValue.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-sm text-gray-600">Low Stock Alerts</h2>
                        <p className="text-xl font-bold text-red-600">
                            {dashboardData.inventoryStats.lowStockItems}
                        </p>
                    </div>
                </div>
            )}
            
            {/* Low stock items */}
            {dashboardData.lowStockItems.length > 0 && (
                <div className="bg-white shadow rounded-lg p-4 mb-8">
                    <h2 className="text-lg font-semibold text-red-700 mb-2">
                        ⚠️ Low Stock Items
                    </h2>
                    <ul className="list-disc list-inside text-sm text-gray-800">
                        {dashboardData.lowStockItems.map((item) => (
                            <li key={item.id}>
                                <span className="font-medium">{item.name}</span>:{" "}
                                {item.quantity} in stock (Min: {item.minimum_stock})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DashboardChart
                    title="Top Items by Quantity"
                    type="bar"
                    data={dashboardData.topItems}
                />

                <DashboardChart
                    title="Recent Shipment Activity"
                    type="pie"
                    data={dashboardData.shipmentActivity}
                />
            </div>
        </div>
    );
};

export default DashboardView; 
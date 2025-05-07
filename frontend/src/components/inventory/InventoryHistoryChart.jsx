import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { inventoryService } from '../../services/inventoryService';
import { formatDate } from '../../utils/statusUtils';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const InventoryHistoryChart = ({ itemId }) => {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const data = await inventoryService.getItemHistory(itemId);
                setHistoryData(data);
                setError(null);
            } catch (err) {
                setError('Failed to load inventory history');
                console.error('Error fetching inventory history:', err);
            } finally {
                setLoading(false);
            }
        };

        if (itemId) {
            fetchHistory();
        }
    }, [itemId]);

    const chartData = {
        labels: historyData.map(point => formatDate(point.date)),
        datasets: [
            {
                label: 'Quantity',
                data: historyData.map(point => point.quantity),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.1
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Inventory History'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Quantity'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Date'
                }
            }
        }
    };

    if (loading) {
        return <div className="text-center p-4">Loading history...</div>;
    }

    if (error) {
        return <div className="text-red-600 p-4">{error}</div>;
    }

    if (historyData.length === 0) {
        return <div className="text-gray-500 p-4">No history available</div>;
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <Line data={chartData} options={options} />
        </div>
    );
};

export default InventoryHistoryChart; 
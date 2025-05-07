import { Pie, Bar } from 'react-chartjs-2';

const DashboardChart = ({ title, type, data, options = {} }) => {
    const defaultOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: type === 'pie' ? 'right' : 'top',
            }
        },
        ...(type === 'bar' && {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        })
    };

    const ChartComponent = type === 'pie' ? Pie : Bar;

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <ChartComponent 
                data={data}
                options={{ ...defaultOptions, ...options }}
            />
        </div>
    );
};

export default DashboardChart; 
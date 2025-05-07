import ShipmentRow from "./ShipmentRow";

const ShipmentList = ({
  shipments,
  onViewDetails,
  onDelete,
  onStatusChange
}) => {
  return (
    <div className="overflow-x-auto">
      {shipments.length === 0 ? (
        <p className="text-gray-600 p-4">No shipments found.</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-3 px-4 text-left font-semibold text-gray-600">
                Type
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">
                Tracking Number
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">
                Status
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">
                Carrier
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">
                Estimated Arrival
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">
                Items
              </th>
              <th className="py-3 px-4 text-right font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment) => (
              <ShipmentRow
                key={shipment.id}
                shipment={shipment}
                onViewDetails={onViewDetails}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ShipmentList;

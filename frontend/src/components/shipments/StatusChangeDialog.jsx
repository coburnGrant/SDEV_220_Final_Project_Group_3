import { formatStatus } from "../../utils/statusUtils";

// Dialog modal for confirming status changes
const StatusChangeDialog = ({ isOpen, onClose, onConfirm, selectedStatus }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        <h3 className="text-lg font-semibold mb-4">Confirm Status Change</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to change the status to {formatStatus(selectedStatus)}?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusChangeDialog; 
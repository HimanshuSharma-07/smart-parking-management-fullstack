import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import ConfirmDialog from '../../components/ConfirmDialog';

interface CreateSingleSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lotId: string;
  lotName: string;
}

export default function CreateSingleSlotModal({ isOpen, onClose, onSuccess, lotId, lotName }: CreateSingleSlotModalProps) {
  const [slotNumber, setSlotNumber] = useState('');
  const [floor, setFloor] = useState('');
  const [type, setType] = useState('standard');
  const [pricePerHour, setPricePerHour] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotNumber || !floor || !pricePerHour) {
      setError('All fields are required.');
      return;
    }
    setShowConfirm(true);
  };

  const executeSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await api.post(`/parking-slots/${lotId}/slots`, {
        slotNumber,
        floor: Number(floor),
        type,
        pricePerHour: Number(pricePerHour)
      });
      
      onSuccess();
      onClose();
      setSlotNumber('');
      setFloor('');
      setPricePerHour('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create parking slot.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[2000]" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto z-[2000]">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-5">
                    <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900">
                      Add Single Slot
                    </Dialog.Title>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {error && (
                    <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-800 border border-red-200">
                      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}

                  <p className="text-sm text-gray-600 mb-4">Adding a new slot to <strong>{lotName}</strong></p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slot Identifier</label>
                        <input
                          type="text"
                          value={slotNumber}
                          onChange={(e) => setSlotNumber(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                          placeholder="e.g. F1-S01"
                        />
                        <p className="mt-1 text-[10px] text-gray-500">Standard format: Floor-Slot (e.g. F1-S01)</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                        <input
                          type="number"
                          min="1"
                          value={floor}
                          onChange={(e) => setFloor(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                          placeholder="e.g. 1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Slot Type</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                      >
                        <option value="standard">Standard</option>
                        <option value="ev">EV Charging</option>
                        <option value="large">Large Vehicle</option>
                        <option value="disabled">Disabled Parking</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price per Hour (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={pricePerHour}
                        onChange={(e) => setPricePerHour(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                        placeholder="e.g. 50"
                      />
                    </div>

                    <div className="mt-8 flex gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Creating...' : 'Create Slot'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => void executeSubmit()}
        title="Confirm Slot Creation"
        message={`Are you sure you want to create slot ${slotNumber} on floor ${floor} at ₹${pricePerHour}/hr?`}
        confirmLabel="Create"
      />
    </>
  );
}

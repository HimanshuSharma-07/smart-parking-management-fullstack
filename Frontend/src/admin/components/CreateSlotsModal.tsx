import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { X } from 'lucide-react';
import api from '../../services/api';
import ConfirmDialog from '../../components/ConfirmDialog';

interface CreateSlotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lotId: string;
  lotName: string;
}

export default function CreateSlotsModal({ isOpen, onClose, onSuccess, lotId, lotName }: CreateSlotsModalProps) {
  const [floors, setFloors] = useState('');
  const [startFloor, setStartFloor] = useState('1');
  const [slotsPerFloor, setSlotsPerFloor] = useState('');
  const [type, setType] = useState('standard');
  const [pricePerHour, setPricePerHour] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!floors || !slotsPerFloor || !pricePerHour) {
      setError('All fields are required.');
      return;
    }
    setShowConfirm(true);
  };

  const executeSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await api.post(`/parking-slots/${lotId}/slots/bulk`, {
        floors: Number(floors),
        startFloor: Number(startFloor),
        slotsPerFloor: Number(slotsPerFloor),
        type,
        pricePerHour: Number(pricePerHour)
      });
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create parking slots.');
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
                      Bulk Generate Slots
                    </Dialog.Title>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {error && (
                    <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800 border border-red-200">
                      {error}
                    </div>
                  )}

                  <p className="text-sm text-gray-600 mb-4">Adding slots to <strong>{lotName}</strong></p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Starting Floor</label>
                        <input
                          type="number"
                          min="1"
                          value={startFloor}
                          onChange={(e) => setStartFloor(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                          placeholder="e.g. 1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Num. Floors</label>
                        <input
                          type="number"
                          min="1"
                          value={floors}
                          onChange={(e) => setFloors(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                          placeholder="e.g. 1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Slots per Floor</label>
                      <input
                        type="number"
                        min="1"
                        value={slotsPerFloor}
                        onChange={(e) => setSlotsPerFloor(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                        placeholder="e.g. 10"
                      />
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
                        {loading ? 'Generating...' : 'Generate Slots'}
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
        title="Confirm Bulk Slot Creation"
        message={`Are you sure you want to continuously generate ${slotsPerFloor} slots across ${floors} floors? This action assigns ₹${pricePerHour}/hr to all new slots.`}
        confirmLabel="Generate"
      />
    </>
  );
}

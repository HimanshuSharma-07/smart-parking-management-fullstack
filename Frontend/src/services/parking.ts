import api from './api';

export interface BackendParkingLot {
  _id: string;
  lotName: string;
  address: string;
  parkingLotImg: string;
  totalSlots: number;
  totalFloors: number;
  slotsPerFloor: number;
}

export interface BackendParkingSlot {
  _id: string;
  slotNumber: string;
  floor: number;
  type: 'standard' | 'ev' | 'large' | 'disabled';
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  pricePerHour: number;
  lotId: string;
}

export async function fetchAllParkingLots(): Promise<BackendParkingLot[]> {
  const { data } = await api.get<{ data: BackendParkingLot[] }>('/parking-lots/all-parking-lots');
  return data.data;
}

export async function fetchSlotsForLot(lotId: string): Promise<BackendParkingSlot[]> {
  const { data } = await api.get<{ data: BackendParkingSlot[] }>(`/parking-slots/${lotId}/slots`);
  return data.data;
}

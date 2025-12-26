'use client';

import { Address } from '@/types';
import { CheckCircleIcon, PlusIcon } from '@heroicons/react/24/solid';

interface AddressSelectorProps {
  addresses: Address[];
  selectedAddressId: number | null;
  onAddressSelect: (addressId: number) => void;
  onAddNewClick: () => void;
}

export function AddressSelector({
  addresses,
  selectedAddressId,
  onAddressSelect,
  onAddNewClick,
}: AddressSelectorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Shipping Address</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <button
            key={address.id}
            onClick={() => onAddressSelect(address.id!)}
            className={`relative p-4 text-left border-2 rounded-lg transition-all ${
              selectedAddressId === address.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {selectedAddressId === address.id && (
              <CheckCircleIcon className="absolute top-3 right-3 w-6 h-6 text-blue-500" />
            )}
            {address.isDefault && (
              <span className="inline-block mb-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                Default
              </span>
            )}
            <p className="font-medium text-gray-900">{address.street}</p>
            <p className="text-gray-600 text-sm mt-1">
              {address.city}, {address.state} {address.zipCode}
            </p>
            <p className="text-gray-600 text-sm">{address.country}</p>
          </button>
        ))}

        <button
          onClick={onAddNewClick}
          className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
        >
          <PlusIcon className="w-5 h-5 text-gray-400 mr-2" />
          <span className="text-gray-600 font-medium">Add New Address</span>
        </button>
      </div>
    </div>
  );
}

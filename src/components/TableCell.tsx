import React from 'react';
import { Users } from 'lucide-react';
import { Table } from '../types';

interface TableCellProps {
  table: Table;
  isHovered: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'available':
      return { bg: 'bg-green-500', hover: 'hover:bg-green-600' };
    case 'occupied':
      return { bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600' };
    case 'in-progress':
      return { bg: 'bg-blue-500', hover: 'hover:bg-blue-600' };
    case 'delayed':
      return { bg: 'bg-red-500', hover: 'hover:bg-red-600' };
    default:
      return { bg: 'bg-gray-500', hover: 'hover:bg-gray-600' };
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'available':
      return 'Available';
    case 'occupied':
      return 'Occupied';
    case 'in-progress':
      return 'In Progress';
    case 'delayed':
      return 'Delayed';
    default:
      return 'Unknown';
  }
};

const TableCell: React.FC<TableCellProps> = ({ table, isHovered }) => {
  const { bg, hover } = getStatusColor(table.status);
  const statusLabel = getStatusLabel(table.status);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`relative w-20 h-20 rounded-lg ${bg} ${hover} transition-colors duration-200 shadow-lg flex items-center justify-center cursor-pointer transform transition-transform ${
          isHovered ? 'scale-105' : ''
        }`}
      >
        <div className="text-center">
          <div className="text-white font-bold text-lg">{table.number}</div>
          {table.status !== 'available' && (
            <Users className="w-4 h-4 text-white mx-auto mt-1 opacity-75" />
          )}
        </div>

        {isHovered && (
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-md text-xs whitespace-nowrap shadow-lg z-10">
            <div className="font-semibold">{table.number}</div>
            <div className="text-gray-300 text-xs">{statusLabel}</div>
            {table.occupancyTime && (
              <div className="text-gray-300 text-xs">
                {table.occupancyTime}m seated
              </div>
            )}
          </div>
        )}
      </div>
      <div className="text-center">
        <div className="text-xs font-medium text-gray-700 uppercase tracking-wider">
          {table.number}
        </div>
        <div className="text-xs text-gray-500 mt-1">{statusLabel}</div>
      </div>
    </div>
  );
};

export default TableCell;

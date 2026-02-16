import React, { useState } from 'react';
import { useRestaurant } from '../contexts/RestaurantContext';
import TableCell from './TableCell';

export const OperationalGrid: React.FC = () => {
  const { tables, setSelectedTable, selectedWaiter, selectedTable } = useRestaurant();
  const [hoveredTable, setHoveredTable] = useState<number | null>(null);

  return (
    <div className={`relative p-2 bg-gradient-to-br from-gray-50 to-gray-100 min-h-96 transition-all duration-500 ease-in-out ${selectedTable ? 'scale-110 origin-top-left' : ''}`}>
      <div className="relative grid grid-cols-5 gap-1 w-fit mx-auto px-2">
        {tables.map((table) => {
          const isAssigned = selectedWaiter?.assignedTables.includes(table.id);
          return (
            <div key={table.id} className="flex justify-center relative p-0">
               {isAssigned && (
                  <div className="absolute inset-0 bg-blue-400 opacity-20 rounded-xl transform scale-110 z-0 animate-pulse"></div>
               )}
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedTable(table);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedTable(table);
                  }
                }}
                onMouseEnter={() => setHoveredTable(table.id)}
                onMouseLeave={() => setHoveredTable(null)}
                className={`transform transition-all duration-200 hover:scale-110 focus:outline-none z-10 cursor-pointer ${isAssigned ? 'ring-2 ring-blue-500 ring-offset-2 rounded-xl' : ''}`}
              >
                <TableCell
                  table={table}
                  isHovered={hoveredTable === table.id}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

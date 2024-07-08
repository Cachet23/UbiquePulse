/**
 * @file Menu.tsx
 * Defines the Menu component for the application, providing toggles for sound and data transmission settings.
 * (GPT generated)
 * @author Nils Baierl
 */

import React from 'react';
import Switch from 'react-switch';

/**
 * @interface MenuProps
 * @property {boolean} soundEnabled - Indicates if sound notifications are enabled.
 * @property {boolean} sendRedRaw - Indicates if sending of raw red sensor data is enabled.
 * @property {() => void} toggleSound - Function to toggle the soundEnabled state.
 * @property {() => void} toggleSendRedRaw - Function to toggle the sendRedRaw state.
 */
interface MenuProps {
  soundEnabled: boolean;
  sendRedRaw: boolean;
  toggleSound: () => void;
  toggleSendRedRaw: () => void;
}

const Menu: React.FC<MenuProps> = ({ soundEnabled, sendRedRaw, toggleSound, toggleSendRedRaw }) => {
  return (
    <div className="absolute top-0 right-0 mt-24 mr-4 w-48 bg-white rounded-md shadow-lg z-20 p-4 md:w-64 lg:w-72">
      <div className="flex items-center justify-between">
        <span className="text-gray-800">Sound</span>
        <Switch
          onChange={toggleSound}
          checked={soundEnabled}
          onColor="#86d3ff"
          onHandleColor="#2693e6"
          handleDiameter={30}
          uncheckedIcon={false}
          checkedIcon={false}
          height={20}
          width={48}
          className="transform scale-75 md:scale-100"
        />
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="text-gray-800">Send Red Raw</span>
        <Switch
          onChange={toggleSendRedRaw}
          checked={sendRedRaw}
          onColor="#86d3ff"
          onHandleColor="#2693e6"
          handleDiameter={30}
          uncheckedIcon={false}
          checkedIcon={false}
          height={20}
          width={48}
          className="transform scale-75 md:scale-100"
        />
      </div>
    </div>
  );
};

export default Menu;
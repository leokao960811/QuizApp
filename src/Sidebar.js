import React from 'react';

const Sidebar = ({ onSelectBank, selectedBankName }) => {
  return (
    <div className="sidebar">
      <h3>Select Question Bank</h3>
      <ul>
        <li>
          <span>YDKJ Style</span>
          <button
            onClick={() => onSelectBank('bank1')}
            className={selectedBankName === 'bank1' ? 'selected' : ''}
          >
            Select
          </button>
        </li>
        <li>
          <span>Bank 2</span>
          <button
            onClick={() => onSelectBank('bank2')}
            className={selectedBankName === 'bank2' ? 'selected' : ''}
          >
            Select
          </button>
        </li>
        <li>
          <span>All Banks</span>
          <button
            onClick={() => onSelectBank('allBanks')}
            className={selectedBankName === 'allBanks' ? 'selected' : ''}
          >
            Select
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

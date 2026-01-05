import React, { useState } from 'react';
import './Commontable.css';
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";


const CommonTable = ({ columns = [], data = [], actions, title = "All Users", pagination }) => {
  const [checkedRows, setCheckedRows] = useState(new Set());
  const [headerChecked, setHeaderChecked] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const handleHeaderCheckbox = () => {
    if (headerChecked) {
      setCheckedRows(new Set());
    } else {
      setCheckedRows(new Set(data.map((_, idx) => idx)));
    }
    setHeaderChecked(!headerChecked);
  };

  const handleRowCheckbox = (idx) => {
    const newChecked = new Set(checkedRows);
    if (newChecked.has(idx)) {
      newChecked.delete(idx);
    } else {
      newChecked.add(idx);
    }
    setCheckedRows(newChecked);
    setHeaderChecked(newChecked.size === data.length);
  };

  const handleSort=(key)=>{
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc";
    }

    setSortConfig({ key, direction });
  }
  const sortedData = [...data].sort((a, b) => {
  if (!sortConfig.key) return 0;

  const aValue = a[sortConfig.key];
  const bValue = b[sortConfig.key];

  if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
  if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;

  return 0;
});

  return (
    <div className="table-section">
      <table className="common-table">
        <thead>
          <tr>
            <th className="checkbox-column">
              <div 
                className={`checkbox ${headerChecked ? 'checked' : ''}`}
                onClick={handleHeaderCheckbox}
              ></div>
            </th>
            {columns.map((col, idx) => (
              <th key={idx} onClick={() => handleSort(col.key)}className="sortable-header">
                <div className="th-content">
                  {col.icon && <span className="column-icon">{col.icon}</span>}
                  <span>{col.label}</span>
                  <span style={{ marginLeft: "6px", fontSize: "12px" }}>
  {sortConfig.key !== col.key && <FaSort />} 

  {sortConfig.key === col.key && sortConfig.direction === "asc" && (
    <FaSortUp />
  )}

  {sortConfig.key === col.key && sortConfig.direction === "desc" && (
    <FaSortDown />
  )}
</span>
                </div>
              </th>
            ))}
            {actions && <th className="actions-column"></th>}
          </tr>
        </thead>

        <tbody>
          {sortedData.map((row, idx) => (
            <tr key={idx} onClick={() => handleRowCheckbox(idx)}>
              <td>
                <div 
                  className={`checkbox ${checkedRows.has(idx) ? 'checked' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRowCheckbox(idx);
                  }}
                ></div>
              </td>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {actions && (
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="actions-cell">
                    {actions(row)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommonTable;
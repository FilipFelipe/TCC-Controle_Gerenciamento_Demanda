import React from 'react';
import { Table } from 'react-bootstrap';

const Datatable = ({ data, ...props }) => {
  const renderTHead = () => {
    const keys = Object.keys(data[0]);
    return keys.map((key, index) => <th key={index}>{key}</th>);
  };

  const renderTBody = () => {
    const keys = Object.keys(data[0]);
    return data.map((value, index) => (
      <tr key={index}>
        {keys.map((key, index) => (
          <td key={index}>{value[key]}</td>
        ))}
      </tr>
    ));
  };

  return (
    <Table {...props}>
      <thead>
        <tr key="header">{renderTHead()}</tr>
      </thead>
      <tbody>{renderTBody()}</tbody>
    </Table>
  );
};

export default Datatable;

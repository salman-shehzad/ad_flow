const Table = ({ columns, data }) => {
  return (
    <table className="table">
      <thead>
        <tr>{columns.map(col => <th key={col.key}>{col.title}</th>)}</tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map(col => <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;

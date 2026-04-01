const EmptyState = ({ message = 'No items found.' }) => (
  <div className="empty-state">
    <p>{message}</p>
  </div>
);

export default EmptyState;

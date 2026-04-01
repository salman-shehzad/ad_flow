const StatsCard = ({ title, value, icon }) => {
  return (
    <div className="statscard">
      <div className="statscard-icon">{icon}</div>
      <div>
        <h4>{title}</h4>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;

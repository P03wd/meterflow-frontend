const StatsCard = ({ title, value }) => {
  return (
    <div style={{
      flex: 1,
      padding: 20,
      borderRadius: 10,
      background: "#f5f5f5",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
    }}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
};

export default StatsCard;
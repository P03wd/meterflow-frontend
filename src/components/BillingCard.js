const BillingCard = ({ billing }) => {
  return (
    <div style={{
      padding: 20,
      borderRadius: 10,
      background: "#fff3cd",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      marginTop: 20
    }}>
      <h2>💰 Billing Summary</h2>

      {billing ? (
        <>
          <p>Total Requests: {billing.totalRequests}</p>
          <p>Cost per Request: ₹{billing.costPerRequest}</p>
          <p>Total Cost: ₹{billing.totalCost}</p>
        </>
      ) : (
        <p>No billing data</p>
      )}
    </div>
  );
};

export default BillingCard;
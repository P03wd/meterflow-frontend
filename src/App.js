import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

import {
  fetchUsage,
  fetchBilling,
  fetchPokemon,
  createOrder,
  verifyPayment,
  API_KEY
} from "./services/api";

function App() {
  const [usage, setUsage] = useState(null);
  const [billing, setBilling] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [pokemon, setPokemon] = useState(null);
  const [name, setName] = useState("ditto");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 LOAD DATA (FIXED)
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const usageRes = await fetchUsage();
      const usageData = usageRes.data;

      setUsage(usageData);

      const billingRes = await fetchBilling();
      setBilling(billingRes.data);

      // 🔥 FIXED: safe chart mapping
      const data = (usageData.recentRequests || []).map((r) => ({
        time: r.timestamp
          ? new Date(r.timestamp).toLocaleTimeString()
          : "N/A",
        latency: r.latency || 0
      }));

      setChartData(data);

    } catch (err) {
      setError(err.response?.data?.message || "Error loading data");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 POKEMON
  const searchPokemon = async () => {
    try {
      setError("");
      const res = await fetchPokemon(name);
      setPokemon(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching pokemon");
    }
  };

  // 💳 PAYMENT
  const handlePayment = async () => {
    try {
      const { data: order } = await createOrder();

      const options = {
        key: "rzp_test_SipBngpovmEbKD",
        amount: order.amount,
        currency: order.currency,
        name: "MeterFlow",
        order_id: order.id,
        handler: async function (response) {
          await verifyPayment(response);
          alert("Payment Successful 🎉");
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      alert("Payment failed");
    }
  };

  // 🔄 AUTO REFRESH (FIXED STABILITY)
  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>🚀 MeterFlow Dashboard</h1>

      <p><strong>API Key:</strong> {API_KEY}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}

      {/* USAGE */}
      <div>
        <h2>Usage Stats</h2>
        <p>Total Requests: {usage?.totalRequests || 0}</p>
        <p>Avg Latency: {usage?.avgLatency || 0} ms</p>
      </div>

      {/* CHART */}
      <div>
        <h2>📈 Latency Chart</h2>
        <LineChart width={600} height={300} data={chartData}>
          <CartesianGrid />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="latency" />
        </LineChart>
      </div>

      {/* BILLING */}
      <div>
        <h2>💰 Billing</h2>
        <p>Total Requests: {billing?.totalRequests || 0}</p>
        <p>Total Cost: ₹{billing?.totalCost || 0}</p>
      </div>

      {/* PAYMENT */}
      <button onClick={handlePayment}>💳 Pay ₹500</button>

      {/* POKEMON */}
      <div>
        <h2>Pokemon</h2>

        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={searchPokemon}>Search</button>

        {pokemon && (
          <div>
            <h3>{pokemon.name}</h3>
            <img src={pokemon.sprite} alt="pokemon" />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
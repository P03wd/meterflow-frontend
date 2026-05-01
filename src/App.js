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
  verifyPayment
} from "./services/api";

function App() {
  const [usage, setUsage] = useState(null);
  const [billing, setBilling] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [pokemon, setPokemon] = useState(null);
  const [name, setName] = useState("ditto");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 NEW: CONTROL TRAFFIC
  const [autoRun, setAutoRun] = useState(false);

  // 🔥 LOAD DATA
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const usageRes = await fetchUsage();
      const usageData = usageRes.data;
      setUsage(usageData);

      const billingRes = await fetchBilling();
      setBilling(billingRes.data);

      // 📈 LIVE GRAPH
      setChartData((prev) => {
        const newPoints = (usageData.recentRequests || [])
          .slice(-5)
          .map((r) => ({
            time: new Date(r.timestamp).toLocaleTimeString(),
            latency: r.latency
          }));

        const merged = [...prev, ...newPoints];

        const unique = merged.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.time === item.time)
        );

        return unique.slice(-10);
      });

    } catch (err) {
      setError(err.response?.data?.message || "Error loading data");
    } finally {
      setLoading(false);
    }
  };

  // 🔍 POKEMON (manual)
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

  // 🔄 CONTROLLED AUTO TRAFFIC
  useEffect(() => {
    loadData();

    let interval;

    if (autoRun) {
      interval = setInterval(() => {
        loadData();
        fetchPokemon("ditto"); // 🔥 generate traffic
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [autoRun]);

  return (
    <div style={{ padding: 20 }}>
      <h1>🚀 MeterFlow Dashboard</h1>

      <p><strong>API Key:</strong> {localStorage.getItem("apiKey")}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}

      {/* 🔥 CONTROL BUTTON */}
      <button onClick={() => setAutoRun(!autoRun)}>
        {autoRun ? "🛑 Stop Traffic" : "▶️ Start Traffic"}
      </button>

      {/* USAGE */}
      <div>
        <h2>Usage Stats</h2>
        <p>Total Requests: {usage?.totalRequests || 0}</p>
        <p>Avg Latency: {usage?.avgLatency || 0} ms</p>
      </div>

      {/* 📈 CHART */}
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

      {/* 💰 BILLING */}
      <div>
        <h2>💰 Billing</h2>
        <p>Total Requests: {billing?.totalRequests || 0}</p>
        <p>Total Cost: ₹{billing?.totalCost || 0}</p>
      </div>

      {/* 💳 PAYMENT */}
      <button onClick={handlePayment}>💳 Pay ₹500</button>

      {/* 🔎 POKEMON */}
      <div>
        <h2>Pokemon</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
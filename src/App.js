// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip
// } from "recharts";

// function App() {
//   const [usage, setUsage] = useState(null);
//   const [billing, setBilling] = useState(null); // ✅ NEW
//   const [chartData, setChartData] = useState([]);
//   const [pokemon, setPokemon] = useState(null);
//   const [name, setName] = useState("ditto");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const API_KEY = "03c63fce-b0d6-4040-9b17-559ab6ec247a";

//   // 🔥 YOUR JWT (IMPORTANT)
// const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZWU0NGUyZjY1MjJlNDBmYWI1MjRmNSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzc3MzE4MzE2LCJleHAiOjE3Nzc5MjMxMTZ9.-IwIO69AzKdR8DLnFZY1hH9AvpDyNFT2FdlHYa2t9bk";
//   // 🔥 FETCH USAGE
//   const fetchUsage = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/usage", {
//         headers: { "x-api-key": API_KEY }
//       });

//       setUsage(res.data);

//       const data = res.data.recentRequests.map((r) => ({
//         time: new Date(r.timestamp).toLocaleTimeString(),
//         latency: r.latency
//       }));

//       setChartData(data);

//     } catch (err) {
//       setError(err.response?.data?.message || "Error fetching usage");
//     }
//   };

//   // 🔥 FETCH BILLING (NEW)
//   const fetchBilling = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/billing/get", {
//         headers: {
//           "x-api-key": API_KEY,
//           Authorization: `Bearer ${TOKEN}`
//         }
//       });

//       setBilling(res.data);

//     } catch (err) {
//       console.log("Billing error:", err.response?.data?.message);
//     }
//   };

//   // 🔥 FETCH POKEMON
//   const fetchPokemon = async () => {
//     try {
//       setError("");

//       const res = await axios.get(
//         `http://localhost:5000/api/pokemon/${name}`,
//         {
//           headers: { "x-api-key": API_KEY }
//         }
//       );

//       setPokemon(res.data);

//     } catch (err) {
//       setError(err.response?.data?.message || "Error fetching pokemon");
//     }
//   };

//   // 🔥 AUTO REFRESH
//   useEffect(() => {
//     setLoading(true);

//     fetchUsage();
//     fetchBilling(); // ✅ ADD

//     const interval = setInterval(() => {
//       fetchUsage();
//       fetchBilling(); // ✅ ADD
//     }, 5000);

//     setLoading(false);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div style={{ padding: 20, fontFamily: "Arial" }}>
//       <h1>🚀 MeterFlow Dashboard</h1>

//       <p><strong>API Key:</strong> {API_KEY}</p>

//       {error && <p style={{ color: "red" }}>⚠️ {error}</p>}
//       {loading && <p>⏳ Loading...</p>}

//       {/* USAGE */}
//       <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 20 }}>
//         <h2>Usage Stats</h2>

//         {usage && (
//           <>
//             <p>🔥 Total Requests: {usage.totalRequests}</p>
//             <p>⚡ Avg Latency: {usage.avgLatency} ms</p>

//             <h3>Top Endpoints</h3>
//             <ul>
//               {usage.topEndpoints.map((e, i) => (
//                 <li key={i}>
//                   {e._id} → {e.count}
//                 </li>
//               ))}
//             </ul>
//           </>
//         )}
//       </div>

//       {/* 📈 CHART */}
//       <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 20 }}>
//         <h2>📈 Latency Chart</h2>

//         <LineChart width={600} height={300} data={chartData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="time" />
//           <YAxis domain={[0, "auto"]} />
//           <Tooltip />
//           <Line type="monotone" dataKey="latency" />
//         </LineChart>
//       </div>

//       {/* 💰 BILLING (NEW) */}
//       <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 20 }}>
//         <h2>💰 Billing Summary</h2>

//         {billing ? (
//           <>
//             <p>Total Requests: {billing.totalRequests}</p>
//             <p>Cost per Request: ₹{billing.costPerRequest}</p>
//             <p>Total Cost: ₹{billing.totalCost}</p>
//           </>
//         ) : (
//           <p>No billing data</p>
//         )}
//       </div>

//       {/* 🔎 POKEMON */}
//       <div style={{ border: "1px solid #ccc", padding: 10 }}>
//         <h2>Pokemon Search</h2>

//         <input value={name} onChange={(e) => setName(e.target.value)} />
//         <button onClick={fetchPokemon}>Search</button>

//         {pokemon && (
//           <div style={{ marginTop: 10 }}>
//             <h3>{pokemon.name}</h3>
//             <img src={pokemon.sprite} alt="pokemon" />
//             <p>ID: {pokemon.id}</p>
//             <p>Type: {pokemon.types.join(", ")}</p>
//             <p>Abilities: {pokemon.abilities.join(", ")}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;
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

  // 🔥 LOAD DATA
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const usageRes = await fetchUsage();
      setUsage(usageRes.data);

      const billingRes = await fetchBilling();
      setBilling(billingRes.data);

      const data = usageRes.data.recentRequests?.map((r) => ({
        time: new Date(r.timestamp).toLocaleTimeString(),
        latency: r.latency
      })) || [];

      setChartData(data);

    } catch (err) {
      setError(err.response?.data?.message || "Error loading data");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 POKEMON SEARCH
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
        key: "rzp_test_SipBngpovmEbKD", // ⚠️ replace with your real Razorpay key
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
      console.log(err);
      alert("Payment failed");
    }
  };

  // 🔄 AUTO REFRESH
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🚀 MeterFlow Dashboard</h1>

      {/* API KEY */}
      <p><strong>API Key:</strong> {API_KEY}</p>

      {/* ERROR */}
      {error && <p style={{ color: "red" }}>⚠️ {error}</p>}

      {/* LOADING */}
      {loading && <p>⏳ Loading...</p>}

      {/* USAGE */}
      <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 20 }}>
        <h2>Usage Stats</h2>

        {usage && (
          <>
            <p>🔥 Total Requests: {usage.totalRequests}</p>
            <p>⚡ Avg Latency: {usage.avgLatency} ms</p>

            <h3>Top Endpoints</h3>
            <ul>
              {usage.topEndpoints.map((e, i) => (
                <li key={i}>
                  {e._id} → {e.count}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* 📈 CHART */}
      <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 20 }}>
        <h2>📈 Latency Chart</h2>

        <LineChart width={600} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="latency" />
        </LineChart>
      </div>

      {/* 💰 BILLING */}
      <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 20 }}>
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

      {/* 💳 PAYMENT */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={handlePayment}>
          💳 Pay ₹500
        </button>
      </div>

      {/* 🔎 POKEMON */}
      <div style={{ border: "1px solid #ccc", padding: 10 }}>
        <h2>Pokemon Search</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button onClick={searchPokemon}>Search</button>

        {pokemon && (
          <div style={{ marginTop: 10 }}>
            <h3>{pokemon.name}</h3>
            <img src={pokemon.sprite} alt="pokemon" />
            <p>ID: {pokemon.id}</p>
            <p>Type: {pokemon.types.join(", ")}</p>
            <p>Abilities: {pokemon.abilities.join(", ")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
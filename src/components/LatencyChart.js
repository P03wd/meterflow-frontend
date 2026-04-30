import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

const LatencyChart = ({ data }) => {
  return (
    <div style={{
      padding: 20,
      borderRadius: 10,
      background: "#e3f2fd",
      marginTop: 20
    }}>
      <h2>📈 Latency Chart</h2>

      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis domain={[0, "auto"]} />
        <Tooltip />
        <Line type="monotone" dataKey="latency" />
      </LineChart>
    </div>
  );
};

export default LatencyChart;
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface WorkoutChartProps {
  logs: {
    name: string;
    duration: number;
  }[];
}

export default function WorkoutChart({ logs }: WorkoutChartProps) {
  const data = {
    labels: logs.map((log) => log.name),
    datasets: [
      {
        label: "Duration (min)",
        data: logs.map((log) => log.duration),
        backgroundColor: "rgba(33, 128, 141, 0.6)",
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="card">
      <div className="card__body">
        <h3>📊 Workout Chart</h3>
        <Bar data={data} />
      </div>
    </div>
  );
}

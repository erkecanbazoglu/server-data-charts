import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface LineChartProps {
  title: string;
  regions: string[];
  onlineData: number[];
  activeConnectionsData: number[];
  workersData: number[];
}

const LineChart: React.FC<LineChartProps> = ({
  title,
  regions,
  onlineData,
  activeConnectionsData,
  workersData,
}) => {
  const options = {
    chart: {
      type: "line",
      height: 350,
    },
    xaxis: {
      categories: regions,
    },
    title: {
      text: title,
    },
  } as ApexOptions;

  const series = [
    {
      name: "Online Users",
      data: onlineData,
    },
    {
      name: "Active Connections",
      data: activeConnectionsData,
    },
    {
      name: "Total Workers",
      data: workersData,
    },
  ];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="line"
      height={350}
    />
  );
};

export default LineChart;

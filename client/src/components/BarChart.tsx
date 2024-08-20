import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface BarChartProps {
  title: string;
  regions: string[];
  cpuLoadData: number[];
}

const BarChart: React.FC<BarChartProps> = ({ title, regions, cpuLoadData }) => {
  const options = {
    chart: {
      type: "bar",
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
      name: "CPU Load",
      data: cpuLoadData,
    },
  ];

  return (
    <ReactApexChart options={options} series={series} type="bar" height={350} />
  );
};

export default BarChart;

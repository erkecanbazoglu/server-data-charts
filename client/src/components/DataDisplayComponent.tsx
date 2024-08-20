// src/components/DataDisplayComponent.tsx
import React, { useCallback, useEffect, useState } from "react";
import { getData } from "../services/apiService";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import { dataParser } from "../parsers/dataParser";
import { io, Socket } from "socket.io-client";

const initialState = {
  data: [],
  loading: true,
  socket: null,
  regions: [],
  onlineData: [],
  activeConnectionsData: [],
  workersData: [],
  cpuLoadData: [],
  uniqueRegions: [],
  averageOnlineData: [],
  averageActiveConnectionsData: [],
  averageWorkersData: [],
  averageCpuLoadData: [],
};

interface DataDisplayComponentState {
  data: any[];
  loading: boolean;
  socket: Socket | null;
  regions: string[];
  onlineData: number[];
  activeConnectionsData: number[];
  workersData: number[];
  cpuLoadData: number[];
  uniqueRegions: string[];
  averageOnlineData: number[];
  averageActiveConnectionsData: number[];
  averageWorkersData: number[];
  averageCpuLoadData: number[];
}

const DataDisplayComponent: React.FC = () => {
  const [state, setState] = useState<DataDisplayComponentState>(initialState);

  const fetchData = useCallback(async () => {
    const response = await getData();
    const parsedData = dataParser.parseData(response);

    setState((prevState) => ({
      ...prevState,
      ...parsedData,
      data: response,
      loading: false,
    }));
  }, []);

  useEffect(() => {
    const socket = io(`http://localhost:${import.meta.env.VITE_SERVER_PORT}`);
    setState((prevState) => ({
      ...prevState,
      socket,
    }));

    socket.on("connect", () => {
      console.log("Connected to the server");
    });

    fetchData();

    // Listen for data updates from the WebSocket server
    socket.on("dataUpdate", (newData) => {
      const combinedData = [...state.data, ...newData];
      const filteredData = dataParser.removeDataOlderThanOneWeek(combinedData);
      const parsedData = dataParser.parseData(filteredData);

      setState((prevState) => ({
        ...prevState,
        ...parsedData,
        data: filteredData,
        loading: false,
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  console.log(state.data);

  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);

  return (
    <div>
      {state.loading && <p>Loading...</p>}

      {!state.loading && (
        <LineChart
          title={
            "Average Online Users, Active Connections, and Workers by Region"
          }
          regions={state.uniqueRegions}
          onlineData={state.averageOnlineData}
          activeConnectionsData={state.averageActiveConnectionsData}
          workersData={state.averageWorkersData}
        />
      )}
      {!state.loading && (
        <BarChart
          title={"Average CPU Load by Region"}
          regions={state.uniqueRegions}
          cpuLoadData={state.averageCpuLoadData}
        />
      )}

      {!state.loading && (
        <LineChart
          title={"Online Users, Active Connections, and Workers by Region"}
          regions={state.regions}
          onlineData={state.onlineData}
          activeConnectionsData={state.activeConnectionsData}
          workersData={state.workersData}
        />
      )}
      {!state.loading && (
        <BarChart
          title={"CPU Load by Region"}
          regions={state.regions}
          cpuLoadData={state.cpuLoadData}
        />
      )}
    </div>
  );
};

export default DataDisplayComponent;

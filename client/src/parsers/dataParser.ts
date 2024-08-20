// Constants
const MAX_ENTRIES = 30;

class DataParser {
  removeDataOlderThanOneWeek(data: any) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return data.filter((entry: any) => new Date(entry.timestamp) >= oneWeekAgo);
  }

  parseData(data: any) {
    const regions: string[] = [];
    const onlineData: number[] = [];
    const activeConnectionsData: number[] = [];
    const workersData: number[] = [];
    const cpuLoadData: number[] = [];

    const maxBackwardEntries = Math.min(MAX_ENTRIES, data.length);

    // Get regions, online users, active connections, and workers data
    for (let i = data.length - maxBackwardEntries; i < data.length; i++) {
      const entry = data[i];

      regions.push(entry.region);
      onlineData.push(entry.data.results.stats.online);
      activeConnectionsData.push(
        entry.data.results.stats.server.active_connections
      );
      workersData.push(
        entry.data.results.stats.server.workers.reduce(
          (acc: number, worker: { workers: number }[]) =>
            acc + worker[1].workers,
          0
        )
      );
      cpuLoadData.push(entry.data.results.stats.server.cpu_load);
    }

    const uniqueRegions = [...new Set(regions)];
    const averageOnlineData: number[] = [];
    const averageActiveConnectionsData: number[] = [];
    const averageWorkersData: number[] = [];
    const averageCpuLoadData: number[] = [];

    // Calculate average values for each region
    uniqueRegions.forEach((region) => {
      const regionData = data.filter((entry: any) => entry.region === region);
      const totalOnline = regionData.reduce(
        (acc: number, entry: any) => acc + entry.data.results.stats.online,
        0
      );
      const totalActiveConnections = regionData.reduce(
        (acc: number, entry: any) =>
          acc + entry.data.results.stats.server.active_connections,
        0
      );
      const totalWorkers = regionData.reduce(
        (acc: number, entry: any) =>
          acc +
          entry.data.results.stats.server.workers.reduce(
            (acc: number, worker: { workers: number }[]) =>
              acc + worker[1].workers,
            0
          ),
        0
      );
      const totalCpuLoad = regionData.reduce(
        (acc: number, entry: any) =>
          acc + entry.data.results.stats.server.cpu_load,
        0
      );

      averageOnlineData.push(
        Number((totalOnline / regionData.length).toFixed(2))
      );
      averageActiveConnectionsData.push(
        Number((totalActiveConnections / regionData.length).toFixed(2))
      );
      averageWorkersData.push(
        Number((totalWorkers / regionData.length).toFixed(2))
      );
      averageCpuLoadData.push(
        Math.round((totalCpuLoad / regionData.length) * 100) / 100
      );
    });

    return {
      regions,
      onlineData,
      activeConnectionsData,
      workersData,
      cpuLoadData,
      uniqueRegions,
      averageOnlineData,
      averageActiveConnectionsData,
      averageWorkersData,
      averageCpuLoadData,
    };
  }
}

export const dataParser = new DataParser();

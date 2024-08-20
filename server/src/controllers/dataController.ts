import { Request, Response } from "express";
import { getDB } from "../config/db.js";

export const getData = (req: Request, res: Response) => {
  const db = getDB();
  const region = req.query.region as string;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  if (region) {
    // Return data for the specific region and within the last week
    const regionData = db.data!.data.filter(
      (entry) =>
        entry.region === region && new Date(entry.timestamp) >= oneWeekAgo
    );
    res.json(regionData);
  } else {
    // Return all data within the last week
    const filteredData = db.data!.data.filter(
      (entry) => new Date(entry.timestamp) >= oneWeekAgo
    );
    res.json(filteredData);
  }
};

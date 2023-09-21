import { NextFunction, Request, Response } from "express";
import fs from "fs-extra";

export default function folderExists(folderName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    fs.ensureDir(folderName, (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to create folder" });
      }

      next();
    });
  };
}

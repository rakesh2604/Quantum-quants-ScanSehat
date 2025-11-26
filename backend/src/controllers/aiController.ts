import { Request, Response } from "express";
import { runOCR } from "../services/ocrService";
import { summarizeText } from "../services/openaiService";
import { buildEmbedding } from "../services/embeddingService";

export const aiOCR = async (req: Request, res: Response) => {
  const { fileUrl } = req.body;
  if (!fileUrl) {
    return res.status(400).json({ message: "fileUrl is required" });
  }
  const text = await runOCR(fileUrl);
  res.json({ text });
};

export const aiSummary = async (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "text is required" });
  }
  const summary = await summarizeText(text);
  res.json({ summary });
};

export const aiEmbedding = async (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "text is required" });
  }
  const embedding = await buildEmbedding(text);
  res.json({ embedding });
};

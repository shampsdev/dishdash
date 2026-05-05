import axios from "axios";
import { WHISPER_API_KEY } from "src/config";
import logger from "src/utils/logger";

interface TranscriptionResponse {
  delayTime: number;
  executionTime: number;
  id: string;
  output: {
    detected_language: string;
    device: string;
    model: string;
    segments: Segment[];
    transcription: string;
    translation: string | null;
  };
  status: string;
  workerId: string;
}

interface Segment {
  avg_logprob: number;
  compression_ratio: number;
  end: number;
  id: number;
  no_speech_prob: number;
  seek: number;
  start: number;
  temperature: number;
  text: string;
  tokens: number[];
}

// TODO: clean this up for god's sake

export const transcribe = async (audioUrl: string) => {
  logger.info("Sent file for transcription");
  const res = await axios.post<TranscriptionResponse>(
    "https://api.runpod.ai/v2/4dqdvavjtku7de/runsync",
    {
      input: {
        audio: audioUrl,
      },
    },
    {
      headers: {
        Authorization: "Bearer " + WHISPER_API_KEY,
      },
    },
  );

  return res.data;
};

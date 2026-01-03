
export interface ImageData {
  data: string; // base64
  mimeType: string;
}

export interface ProcessingResult {
  imageUrl: string;
  width: number;
  height: number;
}

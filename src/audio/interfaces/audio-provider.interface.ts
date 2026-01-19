export interface AudioProvider {
  generateSpeech(text: string): Promise<Buffer>;
}

export const AUDIO_PROVIDER = 'AUDIO_PROVIDER';

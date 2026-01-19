export interface AudioProvider {
    generateSpeech(text: string): Promise<Buffer>;
}
export declare const AUDIO_PROVIDER = "AUDIO_PROVIDER";

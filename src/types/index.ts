// TypeScript 타입 정의
export type AnalysisType = 'text' | 'audio' | 'video' | 'image';

export interface AnalysisResult {
    type: AnalysisType;
    result: 'real' | 'fake';
    confidence: number;
    details?: any;
    timestamp: Date;
}

export interface UploadFile {
    file: File;
    preview?: string;
}
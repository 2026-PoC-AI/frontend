// src/features/image/mock/imageMockResult.js
export function createMockImageResult({ analysisId, file }) {
  // UI 시각화를 위한 mock breakdown (나중에 실제 AI 결과로 대체)
  const breakdown = {
    faceConsistency: 78,
    textureAnomaly: 86,
    lightingMismatch: 82,
  };

  const riskScore = Math.round(
    (breakdown.faceConsistency + breakdown.textureAnomaly + breakdown.lightingMismatch) / 3
  );

  const riskLevel = riskScore >= 70 ? "HIGH" : riskScore >= 40 ? "MEDIUM" : "LOW";
  const label = riskScore >= 50 ? "FAKE" : "REAL";
  const confidence = Math.min(0.99, Math.max(0.01, riskScore / 100));

  return {
    job: {
      jobUuid: analysisId,
      status: "COMPLETED",
      createdAt: new Date().toISOString(),
    },
    input: {
      filename: file?.name ?? "unknown.png",
      s3Key: "image/inputs/mock.png",
      mimeType: file?.type ?? "image/png",
      fileSize: file?.size ?? 0,
    },
    results: [
      {
        taskType: "deepfake_image",
        label,
        confidence,
        riskScore,
        riskLevel,
        interpretation:
          riskLevel === "HIGH"
            ? "AI-generated 가능성이 높습니다. 얼굴/텍스처/조명 일관성에서 비정상 패턴이 감지되었습니다."
            : riskLevel === "MEDIUM"
              ? "의심 신호가 일부 감지되었습니다. 추가 검증을 권장합니다."
              : "뚜렷한 조작 신호가 낮습니다. 다만 단일 모델 결과이므로 참고용입니다.",
        evidence: [
          "Facial texture inconsistency",
          "Unnatural lighting-shadow relationship",
          "Edge blending artifacts around face contour",
        ],
        warnings: [],
        breakdown, 
      },
    ],
  };
}

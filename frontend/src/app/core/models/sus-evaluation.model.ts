export interface SusAnswers {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
  q9: number;
  q10: number;
}

export interface CreateSusEvaluationPayload extends SusAnswers {
  respondentName?: string;
  applicationId?: string;
}

export interface SusStats {
  count: number;
  averageScore: number;
  interpretation: string;
}

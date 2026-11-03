import { ModelWeights, RiskFactor, RiskLevel, Student, SubjectScore } from '@/types';

export const DEFAULT_WEIGHTS: ModelWeights = {
  previousScoreWeight: 0.40,
  attendanceWeight: 0.20,
  assignmentWeight: 0.15,
  assessmentWeight: 0.15,
  quizWeight: 0.10,
  highRiskThreshold: 55,
  mediumRiskThreshold: 75,
};

export interface PredictionInput {
  attendance: number;
  previousScore: number;
  assignmentCompletion: number;
  quizScore: number;
  assessmentScore: number;
  subjects?: SubjectScore[];
}

export interface PredictionResult {
  predictedScore: number;
  riskLevel: RiskLevel;
  confidence: number;
  riskFactors: RiskFactor[];
  recommendations: string[];
  breakdown: {
    previousScoreContribution: number;
    attendanceContribution: number;
    assignmentContribution: number;
    assessmentContribution: number;
    quizContribution: number;
  };
}

export function calculatePrediction(
  input: PredictionInput,
  customWeights: ModelWeights = DEFAULT_WEIGHTS
): PredictionResult {
  const {
    previousScoreWeight,
    attendanceWeight,
    assignmentWeight,
    assessmentWeight,
    quizWeight,
    highRiskThreshold,
    mediumRiskThreshold,
  } = customWeights;

  const previousScoreContribution = input.previousScore * previousScoreWeight;
  const attendanceContribution = input.attendance * attendanceWeight;
  const assignmentContribution = input.assignmentCompletion * assignmentWeight;
  const assessmentContribution = input.assessmentScore * assessmentWeight;
  const quizContribution = input.quizScore * quizWeight;

  const rawScore =
    previousScoreContribution +
    attendanceContribution +
    assignmentContribution +
    assessmentContribution +
    quizContribution;

  const predictedScore = Math.min(100, Math.max(0, Math.round(rawScore * 10) / 10));

  let riskLevel: RiskLevel = 'LOW';
  if (predictedScore < highRiskThreshold) {
    riskLevel = 'HIGH';
  } else if (predictedScore < mediumRiskThreshold) {
    riskLevel = 'MEDIUM';
  }

  // Calculate dynamic confidence score (80% - 95%) based on input consistency
  const variance = Math.abs(input.attendance - input.previousScore) + Math.abs(input.assessmentScore - input.previousScore);
  const confidence = Math.min(95, Math.max(80, Math.round(92 - variance * 0.15)));

  // Dynamic Risk Factors Generation
  const riskFactors: RiskFactor[] = [];

  if (input.attendance < 75) {
    riskFactors.push({
      factor: 'Low Attendance',
      impact: 'HIGH IMPACT',
      description: `Attendance at ${input.attendance}% is below institutional threshold of 75%.`,
    });
  }

  if (input.assessmentScore < 60) {
    riskFactors.push({
      factor: 'Declining Assessment Marks',
      impact: 'HIGH IMPACT',
      description: `Recent internal assessment score is ${input.assessmentScore}%, indicating subject mastery gaps.`,
    });
  }

  if (input.assignmentCompletion < 70) {
    riskFactors.push({
      factor: 'Incomplete Assignments',
      impact: 'MEDIUM IMPACT',
      description: `Only ${input.assignmentCompletion}% of assignments submitted on time.`,
    });
  }

  if (input.quizScore < 65) {
    riskFactors.push({
      factor: 'Low Continuous Quiz Score',
      impact: 'LOW IMPACT',
      description: `Quiz performance averages ${input.quizScore}%, reflecting weak continuous revision.`,
    });
  }

  // Weakest subject check
  if (input.subjects && input.subjects.length > 0) {
    const weakest = [...input.subjects].sort((a, b) => a.score - b.score)[0];
    if (weakest.score < 65) {
      riskFactors.push({
        factor: `${weakest.name} Score Lagging`,
        impact: 'MEDIUM IMPACT',
        description: `Subject score in ${weakest.name} is ${weakest.score}%, requires dedicated focus.`,
      });
    }
  } else if (predictedScore < 65) {
    riskFactors.push({
      factor: 'Mathematics & Core Concept Weakness',
      impact: 'MEDIUM IMPACT',
      description: 'Core quantitative and logical subject scores are dropping.',
    });
  }

  // Dynamic Recommendations
  const recommendations: string[] = [];

  if (input.attendance < 75) {
    recommendations.push('Schedule urgent mentor discussion & attendance counseling session.');
  }

  if (input.subjects && input.subjects.some((s) => s.score < 60)) {
    const weakSub = input.subjects.find((s) => s.score < 60)?.name || 'Mathematics';
    recommendations.push(`Assign remedial ${weakSub} problem sets and pair with top-performing peer mentor.`);
  } else {
    recommendations.push('Practice Mathematics and logical reasoning modules for 30 minutes daily.');
  }

  if (input.assignmentCompletion < 75) {
    recommendations.push('Complete pending lab reports and assignment backlogs under TA supervision.');
  }

  recommendations.push('Maintain attendance above 85% to ensure exam eligibility.');
  recommendations.push('Attempt daily recommended 10-minute diagnostic micro-quizzes on Kalvikkan AI.');

  return {
    predictedScore,
    riskLevel,
    confidence,
    riskFactors,
    recommendations,
    breakdown: {
      previousScoreContribution: Math.round(previousScoreContribution * 10) / 10,
      attendanceContribution: Math.round(attendanceContribution * 10) / 10,
      assignmentContribution: Math.round(assignmentContribution * 10) / 10,
      assessmentContribution: Math.round(assessmentContribution * 10) / 10,
      quizContribution: Math.round(quizContribution * 10) / 10,
    },
  };
}

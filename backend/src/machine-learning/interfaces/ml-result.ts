interface MLResult {
    algorithmName: string;
    prediction: any;
    scores: AlgorithmScores;
    error?: string;
}

interface AlgorithmScores {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1Score?: number;
    auc?: number;
    confusionMatrix?: number
    featureImportance?: number[];
}
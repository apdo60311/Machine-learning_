import { Injectable, Logger } from '@nestjs/common';
import { UploadDataDto } from './dto/create-machine-learning.dto';


interface IPreprocessedColumnRessult {
  numericalColumns: string[];
  categoricalColumns: string[];
  uniqueValues: { [key: string]: any[] };
  statistics: { [key: string]: { mean: number; std: number } };
}

interface IColumnStatistics { mean: number; std: number; }

interface IPreprocessedLabelRessults {
  classificationType: string,
  labels: any[],
  data: any[],
}

@Injectable()
export class MachineLearningService {
  private readonly algorithms = [
    'logisticRegression',
    'decisionTree',
    'knn',
    'svm',
    'randomForest'
  ];
  private readonly logger = new Logger(MachineLearningService.name);
  async applyML(uploadedData: UploadDataDto) {


    try {
      if (!uploadedData || !uploadedData.file) {
        throw new Error('Data cannot be empty');
      }


      const file = uploadedData.file;
      const results: MLResult[] = [];

      const processedData = await this._preprocessData(file);

      const algoPromises = this.algorithms.map(algo => {
        return this.applyAlgorithm(algo, file);
      });


      const algoResults = await Promise.allSettled(algoPromises);


      algoResults.forEach((algoResult, index) => {
        if (algoResult.status === 'fulfilled') {
          // results.push(algoResult.value) 
        } else {
          this.logger.error(`Algorithm ${this.algorithms[index]} failed: ${algoResult.reason}`);
        }
      });


      return results;
    } catch (error) {
      this.logger.error(`Error during Applying ML: ${error}`);
      return error;
    }
  }
  /**
   * Data preprocessing 
   * @description This function performs data preprocessing operations suchas data cleaning and normalization.
   *
   * `Steps`:
   * 
   * 1. `Preprocess columns:`
   * 2. `Clean data:`
   * 3. `Extract label column:`
   * 
   *
   * @param data - The parsed csv file (json)
   */
  private async _preprocessData(data: any) {

    const headerRow = data[0];
    const dataRows = data.slice(1);

    const processColumnsRes: IPreprocessedColumnRessult = this._preprocessColumns(headerRow, dataRows);
    const cleanedDataRows = this._cleanData(dataRows);

    const labelColumn = this._getLabelColumn(headerRow);
    const labelColumnIndex = headerRow.indexOf(labelColumn);
    const { data: processedData, classificationType }: IPreprocessedLabelRessults = this._processLabelColumn(labelColumnIndex, cleanedDataRows);



    this._processRows(processedData, processColumnsRes, labelColumn);


  }
  private _processRows(dataRows: any[], processColumnsRes: IPreprocessedColumnRessult, labelColumn: any) {

    const processedDataRows = dataRows.map((row: any[]) => {
      row.forEach((value, index) => {
        const columnName = processColumnsRes.numericalColumns[index];

        if (columnName !== labelColumn) {

          if (processColumnsRes.numericalColumns.includes(columnName)) {
            const parsedVal = Number(value);
            if (!isNaN(parsedVal)) return;

            const stats = processColumnsRes.statistics[columnName];
            return (parsedVal - stats.mean) / stats.std;
          }

          if (processColumnsRes.categoricalColumns.includes(columnName)) {
            const uniqueValues = processColumnsRes.uniqueValues[columnName];
            return uniqueValues.indexOf(value) / uniqueValues.length;
          }
        }
      });
    });

    return processedDataRows;

  }


  /**
   * Preprocess columns
   * @param headerRow - list of columns names
   * @param dataRows 
   * @description prepare columns for applying machine learning algorithms 
   * 1. `Remove  duplicate rows:` - Remove duplicate rows from the data
   * 2. `Remove null values:` - Remove rows with null values 
   * 3. `Identify columns:` - Identify numerical and categorical columns
   * 4. `Calculate statistics:` - Calculate mean and standard deviation for numerical columns
   * @return `IPreprocessedColumnRessult`
   */
  private _preprocessColumns(headerRow: string[], dataRows: any[]): IPreprocessedColumnRessult {
    const numericalColumns: string[] = [];
    const categoricalColumns: string[] = [];
    const uniqueValues: { [key: string]: any[] } = {};
    const statistics: { [key: string]: { mean: number; std: number } } = {};


    headerRow.forEach((column, index) => {

      const columnValues = dataRows.map(row => row[index]);
      const colUniqueValues = Array.from(new Set(columnValues));
      uniqueValues[column] = colUniqueValues;

      const isNumeric = colUniqueValues.every(value => !isNaN(Number(value)) && value !== '' && value !== null);

      if (isNumeric) {
        numericalColumns.push(column);
        const numbericColumns = columnValues.map(value => Number(value));
        statistics[column] = this._calculateColumnStatistics(numbericColumns);
      } else {
        categoricalColumns.push(column);
      }

    });

    return {
      numericalColumns,
      categoricalColumns,
      uniqueValues,
      statistics,
    };

  }
  /**
   * Calculate the mean and standard deviation of a column
   * @param numbericColumns
   * @returns `IColumnStatistics`
   */
  private _calculateColumnStatistics(numbericColumns: number[]): IColumnStatistics {

    const mean = numbericColumns.reduce((a, b) => a + b, 0) / numbericColumns.length;

    const std = Math.sqrt(numbericColumns.map(value => Math.pow(value - mean, 2)).reduce((a, b) => a + b, 0) / numbericColumns.length);

    return {
      mean,
      std
    };
  }

  /**
   * Find the target column from the header row (list of columns names)
   * @default return headerRow[headerRow.length - 1] - incase no label is found
   * @param headerRow 
   * @returns 
   */
  private _getLabelColumn(headerRow: any[]) {
    const defaultLabels = ['label', 'target', 'class'];
    const labelColumn = headerRow.find(column => defaultLabels.includes(column.toLowerCase()));
    return labelColumn ?? headerRow[headerRow.length - 1];
  }


  private _cleanData(dataRows: any[]): any[] {
    const filteredDataRows = dataRows.filter(row => row.every(value => value !== null && value !== ''));
    const uniqueDataRows = Array.from(new Set(filteredDataRows.map(row => row.join(',')))).map(row => row.split(','));

    return uniqueDataRows;
  }


  /**
   * Process the label column
   * @param labelColumnIndex
   * @param data
   * @description
   * 1. `Convert labels to numerical values:` - Convert labels to numerical values
   * 2. `Classification type:` - Determine classification type
   * @returns `IPreprocessedRowRessults`
   */
  private _processLabelColumn(labelColumnIndex: number, data: any[]): IPreprocessedLabelRessults {
    try {
      const labelValues = data.map(row => row[labelColumnIndex]);

      const uniqueLabels = Array.from(new Set(labelValues));


      data.forEach(row => {
        row[labelColumnIndex] = uniqueLabels.indexOf(row[labelColumnIndex]);
      });

      const classificationType = this._determineClassificationType(uniqueLabels);



      return {
        classificationType,
        labels: uniqueLabels,
        data
      }

    } catch (error) {
      this.logger.error(`Error while processing label column: ${error}`);
      return null;
    }
  }

  private _determineClassificationType(uniqueLabels: any[]) {
    if (uniqueLabels.length === 2) {
      return 'binary';
    } else if (uniqueLabels.length > 2 && uniqueLabels.length <= 10) {
      return 'multiclass';
    } else {
      return 'regression';
    }
  }

  downloadReport() {
    return `This action returns all machineLearning`;
  }

  applyAlgorithm(algo: string, file: any) {
    // 
  }

}

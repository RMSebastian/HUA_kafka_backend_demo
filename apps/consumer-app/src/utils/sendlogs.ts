import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { LogEntryDto } from '../dto/log.dto';

export class LoggingSenderService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Sends a log entry to the logging service
   * @param logEntry The log entry data
   * @returns Promise with the response from the logging service
   */
  public sendLog(logEntry: LogEntryDto): void {
    try {
      this.axiosInstance.post('/registration/save-data', logEntry);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error sending log:', error.message);
        throw new Error(`Failed to send log: ${error.message}`);
      } else {
        console.error('Unexpected error sending log:', error);
        throw new Error('Failed to send log due to unexpected error');
      }
    }
  }
}

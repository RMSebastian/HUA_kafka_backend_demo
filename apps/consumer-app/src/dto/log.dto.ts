export interface LogEntryDto {
  level: string;
  message: string;
  application: string;
  serviceVersion: string;
  environment: string;
  host: string;
  timestamp: string;
}

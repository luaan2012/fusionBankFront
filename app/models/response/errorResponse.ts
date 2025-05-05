export interface ErrorApi {
  message: string,
  levelError: LevelError
}

export enum LevelError {
  low = 1,
  medium,
  high
}

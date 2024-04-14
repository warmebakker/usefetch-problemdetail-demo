
export interface ProblemDetailsRfc7807 {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  errors: Record<string, string[]>;
}

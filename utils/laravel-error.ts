import type { FormError } from '#ui/types/form';

export default class LaravelError extends Error {
  public message: string;
  public violations: Record<string, string[]> | null | undefined;

  constructor(data: { message: string; errors: Record<string, string[]> }) {
    super(data.message);

    this.message = data.message;
    this.violations = data.errors;
  }

  public toJSON() {
    return { message: this.message, violations: this.violations ?? [] };
  }

  public override toString(): string {
    return this.message;
  }

  public toFormErrors(): FormError[] {
    if (!this.violations) {
      return [];
    }

    return Object.entries(this.violations).map(([key, value]) => {
      return { path: key, message: value[0] };
    });
  }
}

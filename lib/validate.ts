import { AUDIENCES } from './schema';

export type ValidationIssue = {
  file: string;
  message: string;
};

export type ValidationResult = {
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
};

const audienceSet = new Set<string>(AUDIENCES);

export function validateFrontmatter(
  file: string,
  data: Record<string, unknown>,
  options: { minSources: number; allowZeroSources?: boolean }
): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  const sources = Array.isArray(data.sources) ? data.sources : [];
  const audiences = Array.isArray(data.audiences) ? data.audiences : [];

  if (audiences.length === 0) {
    errors.push({ file, message: 'audiences is required.' });
  } else {
    const invalid = audiences.filter((aud) => !audienceSet.has(String(aud)));
    if (invalid.length > 0) {
      errors.push({ file, message: `invalid audiences: ${invalid.join(', ')}` });
    }
  }

  if (sources.length < options.minSources) {
    if (options.allowZeroSources) {
      warnings.push({
        file,
        message: `sources has ${sources.length}. recommended >= ${options.minSources}.`
      });
    } else {
      errors.push({
        file,
        message: `sources has ${sources.length}. required >= ${options.minSources}.`
      });
    }
  }

  return { errors, warnings };
}

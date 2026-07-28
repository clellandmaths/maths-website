// Formulae lists — the reference sheet issued with each exam paper.
//
// Higher Applications is the exception: it gets a year-specific data booklet
// instead (tax bands, R commands), handled by DataBookletModal.
//
// Loaded with import() so a sheet only reaches the browser when someone opens
// or prints one.

export interface FormulaeSection {
  title: string;
  /** HTML with $...$ maths — render with renderMathHtml. */
  content: string;
}

export interface FormulaeList {
  title: string;
  sections: FormulaeSection[];
}

const loaders: Record<string, () => Promise<FormulaeList>> = {
  n5: () => import('@/src/n5/formulae').then(m => m.n5MathsFormulaeList as FormulaeList),
  higher: () => import('@/src/higher/formulae').then(m => m.higherMathsFormulaeList as FormulaeList),
  ah: () => import('@/src/ah/formulae').then(m => m.advancedHigherMathsFormulaeList as FormulaeList),
  'n5-apps': () => import('@/src/n5apps/formulae').then(m => m.n5ApplicationsMathsFormulaeList as FormulaeList),
};

export function hasFormulae(courseId: string): boolean {
  return courseId in loaders;
}

export async function getFormulae(courseId: string): Promise<FormulaeList | null> {
  const load = loaders[courseId];
  if (!load) return null;
  try {
    return await load();
  } catch {
    return null;
  }
}

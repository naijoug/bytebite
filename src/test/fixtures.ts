import type { Idiom, Language } from '../types';

export function createTestIdiom(overrides: Partial<Idiom> = {}): Idiom {
  return {
    id: 'map-transform',
    title: 'Map transform',
    description: 'Transform each item in a collection.',
    category: 'Collection',
    difficulty: 'beginner',
    paradigms: ['Functional'],
    implementations: [
      {
        languageId: 'typescript',
        code: 'items.map(fn)',
        explanation: 'Maps over each item.',
      },
    ],
    tags: ['array', 'map'],
    ...overrides,
  };
}

export function createTestLanguage(
  overrides: Partial<Language> = {}
): Language {
  return {
    id: 'typescript',
    name: 'TypeScript',
    version: '5.x',
    paradigms: ['Object-Oriented', 'Functional'],
    typeSystem: 'static',
    description: 'Typed JavaScript for scalable applications.',
    features: ['Structural typing', 'Type inference'],
    officialDocs: 'https://www.typescriptlang.org/docs/',
    ...overrides,
  };
}

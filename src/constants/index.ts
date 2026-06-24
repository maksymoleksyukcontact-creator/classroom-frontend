export const DEPARTMENTS = [
    'CS', 'Math', 'English'
];

export const DEPARTMENTS_OPTIONS = DEPARTMENTS.map((dept) => (
    {
        value: dept.toLowerCase(),
        label: dept
    }
))

export * from './subjects-data';
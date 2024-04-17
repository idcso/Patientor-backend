import {
  Gender,
  NewPatientEntry,
  Entry,
  DiagnosisEntry,
  healthCheckRating,
  NewBaseEntry,
  EntryWithoutId,
} from './types';

const isString = (param: unknown): param is string => {
  return typeof param === 'string' || param instanceof String;
};

const isNumber = (param: unknown): param is number => {
  return typeof param === 'number';
};

const parseString = (value: unknown): string => {
  if (!value || !isString(value)) {
    throw new Error('Incorrect or missing string value');
  }

  return value;
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name');
  }

  return name;
};

const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error('Incorrect or missing ssn');
  }

  return ssn;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Incorrect or missing occupation');
  }

  return occupation;
};

const isDate = (param: string): boolean => {
  return Boolean(Date.parse(param));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date of birth');
  }

  return date;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or missing gender');
  }

  return gender;
};

const isEntry = (param: object): boolean => {
  if ('type' in param) {
    return Boolean(
      param.type === 'HealthCheck' || 'OccupationalHealthcare' || 'Hospital'
    );
  } else return false;
};

const parseEntries = (entries: unknown): Entry[] => {
  if (!entries || !Array.isArray(entries)) {
    throw new Error('Incorrect or missing entry');
  }

  const parsedEntries = entries.map((entry) => {
    if (!isEntry) throw new Error('Incorrect or missing entry');
    return entry as Entry;
  });

  return parsedEntries;
};

const parseDiagnosisCodes = (
  object: unknown
): Array<DiagnosisEntry['code']> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<DiagnosisEntry['code']>;
  }

  return object.diagnosisCodes as Array<DiagnosisEntry['code']>;
};

const isHealthCheckRating = (param: number): param is healthCheckRating => {
  return Object.values(healthCheckRating).includes(param);
};

const parseHealthCheckRating = (rating: unknown): healthCheckRating => {
  if (!isNumber(rating) || !isHealthCheckRating(rating)) {
    throw new Error('Incorrect or missing health check rating');
  }

  return rating;
};

const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (
    'name' in object &&
    'dateOfBirth' in object &&
    'ssn' in object &&
    'gender' in object &&
    'occupation' in object &&
    'entries' in object
  ) {
    const newEntry: NewPatientEntry = {
      name: parseName(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseSsn(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      entries: parseEntries(object.entries),
    };

    return newEntry;
  }

  throw new Error('Incorrect data: some fields are missing');
};

export const toNewHealthEntry = (object: unknown): EntryWithoutId => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (
    'description' in object &&
    'date' in object &&
    'specialist' in object &&
    'type' in object
  ) {
    const newHealthEntry: NewBaseEntry = {
      description: parseString(object.description),
      date: parseDate(object.date),
      specialist: parseString(object.specialist),
    };

    if ('diagnosisCodes' in object) {
      newHealthEntry.diagnosisCodes = parseDiagnosisCodes(object);
    }

    switch (object.type) {
      case 'HealthCheck':
        if ('healthCheckRating' in object) {
          const newHealthCheckEntry: EntryWithoutId = {
            ...newHealthEntry,
            type: object.type,
            healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
          };
          return newHealthCheckEntry;
        }
        throw new Error('Incorrect or missing HealthCheck entry data');
      case 'OccupationalHealthcare':
        if ('employerName' in object) {
          const newOccupationalHealthcareEntry: EntryWithoutId = {
            ...newHealthEntry,
            type: object.type,
            employerName: parseString(object.employerName),
          };

          if (
            'sickLeave' in object &&
            object.sickLeave &&
            typeof object.sickLeave === 'object' &&
            'startDate' in object.sickLeave &&
            'endDate' in object.sickLeave
          ) {
            newOccupationalHealthcareEntry.sickLeave = {
              startDate: parseString(object.sickLeave.startDate),
              endDate: parseString(object.sickLeave.endDate),
            };
          }
          return newOccupationalHealthcareEntry;
        }
        throw new Error(
          'Incorrect or missing OccupationalHealthcare entry data'
        );
      case 'Hospital':
        if (
          'discharge' in object &&
          object.discharge &&
          typeof object.discharge === 'object' &&
          'date' in object.discharge &&
          'criteria' in object.discharge
        ) {
          const newHospitalEntry: EntryWithoutId = {
            ...newHealthEntry,
            type: object.type,
            discharge: {
              date: parseString(object.discharge.date),
              criteria: parseString(object.discharge.criteria),
            },
          };
          return newHospitalEntry;
        }
        throw new Error('Incorrect or missing Hospital data');
      default:
        throw new Error('Incorrect or missing type of the entry data');
    }
  }

  throw new Error('Incorrect or missing data');
};

export default toNewPatientEntry;

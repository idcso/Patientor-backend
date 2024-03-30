import patients from '../../data/patients';
import { PatientEntry, NoSsnPatientEntry } from '../types';

const getEntries = (): PatientEntry[] => {
  return patients;
};

const getNoSsnEntries = (): NoSsnPatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => {
    return {
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
    };
  });
};

export default {
  getEntries,
  getNoSsnEntries,
};

import patients from '../../data/patients';
import { PatientEntry, NoSsnPatientEntry, NewPatientEntry } from '../types';
import { v1 } from 'uuid';

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

const addNew = (entry: NewPatientEntry): PatientEntry => {
  const id = v1();
  const newPatientEntry = {
    id,
    ...entry,
  };
  patients.push(newPatientEntry);
  return newPatientEntry;
};

export default {
  getEntries,
  getNoSsnEntries,
  addNew,
};

import patients from '../../data/patients';
import {
  PatientEntry,
  NonSensitivePatient,
  NewPatientEntry,
  Entry,
  EntryWithoutId,
} from '../types';
import { v1 } from 'uuid';

const getEntries = (): PatientEntry[] => {
  return patients;
};

const getNoSsnEntries = (): NonSensitivePatient[] => {
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

const getPatientById = (id: string): PatientEntry | undefined => {
  const patient = patients.find((patient) => patient.id === id);
  if (!patient) return;
  return patient;
};

const addNewHealthEntry = (id: string, entry: EntryWithoutId): Entry => {
  const entryId = v1();
  const newEntry = { ...entry, id: entryId };
  const patient = patients.find((patient) => patient.id === id);
  patient?.entries.push(newEntry);
  return newEntry;
};

export default {
  getEntries,
  getNoSsnEntries,
  addNew,
  getPatientById,
  addNewHealthEntry,
};

import express from 'express';
import patientService from '../services/patientService';
import toNewPatientEntry, { toNewHealthEntry } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getNoSsnEntries());
});

router.post('/', (req, res) => {
  try {
    const newEntry = toNewPatientEntry(req.body);
    const addedEntry = patientService.addNew(newEntry);
    res.json(addedEntry);
  } catch (error) {
    let errorMessage = 'Something went wrong.';

    if (error instanceof Error) {
      errorMessage += 'Error:' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  res.json(patientService.getPatientById(id));
});

router.post('/:id/entries', (req, res) => {
  try {
    const newHealthEntry = toNewHealthEntry(req.body);
    res.json(patientService.addNewHealthEntry(req.params.id, newHealthEntry));
  } catch (error) {
    let errorMessage = 'Something went wrong.';

    if (error instanceof Error) {
      errorMessage += error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;

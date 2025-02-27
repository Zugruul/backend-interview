import * as fs from 'fs';
import * as path from 'path';
import { PatientProspect } from '../../src';

export async function getProspectPatientsList(): Promise<PatientProspect[]> {
	const data = await fs.promises.readFile(path.join(__dirname, '../../sample-data/patients.json'), 'utf8');
	return JSON.parse(data);
}

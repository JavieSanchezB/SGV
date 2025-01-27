// pages/api/healthcheck.ts
import { query } from '../../lib/db'; // Ajusta la ruta según tu estructura
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Realizamos una consulta básica para verificar la conexión
    const result = await query('SELECT 1 AS success');

    // Si la consulta tiene éxito, enviamos un mensaje positivo
    if (result?.rows?.[0]?.success === 1) {
      res.status(200).json({ success: true, message: 'Conexión a la base de datos exitosa' });
    } else {
      res.status(500).json({ success: false, error: 'Error inesperado en la consulta de healthcheck' });
    }
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error);
    res.status(500).json({ success: false, error: 'Error al conectar con la base de datos' });
  }
}


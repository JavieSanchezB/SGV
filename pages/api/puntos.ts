import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Verifica que el método sea GET
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Método no permitido. Usa GET.',
    });
  }

  // Obtiene y valida el parámetro id_omt
  const idOmt = parseInt(req.query.id_omt as string, 10);

  if (isNaN(idOmt)) {
    return res.status(400).json({
      success: false,
      error: 'El parámetro id_omt debe ser un número válido.',
    });
  }

  try {
    // Realiza la consulta a la tabla "establecimientos"
    const { rows } = await query(
      'SELECT * FROM establecimientos WHERE id_omt = $1',
      [idOmt]
    );

    // Verifica si se encontraron resultados
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No se encontró información para el ID proporcionado.',
      });
    }

    // Respuesta exitosa con los datos encontrados
    res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno en el servidor. Por favor, intenta nuevamente.',
    });
  }
}

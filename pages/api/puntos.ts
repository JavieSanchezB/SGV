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

  // Obtiene y valida los parámetros id_omt y nombre_del_establecimiento
  const idOmt = req.query.id_omt ? parseInt(req.query.id_omt as string, 10) : null;
  const nombreEstablecimiento = req.query.nombre_del_establecimiento as string;

  if (!idOmt && !nombreEstablecimiento) {
    return res.status(400).json({
      success: false,
      error: 'Debes proporcionar id_omt o nombre_del_establecimiento.',
    });
  }

  try {
    let rows: { id_omt: number; nombre_del_establecimiento: string; direccion: string; telefono: string }[] = [];
    if (idOmt) {
      // Realiza la consulta a la tabla "establecimientos" por id_omt
      const result = await query(
        'SELECT * FROM establecimientos WHERE id_omt = $1',
        [idOmt]
      );
      rows = result.rows;
    } else if (nombreEstablecimiento) {
      // Realiza la consulta a la tabla "establecimientos" por nombre_del_establecimiento
      const result = await query(
        'SELECT * FROM establecimientos WHERE nombre_del_establecimiento = $1',
        [nombreEstablecimiento]
      );
      rows = result.rows;
    }

    // Verifica si se encontraron resultados
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No se encontró información para los parámetros proporcionados.',
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
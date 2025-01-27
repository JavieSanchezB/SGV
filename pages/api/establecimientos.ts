import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    // Maneja la solicitud POST para registrar un nuevo establecimiento
    const {
      id_omt,
      nombre_del_establecimiento,
      nombre_del_propietario,
      cc_del_propietario,
      nit_del_propietario,
      tel_del_propietario,
      direccion,
      barrio,
      nombre_del_administrador,
      tel_del_administrador,
      nombre_del_encargado,
      tel_del_encargado,
      fechas_de_pago,
      latitud,
      longitud,
    } = req.body;

    try {
      const result = await query(
        `INSERT INTO establecimientos (
          id_omt,
          nombre_del_establecimiento,
          nombre_del_propietario,
          cc_del_propietario,
          nit_del_propietario,
          tel_del_propietario,
          direccion,
          barrio,
          nombre_del_administrador,
          tel_del_administrador,
          nombre_del_encargado,
          tel_del_encargado,
          fechas_de_pago,
          latitud,
          longitud
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          id_omt,
          nombre_del_establecimiento,
          nombre_del_propietario,
          cc_del_propietario,
          nit_del_propietario,
          tel_del_propietario,
          direccion,
          barrio,
          nombre_del_administrador,
          tel_del_administrador,
          nombre_del_encargado,
          tel_del_encargado,
          fechas_de_pago,
          latitud,
          longitud,
        ]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error al registrar el establecimiento:', error);
      res.status(500).json({ success: false, error: 'Error interno en el servidor. Por favor, intenta nuevamente.' });
    }
  } else if (req.method === 'PUT') {
    // Maneja la solicitud PUT para actualizar un establecimiento existente
    const {
      id_omt,
      nombre_del_establecimiento,
      nombre_del_propietario,
      cc_del_propietario,
      nit_del_propietario,
      tel_del_propietario,
      direccion,
      barrio,
      nombre_del_administrador,
      tel_del_administrador,
      nombre_del_encargado,
      tel_del_encargado,
      fechas_de_pago,
      latitud,
      longitud,
    } = req.body;

    try {
      const result = await query(
        `UPDATE establecimientos SET
          nombre_del_establecimiento = $2,
          nombre_del_propietario = $3,
          cc_del_propietario = $4,
          nit_del_propietario = $5,
          tel_del_propietario = $6,
          direccion = $7,
          barrio = $8,
          nombre_del_administrador = $9,
          tel_del_administrador = $10,
          nombre_del_encargado = $11,
          tel_del_encargado = $12,
          fechas_de_pago = $13,
          latitud = $14,
          longitud = $15
        WHERE id_omt = $1`,
        [
          id_omt,
          nombre_del_establecimiento,
          nombre_del_propietario,
          cc_del_propietario,
          nit_del_propietario,
          tel_del_propietario,
          direccion,
          barrio,
          nombre_del_administrador,
          tel_del_administrador,
          nombre_del_encargado,
          tel_del_encargado,
          fechas_de_pago,
          latitud,
          longitud,
        ]
      );
      res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error al actualizar el establecimiento:', error);
      res.status(500).json({ success: false, error: 'Error interno en el servidor. Por favor, intenta nuevamente.' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Método no permitido. Usa POST o PUT.' });
  }
}
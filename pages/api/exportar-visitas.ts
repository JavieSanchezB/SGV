import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../lib/db'; // Asume que tienes una función para consultar tu base de datos
import * as XLSX from 'xlsx';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    // Consulta los datos de la tabla `establecimientos`
    const result = await query(
      `SELECT 
        id_omt, 
        nombre_del_establecimiento, 
        nombre_del_propietario, 
        cc_del_propietario, 
        nit_del_propietario, 
        tel_del_propietario, 
        email, 
        direccion, 
        barrio, 
        nombre_del_administrador, 
        tel_del_administrador, 
        nombre_del_encargado, 
        tel_del_encargado, 
        fechas_de_pago, 
        latitud, 
        longitud 
      FROM establecimientos`
    );

    // Asegúrate de que tomas solo los datos (rows)
    const establecimientos = result.rows;

    if (!establecimientos || establecimientos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron establecimientos para exportar' });
    }

    // Prepara los datos en un formato para Excel
    const worksheet = XLSX.utils.json_to_sheet(establecimientos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Establecimientos');

    // Genera el archivo Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // Configura la respuesta para la descarga del archivo
    res.setHeader('Content-Disposition', 'attachment; filename=establecimientos.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(excelBuffer);
  } catch (error) {
    console.error('Error exportando establecimientos:', error);
    const errorMessage = (error as Error).message;
    res.status(500).json({ message: `Error al exportar los establecimientos: ${errorMessage}` });
  }
}
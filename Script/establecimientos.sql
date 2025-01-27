/*
En Neon, las bases de datos se almacenan en ramas. Por defecto, un proyecto tiene una rama y una base de datos.
Puedes seleccionar la rama y la base de datos a usar desde los menús desplegables arriba.

Intenta generar datos de ejemplo y consultarlos ejecutando las declaraciones de ejemplo a continuación,
o haz clic en "Nueva consulta" para limpiar el editor.
*/

CREATE TABLE IF NOT EXISTS establecimientos (
    id SERIAL PRIMARY KEY,
    id_omt TEXT ,
    nombre_del_establecimiento TEXT,
    nombre_del_propietario TEXT,
    cc_del_propietario TEXT,
    nit_del_propietario TEXT,
    tel_del_propietario TEXT,
    direccion TEXT,
    barrio TEXT,
    nombre_del_administrador TEXT,
    tel_del_administrador TEXT,
    nombre_del_encargado TEXT,
    tel_del_encargado TEXT,
    fechas_de_pago DATE[],
    latitud TEXT,
    longitud TEXT
);
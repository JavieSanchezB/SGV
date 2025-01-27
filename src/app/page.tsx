'use client';
import { useState, ChangeEvent } from 'react';
import { toast } from 'nextjs-toast-notify';
import "nextjs-toast-notify/dist/nextjs-toast-notify.css";
import './styles/globals.css';
import axios from 'axios';

export default function Page() {
  const [searchParams, setSearchParams] = useState({
    id_omt: '',
    nombre_del_establecimiento: '',
  });
  const [formData, setFormData] = useState({
    id_omt: '',
    nombre_del_establecimiento: '',
    nombre_del_propietario: '',
    cc_del_propietario: '',
    nit_del_propietario: '',
    tel_del_propietario: '',
    direccion: '',
    barrio: '',
    nombre_del_administrador: '',
    tel_del_administrador: '',
    nombre_del_encargado: '',
    tel_del_encargado: '',
    fechas_de_pago: '',
    latitud: '',
    longitud: '',
  });
  const [isExisting, setIsExisting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSearchParams((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSearchSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.get('/api/puntos', { params: searchParams });
      if (response.data.success) {
        setFormData(response.data.data);
        setIsExisting(true);
        toast.success('Datos cargados exitosamente');
      } else {
        setFormData({
          id_omt: '',
          nombre_del_establecimiento: '',
          nombre_del_propietario: '',
          cc_del_propietario: '',
          nit_del_propietario: '',
          tel_del_propietario: '',
          direccion: '',
          barrio: '',
          nombre_del_administrador: '',
          tel_del_administrador: '',
          nombre_del_encargado: '',
          tel_del_encargado: '',
          fechas_de_pago: '',
          latitud: '',
          longitud: '',
        });
        setIsExisting(false);
        toast.info('No se encontró el establecimiento, puede registrarlo');
      }
      setShowForm(true);
    } catch {
      toast.error('Error al realizar la consulta');
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (isExisting) {
        await axios.put('/api/puntos', formData);
        toast.success('Establecimiento actualizado exitosamente');
      } else {
        await axios.post('/api/puntos', formData);
        toast.success('Establecimiento registrado exitosamente');
      }
    } catch {
      toast.error('Error al registrar el establecimiento');
    }
  };

  return (
    <html lang="es">
      <body>
        <div className="container">
          <h1 className="title">Buscar o Registrar Establecimiento</h1>
          {!showForm && (
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input
                type="text"
                name="id_omt"
                value={searchParams.id_omt}
                onChange={handleSearchChange}
                placeholder="Buscar por ID OMT"
                className="input"
              />
              <input
                type="text"
                name="nombre_del_establecimiento"
                value={searchParams.nombre_del_establecimiento}
                onChange={handleSearchChange}
                placeholder="Buscar por Nombre del Establecimiento"
                className="input"
              />
              <button type="submit" className="button">Buscar</button>
            </form>
          )}
          {showForm && (
            <form onSubmit={handleSubmit} className="form">
              <input
                type="text"
                name="id_omt"
                value={formData.id_omt}
                onChange={handleChange}
                placeholder="ID OMT"
                className="input"
              />
              <input
                type="text"
                name="nombre_del_establecimiento"
                value={formData.nombre_del_establecimiento}
                onChange={handleChange}
                placeholder="Nombre del Establecimiento"
                className="input"
              />
              <input
                type="text"
                name="nombre_del_propietario"
                value={formData.nombre_del_propietario}
                onChange={handleChange}
                placeholder="Nombre del Propietario"
                className="input"
              />
              <input
                type="text"
                name="cc_del_propietario"
                value={formData.cc_del_propietario}
                onChange={handleChange}
                placeholder="CC del Propietario"
                className="input"
              />
              <input
                type="text"
                name="nit_del_propietario"
                value={formData.nit_del_propietario}
                onChange={handleChange}
                placeholder="NIT del Propietario"
                className="input"
              />
              <input
                type="text"
                name="tel_del_propietario"
                value={formData.tel_del_propietario}
                onChange={handleChange}
                placeholder="Tel del Propietario"
                className="input"
              />
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Dirección"
                className="input"
              />
              <input
                type="text"
                name="barrio"
                value={formData.barrio}
                onChange={handleChange}
                placeholder="Barrio"
                className="input"
              />
              <input
                type="text"
                name="nombre_del_administrador"
                value={formData.nombre_del_administrador}
                onChange={handleChange}
                placeholder="Nombre del Administrador"
                className="input"
              />
              <input
                type="text"
                name="tel_del_administrador"
                value={formData.tel_del_administrador}
                onChange={handleChange}
                placeholder="Tel del Administrador"
                className="input"
              />
              <input
                type="text"
                name="nombre_del_encargado"
                value={formData.nombre_del_encargado}
                onChange={handleChange}
                placeholder="Nombre del Encargado"
                className="input"
              />
              <input
                type="text"
                name="tel_del_encargado"
                value={formData.tel_del_encargado}
                onChange={handleChange}
                placeholder="Tel del Encargado"
                className="input"
              />
              <input
                type="text"
                name="fechas_de_pago"
                value={formData.fechas_de_pago}
                onChange={handleChange}
                placeholder="Fechas de Pago"
                className="input"
              />
              <input
                type="text"
                name="latitud"
                value={formData.latitud}
                onChange={handleChange}
                placeholder="Latitud"
                className="input"
              />
              <input
                type="text"
                name="longitud"
                value={formData.longitud}
                onChange={handleChange}
                placeholder="Longitud"
                className="input"
              />
              <button type="submit" className="button">{isExisting ? 'Actualizar' : 'Registrar'}</button>
            </form>
          )}
        </div>
      </body>
    </html>
  );
}
'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import { useState, useEffect, ChangeEvent } from 'react';
import { toast } from 'nextjs-toast-notify';
import './styles/globals.css';
import 'nextjs-toast-notify/dist/nextjs-toast-notify.css';
import axios from 'axios';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Importar el locale español
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';



interface FormData {
  id_omt: string;
  nombre_del_establecimiento: string;
  nombre_del_propietario: string;
  cc_del_propietario: string;
  nit_del_propietario: string;
  tel_del_propietario: string;
  direccion: string;
  barrio: string;
  nombre_del_administrador: string;
  tel_del_administrador: string;
  nombre_del_encargado: string;
  tel_del_encargado: string;
  fechas_de_pago: string;
  latitud: string;
  longitud: string;
}

export default function Page() {
  const [searchParams, setSearchParams] = useState({
    id_omt: '',
    nombre_del_establecimiento: '',
  });

  const [formData, setFormData] = useState<FormData>({
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
    fechas_de_pago: '', // Inicializar como cadena vacía
    latitud: '0',
    longitud: '0',
  });

  const [isExisting, setIsExisting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  useEffect(() => {
    // Realizar la solicitud a la API para obtener todos los nombres de los establecimientos
    const fetchAllNames = async () => {
      try {
        const response = await axios.get('/api/puntos');
        if (response.data.success) {
          setSuggestions(response.data.data.map((item: { nombre_del_establecimiento: string }) => item.nombre_del_establecimiento));
        } else {
          setSuggestions([]);
        }
      } catch  {
        setSuggestions([]);
        toast.error('Error al obtener los nombres de los establecimientos');
      }
    };

    fetchAllNames();
  }, []);

  useEffect(() => {
    if (searchParams.nombre_del_establecimiento.length > 2) {
      fetchSuggestions(searchParams.nombre_del_establecimiento);
    } else {
      setSuggestions([]);
    }
  }, [searchParams.nombre_del_establecimiento]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSearchParams((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (showForm) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prevData) => ({
            ...prevData,
            latitud: latitude.toString(),
            longitud: longitude.toString(),
          }));
        },
        () => {
          toast.error('Error al obtener la ubicación');
        }
      );
    }
  }, [showForm]);

  const fetchSuggestions = async (query: string) => {
    try {
      const response = await axios.get('/api/puntos', { params: { nombre_del_establecimiento: query } });
      if (response.data.success) {
        setSuggestions(response.data.data.map((item: { nombre_del_establecimiento: string }) => item.nombre_del_establecimiento));
      } else {
        setSuggestions([]);
      }
    } catch  {
      setSuggestions([]);
      toast.error('Error al obtener sugerencias');
    }
  };

  const handleSearchSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.get('/api/puntos', { params: searchParams });
      if (response.data.success) {
        setFormData(response.data.data[0]);
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
          fechas_de_pago: '', // Asegúrate de que sea una cadena vacía
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
      [name]: value || '', // Usa una cadena vacía si el valor es null
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validar que todos los campos estén llenos
    const missingFields = Object.keys(formData).filter(key => !formData[key as keyof FormData]);
    if (missingFields.length > 0) {
      toast.error(`Faltan los siguientes campos: ${missingFields.join(', ')}`);
      return;
    }

    try {
      if (isExisting) {
        await axios.put('/api/establecimientos', formData);
        toast.success('Establecimiento actualizado exitosamente');
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      } else {
        await axios.post('/api/establecimientos', formData);
        toast.success('Establecimiento registrado exitosamente');
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
      
    } catch {
      toast.error('Error al registrar el establecimiento');
    }
  };


  const updateGPS = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prevData) => ({
          ...prevData,
          latitud: latitude.toString(),
          longitud: longitude.toString(),
        }));
        toast.success('Ubicación actualizada');
      },
      () => {
        toast.error('Error al obtener la ubicación');
      }
    );
  };

  const handleNew = () => {
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
      fechas_de_pago: '', // Fecha actual
      latitud: '0',
      longitud: '0',
    });
    setIsExisting(false);
    setShowForm(true);
  };
  const handleBack = () => {
    setSearchParams({
      id_omt: '',
      nombre_del_establecimiento: ''
    });
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
      fechas_de_pago: '', // Inicializar como cadena vacía
      latitud: '0',
      longitud: '0',
    });
    setShowForm(false);
    window.location.reload();

  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Buscar o Registrar Establecimiento</h1>
      {!showForm && (
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              name="id_omt"
              value={searchParams.id_omt || ''}
              onChange={handleSearchChange}
              placeholder="Buscar por ID OMT"
              className="form-control"
            />
       <Autocomplete
                  disablePortal
                  options={suggestions}
                  getOptionLabel={(option) => option || ''}
                  onInputChange={(event, newInputValue) => {
                    setSearchParams((prevData) => ({
                      ...prevData,
                      nombre_del_establecimiento: newInputValue,
                    }));
                  }}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Nombre del Establecimiento"
                      name="nombre_del_establecimiento"
                      value={searchParams.nombre_del_establecimiento || ''}
                      onChange={handleSearchChange}
                      placeholder="Buscar por Nombre del Establecimiento"
                      className="form-control"
                    />
                  )}
/>
     
          </div>
          <button type="submit" className="btn btn-primary">Buscar</button>
          <button onClick={handleNew} className="btn btn-success mt-4">Nuevo Establecimiento</button>
        </form>
      )}
      {showForm && (
       <form onSubmit={handleSubmit} className="space-y-4">
        <input
                type="text"
                name="id_omt"
                value={formData.id_omt || ''}
                onChange={handleChange}
                placeholder="ID OMT"
                className="form-control"
                disabled={isExisting} // Hacer que el campo no sea editable
              />
       {Object.keys(formData).map((key) =>
         key === 'fechas_de_pago' ? (
          <LocalizationProvider key={key} dateAdapter={AdapterDayjs} adapterLocale="es">
          <DatePicker
            value={formData.fechas_de_pago ? dayjs(formData.fechas_de_pago) : null}
            onChange={(value) => {
              handleChange({
                target: {
                  name: "fechas_de_pago",
                  value: value ? value.format("YYYY-MM-DD") : "",
                },
              } as ChangeEvent<HTMLInputElement>);
            }}
            slotProps={{
              textField: {
                placeholder: "Fechas de pago",
                className: "form-control",
              },
            }}
          />
        </LocalizationProvider>
        
         ) : (
           ['cc_del_propietario', 'nit_del_propietario', 'tel_del_propietario', 'tel_del_administrador', 'tel_del_encargado'].includes(key) ? (
             <input
               key={key}
               type="number"
               name={key}
               value={formData[key as keyof FormData] || ""}
               onChange={handleChange}
               placeholder={key.replace(/_/g, ' ')}
               className="form-control"
             />
           ) : (
          key !== 'id_omt' && (
             <input
               key={key}
               type="text"
               name={key}
               value={formData[key as keyof FormData]}
               onChange={handleChange}
               placeholder={key.replace(/_/g, ' ')}
               className="form-control"
             />
          )
           )
         )
       )}
       <button type="button" onClick={updateGPS} className="btn btn-primary">
         Actualizar GPS
       </button>
       <button type="submit" className="btn btn-success">
         {isExisting ? 'Actualizar' : 'Registrar'}
       </button>
       <button type="button" onClick={handleBack} className="btn btn-danger">
         Regresar
       </button>
       
     </form>
      )}
      
    </div>
  );
}

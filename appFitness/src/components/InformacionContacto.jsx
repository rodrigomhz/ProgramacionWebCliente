import React from "react";

const InformacionContacto = ({ register, errors }) => {
  
  return (
    <div>
      <h3>Información de Contacto</h3>
      
      <div>
        <label>Correo</label>
        <input 
          type="email" 
          {...register("correo", { 
            required: "El correo es obligatorio",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Formato de correo inválido"
            }
          })} 
        />
        {errors.correo && <p>{errors.correo.message}</p>}
      </div>

      <div>
        <label>Teléfono</label>
        <input 
          type="tel"
          {...register("telefono", {
            required: "El teléfono es obligatorio",
            pattern: {
              value: /^[0-9]{9}$/,
              message: "El teléfono debe tener 9 dígitos"
            }
          })}
        />
        {errors.telefono && <p>{errors.telefono.message}</p>}
      </div>
    </div>  
  );
};

export default InformacionContacto;
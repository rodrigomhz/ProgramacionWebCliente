import React from "react";
import { edadValidator } from "./edadValidator"; 

const DatosPersonales = ({ register, errors, watch }) => {
  const incluirEnfermedad = watch("deficiencias");

  return (
    <div>
      <div>
        <h3>Datos Personales</h3>
        <label>Nombre</label>
        <input type="text" {...register("nombre", { required: true, maxLength: 15 })} />
        {errors.nombre?.type === "required" && <p>El nombre es necesario</p>}
        {errors.nombre?.type === "maxLength" && <p>El nombre debe tener máximo 15 caracteres</p>}
      </div>

      <div>
        <label>Edad</label>
        <input type="number" {...register("edad", { required: true, validate: edadValidator })} />
        {errors.edad && <p>La edad debe ser entre 18 y 70 años</p>}
      </div>

      <div>
        <label>Peso</label>
        <input type="number" {...register("peso", { required: true })} />
      </div>

      <div>
        <label>Dirección</label>
        <input type="text" {...register("direccion")} />
      </div>

      <div>
        <label>País</label>
        <select {...register("pais")}>
          <option value="es">España</option>
          <option value="it">Italia</option>
          <option value="fr">Francia</option>
        </select>
      </div>

      <div>
        <label>¿Deficiencias alimenticias previas?</label>
        <input type="checkbox" {...register("deficiencias")} />
      </div>

      {incluirEnfermedad && (
        <div>
          <label>Enfermedad</label>
          <input type="" {...register("enfermedad")} />
        </div>
      )}
    </div>
  );
};

export default DatosPersonales;
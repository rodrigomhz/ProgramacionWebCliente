import { useForm } from "react-hook-form";
import { useState } from "react";
import DatosPersonales from "./components/DatosPersonales";
import InformacionContacto from "./components/InformacionContacto";
import Preferencias from "./components/Preferencias";
import DatosPago from "./components/DatosPago";
import "./App.css";

const App = () => {
  const [paso, setPaso] = useState(1);
  const { register, handleSubmit, formState: { errors }, watch, trigger } = useForm({
    mode: "onChange"
  });

  const onSubmit = (data) => {
    console.log("Datos enviados:", data);
    alert("¡Formulario enviado!");
  };

  const siguiente = async (e) => {
    e.preventDefault();
    
    // Definir qué campos validar según el paso actual
    let camposAValidar = [];
    
    if (paso === 1) {
      camposAValidar = ["nombre", "edad", "peso"];
    } else if (paso === 2) {
      camposAValidar = ["correo", "telefono"];
    } else if (paso === 3) {
      camposAValidar = ["tipoEntrenamiento", "objetivo", "diasSemana"];
    }
    
    // Validar los campos del paso actual
    const esValido = await trigger(camposAValidar);
    
    // Solo avanzar si la validación es exitosa
    if (esValido) {
      setPaso(paso + 1);
      window.scrollTo(0, 0); // Scroll al inicio
    }
  };

  const anterior = (e) => {
    e.preventDefault();
    setPaso(paso - 1);
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <h2>Formulario FitLife</h2>
      <img src="/gym.jpg" alt="Gym" className="hero-image" />

      {/* Indicador simple */}
      <div className="pasos">
        Paso {paso} de 4
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {paso === 1 && <DatosPersonales register={register} errors={errors} watch={watch} />}
        {paso === 2 && <InformacionContacto register={register} errors={errors} />}
        {paso === 3 && <Preferencias register={register} errors={errors} />}
        {paso === 4 && <DatosPago register={register} errors={errors} watch={watch} />}

        {/* Botones */}
        <div className="botones">
          {paso > 1 && <button type="button" onClick={anterior}>← Anterior</button>}
          {paso < 4 ? (
            <button type="button" onClick={siguiente}>Siguiente →</button>
          ) : (
            <button type="submit">Enviar ✓</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default App;
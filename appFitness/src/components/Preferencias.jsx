const Preferencias = ({ register}) => {
  
  return (
    <div>
      <div>
        <h3>Preferencias de Entrenamiento</h3>
        <label>Tipo de Entrenamiento</label>
        <select {...register("tipoEntrenamiento")}>
          <option value="cardio">Cardio</option>
          <option value="fuerza">Fuerza</option>
          <option value="flexibilidad">Flexibilidad</option>
        </select>
      </div>
    </div>
  );
};

export default Preferencias;
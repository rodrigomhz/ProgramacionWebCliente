const DatosPago = ({ register, errors, watch}) => {

    const metodoPago = watch("metodoPago"); // Observa el método de pago seleccionado
    
    return (
        <div>
            <h3>Método de Pago</h3>
            <div>
                <label>
                    <input type="radio" value="paypal" {...register("metodoPago")} />
                    Paypal
                </label>
            </div>

            <div>
                <label>
                    <input type="radio" value="tarjeta" {...register("metodoPago")} />
                    Tarjeta
                </label>
            </div>

            {metodoPago === "paypal" && (
                <div>
                    <input 
                        type="text" 
                        placeholder="Email de Paypal" 
                        {...register("emailPaypal", { required: "Email de Paypal requerido" })} 
                    />
                    {errors.emailPaypal && <span>{errors.emailPaypal.message}</span>}
                </div>
            )}

            {metodoPago === "tarjeta" && (
                <div>
                    <ul>
                        <li>
                            <input type="radio" value="visa" {...register("tipoTarjeta")} />
                            Visa
                        </li>
                        <li>
                            <input type="radio" value="mastercard" {...register("tipoTarjeta")} />
                            Mastercard
                        </li>
                    </ul>
                    <input 
                        type="text" 
                        placeholder="Número de tarjeta" 
                        {...register("numeroTarjeta", { required: "Número de tarjeta requerido" })} 
                    />
                    {errors.numeroTarjeta && <span>{errors.numeroTarjeta.message}</span>}
                    
                    <input 
                        type="text" 
                        placeholder="Fecha de vencimiento" 
                        {...register("fechaVencimiento", { required: "Fecha requerida" })} 
                    />
                    
                    <input 
                        type="text" 
                        placeholder="CVV" 
                        {...register("cvv", { required: "CVV requerido" })} 
                    />
                </div>
            )}
        </div>
    );
}

export default DatosPago;
// frontend/src/pagos/Culqi.js
export const openCulqi = ({ amount, email }) => {
  return new Promise((resolve, reject) => {
    const SCRIPT_ID = "culqi-script";

    // Si el script de Culqi ya está en el DOM, inicializa directamente
    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.src = "https://checkout.culqi.com/js/v4";
      script.id = SCRIPT_ID;
      script.async = true;
      script.onload = () => initializeCulqi(amount, email, resolve, reject);
      script.onerror = () =>
        reject(new Error("No se pudo cargar el script de Culqi."));
      document.body.appendChild(script);
    } else {
      initializeCulqi(amount, email, resolve, reject);
    }
  });
};

const initializeCulqi = (amount, email, resolve, reject) => {
  if (!window.Culqi) {
    return reject(new Error("Culqi no se ha inicializado correctamente."));
  }

  try {
    const PUBLIC_KEY = "pk_test_QA8mmpkjcozbRcNE";
    const XRSA_ID = "aaae98ed-0e31-4407-b457-95b47f185219";

    if (!XRSA_ID || XRSA_ID.trim() === "") {
      return reject(
        new Error(
          "El ID de la llave RSA (xculqirsaid) no está configurado. Genera la llave en tu panel de Culqi y usa su ID."
        )
      );
    }

    window.Culqi.publicKey = PUBLIC_KEY;

    window.Culqi.settings({
      title: "Proyecto Universitario",
      currency: "PEN",
      amount: Math.round(amount * 100), // Culqi usa céntimos
      description: "Compra de prueba",
      order: "",
      xculqirsaid: XRSA_ID, // Solo se necesita el ID de la llave RSA
      email: email,
    });

    window.Culqi.options({
      lang: "auto",
      installments: false,
      paymentMethods: {
        tarjeta: true,
        yape: true,
        bancaMovil: true,
        agente: true,
        billetera: true,
        cuotealo: true,
      },
      style: { logo: "https://static.culqi.com/v2/v2/static/img/logo.png" },
    });

    // Esta función se ejecuta después de que Culqi.open() se cierre
    window.culqi = function () {
      if (window.Culqi.token) {
        return resolve(window.Culqi.token);
      }
      if (window.Culqi.order) {
        return resolve(window.Culqi.order);
      }
      // Revisa si hay errores de Culqi para rechazarlos
      if (window.Culqi.error) {
        return reject(
          new Error(
            window.Culqi.error.user_message || "Error al crear el token."
          )
        );
      }
      return reject(
        new Error("No se pudo obtener el token ni la orden de Culqi.")
      );
    };

    window.Culqi.open();
  } catch (err) {
    reject(new Error("Error al abrir Culqi: " + err.message));
  }
};

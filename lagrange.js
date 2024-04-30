const $formCalculadora = document.getElementById("calculadoraForm");
const $button = document.querySelector("button[type='submit']");
const $tituloGrafica = document.getElementById("tituloGrafica");
const $grafica = document.getElementById("grafica");
const $limpiar = document.getElementById("limpiar");

$limpiar.addEventListener("click", () => {
    window.location.reload();
});

$formCalculadora.addEventListener("submit", (e) => {
  e.preventDefault();

  try{

  const formData = new FormData($formCalculadora);
  const puntos = puntos_to_array(formData.get("puntos"));

  console.log(...puntos)
  const funcion = calcular_Polinomio_Lagrange(puntos);

  console.log(funcion);

  crear_grafica(funcion, puntos);
    $tituloGrafica.classList.remove("d-none");
    $tituloGrafica.innerText = `Grafica de la funcion: ${math.simplify(funcion).toString()}`;
  }catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Algo salio mal, verifica los datos ingresados"
    });
  } finally {
    $button.disabled = false;
  }
  
});

const puntos_to_array = (puntos) => {
    console.log(puntos)

    const coordenadas = puntos.split("), (");

    const sinParentesis = coordenadas.map(coordenada => {
        return coordenada.replace("(", "").replace(")", "");
    });

    const arregloCoordenadas = sinParentesis.map(coordenada => {
        return coordenada.split(",").map(Number);
    });

    return arregloCoordenadas;
};

const crear_grafica = (funcion, points) => {
  functionPlot({
    width: 776,
    target: "#grafica",
    data: [
      {
        fn: funcion,
      },
      {
        points,
        fnType: "points",
        graphType: "scatter",
        color: "purple",
        attr: {
          r: 4,
        },
      },
    ],
    tip: {
      xLine: true,
      yLine: true,
    },
  });
};

const calcular_Polinomio_Lagrange = (points) => {
  let n = points.length;
  let polinomio = "";

  for (let i = 0; i < n; i++) {
    let termino = `${points[i][1]}`;
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      termino = `${termino}*(x-${points[j][0]})/(${points[i][0]}-${points[j][0]})`;
    }
    polinomio += termino;
    if (i !== n - 1) {
      polinomio += " + ";
    }
  }

  return polinomio;
};

const points = [
  [0, 1],
  [1, 3],
  [2, 0],
];
const polinomio = calcular_Polinomio_Lagrange(points);

const polinomioParse = math.simplify(polinomio).toString();

console.log(polinomioParse);

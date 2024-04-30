const $formCalculadora = document.getElementById("calculadoraForm");
const $button = document.querySelector("button[type='submit']");
const $tituloTabla = document.getElementById("tituloTabla");
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

  console.log(formData.get("funcion"));
  console.log(formData.get("xi"));
  console.log(formData.get("xf"));

  const funcion = formData.get("funcion");
  const xi = parseFloat(formData.get("xi"));
  const xf = parseFloat(formData.get("xf"));

  const { table, root, totalX, funcString } = metodo_biseccion(funcion, xi, xf);

  crear_tabla(table);
  $tituloTabla.classList.remove("d-none");
  
  crear_grafica(funcion, root);
  $tituloGrafica.classList.remove("d-none");

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

const crear_tabla = (table) => {
  let columns = table[0];
  let data = table.slice(1);

  const tabla = new gridjs.Grid({
    columns,
    data,
  });

  tabla.render(document.getElementById("wrapper"));
};

const crear_grafica = (funcion, raiz) => {

  functionPlot({
    width: 776,
    target: '#grafica',
    data: [{
      fn: funcion,
    },
    {
      points: [[raiz, 0]],
      fnType: 'points',
      graphType: 'scatter',
      color: 'purple',
      attr: {
        r: 4
      }
  
    }],
    tip: {
      xLine: true, yLine: true
    }
  })
}

const metodo_biseccion = (func, xi, xf) => {
  let iteracion = 1;

  const table = [["i", "Xi", "Xf", "Xr", "f(xi)","f(xf)", "f(xr)", "Ea"]];

  let x;
  let xr;
  let errorAproximado = 1;
  let arrayAux;

  while (errorAproximado > 0.000001) {
    arrayAux = [];

    arrayAux.push(iteracion);

    arrayAux.push(xi);
    arrayAux.push(xf);

    xr = math.round((xi + xf) / 2, 4);
    arrayAux.push(xr);

    const fxi = math.round(math.evaluate(func, { x: xi }), 4);
    arrayAux.push(fxi);
    const fxf = math.round(math.evaluate(func, { x: xf }), 4);
    arrayAux.push(fxf);
    const fxr = math.round(math.evaluate(func, { x: xr }), 4);
    arrayAux.push(fxr);

    if (fxi * fxr < 0) {
      xf = xr;
    }
    if (fxi * fxr > 0) {
      xi = xr;
    }

    if (iteracion > 1) {
      errorAproximado = Math.abs((xr - x) / xr);
    } else {
      errorAproximado = 1;
    }
    arrayAux.push(math.round(errorAproximado, 6));

    table.push(arrayAux);

    if (fxi * fxr === 0) {
      break;
    }

    x = xr;
    iteracion++;
  }
  const funcString = math.parse(func).toTex();

  const totalX = table.map((item) => item[3]);

  return { table, root: xr, totalX, funcString };
};

console.table(metodo_biseccion("-0.5x^2 + 2.5x + 4.5", 5, 10).table);

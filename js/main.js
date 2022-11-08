const compose =
  (...functions) =>
  (data) =>
    functions.reduceRight((value, func) => func(value), data);

// {
//   tag:"h1",
//   attr:{
//     class:'title'
//   }
// }

// Funcion de forma imperativa, que consiste en explicar paso a paso cómo conseguir el resultado
// const attrsToString = (obj = {}) => {
//   const keys = Object.keys(obj);
//   const attrs = [];

//   for (let i = 0; i < keys.length; i++) {
//     let attrActual = keys[i];
//     attrs.push(`${attrActual}="${obj[attrActual]}"`);
//   }

//   const string = attrs.join(" ");

//   return string;
// };

// Funcion de forma declarativa, que se centra en qué hay que hacer, y no en cómo hacerlo
const attrsToString = (obj = {}) => {
  return Object.keys(obj)
    .map((item) => `${item}="${obj[item]}"`)
    .join(" ");
};

// console.log(attrsToString({ class: "title", onClick: "verificar()" }));

const tagAttrs =
  (obj) =>
  (content = "") => {
    return `<${obj.tag} ${attrsToString(obj.attrs)}>${content}</${obj.tag}>`;
  };

// console.log(
//   tagAttrs({
//     tag: "h1",
//     attrs: {
//       class: "title",
//       onClick: "verificar()",
//     },
//   })("Title")
// );

// De forma imperativa
// const tag = (t) => {
//   if (typeof t === "string") {
//     return tagAttrs({ tag: t });
//   } else {
//     return tagAttrs(t);
//   }
// };

//De forma declarativa
const tag = (t) => (typeof t === "string" ? tagAttrs({ tag: t }) : tagAttrs(t));

const tableRowTag = tag("tr");
// const tableRow = items => tableRowTag(tableCells(items))
const tableRow = (items) => compose(tableRowTag, tableCells)(items);

const tableCell = tag("td");
const tableCells = (item) => item.map(tableCell).join("");

const trashIcon = tag({ tag: "i", attrs: { class: "fas fa-trash-alt" } })();

// const tag2 = (t) => {
//   return (content) => {
//     return `<${t}>${content}</${t}>`;
//   };
// };

// console.log(tag("h1")("Title"));

let descripcion = $("#descripcion");
let calorias = $("#calorias");
let carbs = $("#carbs");
let proteina = $("#proteina");

let list = [];

descripcion.keypress(() => {
  descripcion.removeClass("is-invalid");
});

calorias.keypress(() => {
  calorias.removeClass("is-invalid");
});

carbs.keypress(() => {
  carbs.removeClass("is-invalid");
});

proteina.keypress(() => {
  proteina.removeClass("is-invalid");
});

const validarInputs = () => {
  descripcion.val() ? "" : descripcion.addClass("is-invalid");
  calorias.val() ? "" : calorias.addClass("is-invalid");
  carbs.val() ? "" : carbs.addClass("is-invalid");
  proteina.val() ? "" : proteina.addClass("is-invalid");

  if (descripcion.val() && calorias.val() && carbs.val() && proteina.val()) {
    addItem();
  }
};

const addItem = () => {
  const newItem = {
    descripcion: descripcion.val(),
    calorias: parseInt(calorias.val()),
    carbs: parseInt(carbs.val()),
    proteina: parseInt(proteina.val()),
  };

  list.push(newItem);

  cleanInputs();
  updateTotals();
  // console.log(list);
  renderItems();
};

const updateTotals = () => {
  let calorias = 0;
  let carbs = 0;
  let proteina = 0;

  list.map((item) => {
    calorias += item.calorias;
    carbs += item.carbs;
    proteina += item.proteina;
  });

  $("#totalCalorias").text(calorias);
  $("#totalCarbs").text(carbs);
  $("#totalProteina").text(proteina);
};

const cleanInputs = () => {
  descripcion.val("");
  calorias.val("");
  carbs.val("");
  proteina.val("");
};

const renderItems = () => {
  $("tbody").empty();

  list.map((item, index) => {
    const removeButton = tag({
      tag: "button",
      attrs: {
        class: "btn btn-outline-danger",
        onclick: `removeItem(${index})`,
      },
    })(trashIcon);

    $("tbody").append(
      tableRow([
        item.descripcion,
        item.calorias,
        item.carbs,
        item.proteina,
        removeButton,
      ])
    );
  });
};

const removeItem = (index) => {
  list.splice(index, 1);

  updateTotals();
  renderItems();
};

const { v4 } = require("uuid");

console.log("🚀 ~ file: list.jsx ~ line 5 ~ uuidv4", v4);
function check(key, defaultV) {}
class item {
  default() {
    return {
      name: "",
      id: v4(),
      reference: "",
      type: "TEXT",
      setting: {
        align: "",
        maxWidth: 0,
        maxHeight: 0,
        overflow: {
          decreaseFontSize: false,
          completeNextPage: false,
          none: true,
        },
      },
      layer: {
        name: "",
        label: "",
      },
      value: "",
      nextFrame:{
          id:"",
          name:"",
          label:""
      }
    };
  }
  addItem() {
    let defualt_V = this.default();
    console.log(
      "🚀 ~ file: list.jsx ~ line 42 ~ item ~ addItem ~ defualt_V",
      defualt_V
    );
    //   defualt_V
  }
}
const ITEM = new item();
export default ITEM;
// export default function item(obj) {
//   obj = obj | {};
//   obj.overflow = obj.overflow | {};
//   obj.layer = obj.layer | {};
//   var state = {
//     id: v4(),
//     reference: obj.reference | "",
//     type: obj.type | "TEXT",
//     setting: {
//       align: "",
//       maxWidth: obj.maxWidth | 0,
//       maxHeight: obj.maxHeight | 0,
//       overflow: {
//         decreaseFontSize: obj.overflow.decreaseFontSize | false,
//         completeNextPage: obj.overflow.completeNextPage | false,
//         none: obj.overflow.none | true,
//       },
//     },
//     layer: {
//       name: obj.layer.name | "",
//       label: obj.layer.label | "",
//     },
//     value: obj.value | "",
//     // value: <style name="testName">
//     //             {line1}
//     //             </style>
//     //             <style name="testName2">
//     //             {line2}
//     //             </style>
//     //             <style name="testName3">
//     //             {line3}
//     //             </style>
//     //    ,
//     //   },
//   };
// }

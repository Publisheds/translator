import React, { useState, useEffect, useRef } from "react";
import extendScript_reducer, * as ExtendScript from "../redux/extendScript_reducer";
import { useSelector, useDispatch } from "react-redux";
import GET_SET_OBJECT from "../redux/utils";
import Text_Input_C from "./commun/text_input";
import Normal_Botton_WR from "./commun/Normal_Botton_WR";
import _ from "underscore";
import Dropdown_C from "./commun/dropdown_C";
const { get_Object_Path } = GET_SET_OBJECT;
import LOGO from "../assets/Asset 1@4x.png";
import "./style.css";
import "./tailwind.min.css";
// import Wrap from "./wrap"*
async function translateText1(text, sourceLanguage,targetLanguage, apiKey) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a translator. Translate the following array of texts to from ${sourceLanguage} to ${targetLanguage}. Only provide the translation in the same order with the same structure, no explanations. Keep the original case (uppercase/lowercase) as provided in the input.`
        },
        {
          role: 'user',
          content: text
        }
      ]
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
   console.log("ddd",data)
  }

  return data.choices[0].message.content.trim();
}
async function translateText(textArr, source_lang, targetLang, authKey, URL__) {
  if(URL__.indexOf("openai")!=-1){
    const translateText2=await translateText1(JSON.stringify(textArr),source_lang,targetLang,authKey)
    console.log('translateText2: ', translateText2);
    return JSON.parse(translateText2)
  }
  // const url = "https://api-free.deepl.com/v2/translate";
  // const url = "https://api-free.deepl.com/v2/translate";
  const headers = {
    Authorization: `DeepL-Auth-Key ${authKey}`,
    "User-Agent": "YourApp/1.2.3",
    "Content-Type": "application/json",
  };

  const data = {
    text: textArr,
    target_lang: targetLang,
    source_lang: source_lang,
  };

  try {
    const response = await fetch(URL__, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    console.log("response: ", response);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();
    console.log("result: ", result);
    return result.translations;
  } catch (error) {
    console.error(error);
    return `Error: ${error.message}`;
  }
}
const sourceList_O = [
  ["AR", "Arabic [1]"],
  ["BG", "Bulgarian"],
  ["CS", "Czech"],
  ["DA", "Danish"],
  ["DE", "German"],
  ["EL", "Greek"],
  ["EN", "English"],
  ["ES", "Spanish"],
  ["ET", "Estonian"],
  ["FI", "Finnish"],
  ["FR", "French"],
  ["HU", "Hungarian"],
  ["ID", "Indonesian"],
  ["IT", "Italian"],
  ["JA", "Japanese"],
  ["KO", "Korean"],
  ["LT", "Lithuanian"],
  ["LV", "Latvian"],
  ["NB", "Norwegian Bokmål"],
  ["NL", "Dutch"],
  ["PL", "Polish"],
  ["PT", "Portuguese"],
  ["RO", "Romanian"],
  ["RU", "Russian"],
  ["SK", "Slovak"],
  ["SL", "Slovenian"],
  ["SV", "Swedish"],
  ["TR", "Turkish"],
  ["UK", "Ukrainian"],
  ["ZH", "Chinese"],
];
const TargetList_O = [
  ["AR", "Arabic [1]"],
  ["BG", "Bulgarian"],
  ["CS", "Czech"],
  ["DA", "Danish"],
  ["DE", "German"],
  ["EL", "Greek"],
  [
    "EN",
    "English",
    "GB or EN",
    "US instead)",
  ],
  ["EN", "GB", "English"],
  ["EN", "US", "English"],
  ["ES", "Spanish"],
  ["ET", "Estonian"],
  ["FI", "Finnish"],
  ["FR", "French"],
  ["HU", "Hungarian"],
  ["ID", "Indonesian"],
  ["IT", "Italian"],
  ["JA", "Japanese"],
  ["KO", "Korean"],
  ["LT", "Lithuanian"],
  ["LV", "Latvian"],
  ["NB", "Norwegian Bokmål"],
  ["NL", "Dutch"],
  ["PL", "Polish"],
  [
    "PT",
    "Portuguese",
    "BR or PT",
    "PT instead)",
  ],
  ["PT", "BR", "Portuguese (Brazilian)"],
  [
    "PT",
    "PT",
    "Portuguese",
  ],
  ["RO", "Romanian"],
  ["RU", "Russian"],
  ["SK", "Slovak"],
  ["SL", "Slovenian"],
  ["SV", "Swedish"],
  ["TR", "Turkish"],
  ["UK", "Ukrainian"],
  ["ZH", "Chinese (simplified)"],
];
function Step1() {
  const path_reducer_state = "settings";
  const ExtendScriptState = useSelector(ExtendScript.ExtendScriptState);
  const dispatch = useDispatch();
  const chartRef1 = useRef(null);
  const [sourceList, setSourceList] = useState(sourceList_O);
  const [TargetList, setTargetList] = useState(TargetList_O);
  const chartRef2 = useRef(null);

  var current_State = get_Object_Path(
    path_reducer_state,
    ExtendScriptState,
    {}
  );
  var URL__ = get_Object_Path(
    path_reducer_state + ">URL",
    ExtendScriptState,
    ""
  );
  var sourceLanguageIndex = get_Object_Path(
    path_reducer_state + ">sourceLanguage",
    ExtendScriptState,
    {
      selected: 0,
    }
  );
  var targetLanguageIndex = get_Object_Path(
    path_reducer_state + ">targetLanguage",
    ExtendScriptState,
    {
      selected: 0,
    }
  );
  const sortTwoItems = (arr) => arr.sort((a, b) => String(a[1]).localeCompare(String(b[1])));

  console.log("current_State: ", current_State);
  useEffect(()=>{
    if(URL__.indexOf("openai")!=-1){
      setSourceList(sortTwoItems([...sourceList_O,["Catalan","Catalan"]]))
      setTargetList(sortTwoItems([...TargetList_O,["Catalan","Catalan"]]))
    }else{
      setSourceList(sortTwoItems(sourceList_O))
      setTargetList(sortTwoItems(TargetList_O))
      
    }
    dispatch(ExtendScript.set_by_path({ path: path_reducer_state + ">sourceLanguage" + ">selected", value: 0 }));
    dispatch(ExtendScript.set_by_path({ path: path_reducer_state + ">targetLanguage" + ">selected", value: 0 }));

  },[URL__])
  return (
    <div className="flex flex-col  w-full h-full	">
      <div class="flex items-center justify-center w-full my-2">
        <img src={LOGO} class="w-1/3" />
      </div>
      <Text_Input_C
        path_reducer_state={path_reducer_state + ">token"}
        label="token:"
        default_Value={""}
      />
      <Text_Input_C
        path_reducer_state={path_reducer_state + ">URL"}
        label="url:"
        default_Value={""}
      />
      <Dropdown_C
        path={path_reducer_state + ">sourceLanguage"}
        label="Select Source Language"
        selected={0}
        list={sourceList.map((r) => {
          return {
            name: r[1],
          };
        })}
      />
      <Dropdown_C
        path={path_reducer_state + ">targetLanguage"}
        label="Select Target Language"
        selected={0}
        list={TargetList.map((r) => {
          return {
            name: r[1],
          };
        })}
      />
      <div className="flex flex-row">
        <Normal_Botton_WR
          path_reducer_state="button>button1"
          onClick_F={async () => {
            const res = await window.session.getAllTexts({
              id: "Selección",
            });
            console.log("res: ", res);
            var resOBJ = JSON.parse(decodeURIComponent(res));
            console.log("resOBJ: ", resOBJ);
            var onlyTexts = resOBJ.map((r) => r[1]);
            console.log("onlyTexts: ", onlyTexts);
            //translateWithAPI
            if (onlyTexts.length == 0) {
              alert(
                "No text selected or found for current artboard or document"
              );
              return;
            }
            let source_lang = sourceList[sourceLanguageIndex.selected][0];
            let targetLang = TargetList[targetLanguageIndex.selected][0];
            if(current_State.URL.indexOf("openai")!=-1){
              source_lang=sourceList[sourceLanguageIndex.selected][1]
              targetLang = TargetList[targetLanguageIndex.selected][1];
            }
            console.log("source_lang: ", source_lang);
            console.log("targetLang: ", targetLang);
            const apiToken = current_State.token;
            console.log("apiToken: ", apiToken);
            if (!source_lang)
              return alert("Please Select Valid Source Language");
            if (!targetLang)
              return alert("Please Select Valid Target Language");
            if (!apiToken) return alert("Please Select Api Token");
            var listReslt = await translateText(
              onlyTexts,
              source_lang,
              targetLang,
              apiToken,
              current_State.URL
            );
            if (!listReslt) {
              return alert("Error in the response code-1");
            }
            if (!listReslt.length) {
              return alert("Error in the response code-2");
            }
            if (listReslt.length != resOBJ.length) {
              return alert(
                "Error in the response code-3->" +
                  listReslt.length +
                  "-" +
                  resOBJ.length
              );
            }
            console.log("listReslt: ", listReslt);
            listReslt = listReslt.map((r, ind) => {
              return [resOBJ[ind], r.text?r.text:r];
            });
            console.log("listReslt: ", listReslt);
            await window.session.setAllTexts({
              id: "Selección",
              data: listReslt,
            });
          }}
          label="Selection"
        />
        <Normal_Botton_WR
          path_reducer_state="button>button1"
          onClick_F={async () => {
            const res = await window.session.getAllTexts({
              id: "Artboard",
            });
            console.log("res: ", res);
            var resOBJ = JSON.parse(decodeURIComponent(res));
            console.log("resOBJ: ", resOBJ);
            var onlyTexts = resOBJ.map((r) => r[1]);
            console.log("onlyTexts: ", onlyTexts);
            //translateWithAPI
            if (onlyTexts.length == 0) {
              alert(
                "No text selected or found for current artboard or document"
              );
              return;
            }
            const source_lang = sourceList[sourceLanguageIndex.selected][0];
            console.log("source_lang: ", source_lang);
            const targetLang = TargetList[targetLanguageIndex.selected][0];
            console.log("targetLang: ", targetLang);
            const apiToken = current_State.token;
            console.log("apiToken: ", apiToken);
            if (!source_lang)
              return alert("Please Select Valid Source Language");
            if (!targetLang)
              return alert("Please Select Valid Target Language");
            if (!apiToken) return alert("Please Select Api Token");
            var listReslt = await translateText(
              onlyTexts,
              source_lang,
              targetLang,
              apiToken,
              current_State.URL
            );
            if (!listReslt) {
              return alert("Error in the response code-1");
            }
            if (!listReslt.length) {
              return alert("Error in the response code-2");
            }
            if (listReslt.length != resOBJ.length) {
              return alert(
                "Error in the response code-3->" +
                  listReslt.length +
                  "-" +
                  resOBJ.length
              );
            }
            console.log("listReslt: ", listReslt);
            listReslt = listReslt.map((r, ind) => {
              return [resOBJ[ind], r.text?r.text:r];
            });
            console.log("listReslt: ", listReslt);
            await window.session.setAllTexts({
              id: "Artboard",
              data: listReslt,
            });
          }}
          label="Artboard"
        />
        <Normal_Botton_WR
          path_reducer_state="button>button1"
          onClick_F={async () => {
            const res = await window.session.getAllTexts({
              id: "Documento",
            });
            console.log("res: ", res);
            var resOBJ = JSON.parse(decodeURIComponent(res));
            console.log("resOBJ: ", resOBJ);
            var onlyTexts = resOBJ.map((r) => r[1]);
            console.log("onlyTexts: ", onlyTexts);
            //translateWithAPI
            if (onlyTexts.length == 0) {
              alert(
                "No text selected or found for current artboard or document"
              );
              return;
            }
            const source_lang = sourceList[sourceLanguageIndex.selected][0];
            console.log("source_lang: ", source_lang);
            const targetLang = TargetList[targetLanguageIndex.selected][0];
            console.log("targetLang: ", targetLang);
            const apiToken = current_State.token;
            console.log("apiToken: ", apiToken);
            if (!source_lang)
              return alert("Please Select Valid Source Language");
            if (!targetLang)
              return alert("Please Select Valid Target Language");
            if (!apiToken) return alert("Please Select Api Token");
            var listReslt = await translateText(
              onlyTexts,
              source_lang,
              targetLang,
              apiToken,
              current_State.URL
            );
            if (!listReslt) {
              return alert("Error in the response code-1");
            }
            if (!listReslt.length) {
              return alert("Error in the response code-2");
            }
            if (listReslt.length != resOBJ.length) {
              return alert(
                "Error in the response code-3->" +
                  listReslt.length +
                  "-" +
                  resOBJ.length
              );
            }
            console.log("listReslt: ", listReslt);
            listReslt = listReslt.map((r, ind) => {
              return [resOBJ[ind], r.text?r.text:r];
            });
            console.log("listReslt: ", listReslt);
            await window.session.setAllTexts({
              id: "Documento",
              data: listReslt,
            });
          }}
          label="Document"
        />
      </div>
    </div>
  );
}

export default function Vengeancemma(props) {
  const { visible, close } = props;

  const path_reducer_state = "settings";
  const ExtendScriptState = useSelector(ExtendScript.ExtendScriptState);
  const dispatch = useDispatch();

  var current_State = get_Object_Path(
    path_reducer_state,
    ExtendScriptState,
    {}
  );
  console.log("current_State: ", current_State);
  const onChange = (key) => {
    console.log(key);
  };
  return (
    <div className="flex flex-col  w-full h-full[">
      <Step1 />
    </div>
  );
}

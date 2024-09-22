import {
  addCSSIn,
  setValue,
  setInner,
  addChild,
} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.8/croot.js";
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import {
  getJSON,
  putJSON,
  postJSON,
} from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.8/croot.js";
import { id, backend } from "../../url/config.js";

let tableTemplate = `
<td width="5%"><i class="fa fa-bell-o"></i></td>
<td>#TASKNAME#</td>
<td class="level-right">
<button class="button is-small is-primary" data-item="#TASKID#">#LABEL#</button>
</td>
`;

export async function main() {
  await addCSSIn("assets/css/admin.css", id.content);
  getJSON(backend.user.data, "login", getCookie("login"), getUserFunction);
  getJSON(backend.project.data, "login", getCookie("login"), getUserTaskFunction);
  getJSON(
    backend.project.anggota,
    "login",
    getCookie("login"),
    getUserDoingFunction
  );
  getJSON(backend.project.editor, "login", getCookie("login"), getUserDoneFunction);
}

function getUserFunction(result) {
  if (result.status !== 404) {
    setInner("biggreet", "Halo " + result.data.name);
    setInner(
      "subtitle",
      "Kode Editor Kakak " +
        result.data._id
    );
    //setInner("bigpoin", result.data._id);
  } 
  else {
    redirect("/signup");
  }
}

function getUserTaskFunction(result) {
  setInner("list", "");
  setInner("bigtodo", "0");
  if (result.status === 200) {
    setInner("bigtodo", result.data.length.toString());
    result.data.forEach(isiTaskList);
  }
}

function isiTaskList(value) {
  let content = tableTemplate
    .replace("#TASKNAME#", value.title)
    .replace("#TASKID#", value._id)
    .replace("#LABEL#", value.name);
  addChild("list", "tr", "", content);
}

function isiDoingList(value) {
  let content = tableTemplate
    .replace("#TASKNAME#", value.title)
    .replace("#TASKID#", value._id)
    .replace("#LABEL#", value.name);
  addChild("doing", "tr", "", content);
}

function isiDoneList(value) {
  let content = tableTemplate
    .replace("#TASKNAME#", value.title)
    .replace("#TASKID#", value._id)
    .replace("#LABEL#", value.name);
  addChild("done", "tr", "", content);
}

function getUserDoingFunction(result) {
  setInner("doing", "");
  setInner("bigdoing", "0");
  if (result.status === 200) {
    setInner("bigdoing", result.data.length.toString());
    result.data.forEach(isiDoingList);
  }
}


function getUserDoneFunction(result) {
  setInner("done", "");
  setInner("bigdone", "0");
  if (result.status === 200) {
    setInner("bigdone", result.data.length.toString());
    result.data.forEach(isiDoneList);
  }
}

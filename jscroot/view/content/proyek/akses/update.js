import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import {validateUserName} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.8/validate.js";
import {onInput} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.8/element.js";
import {putJSON} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/api.js";
import { backend } from "../../../../url/config.js";
import {getCookie} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/cookie.js";

export async function updateButton(event){
    const projectId = event.target.getAttribute("data-project-id");
    const projectName =event.target.getAttribute("data-project-name");
    const { value: formValues } = await Swal.fire({
    title: "Publish Draft Buku",
    html: `
        <div class="field">
        <div class="control">
            <label class="label">Nama Project</label>
            <input type="hidden" id="project-id" name="projectId" value="${projectId}">
            <input class="input" type="text" value="${projectName}" disabled>
        </div>
        </div>
        <div class="field">
        <label class="label">No. ISBN</label>
        <div class="control">
            <input class="input" type="text" id="isbn" name="isbn" placeholder="ISBN dari Perpusnas">
        </div>
        </div>
        <div class="field">
        <label class="label">Tanggal Terbit</label>
        <div class="control">
            <input class="input" type="text" id="terbit" name="terbit" placeholder="terbit">
        </div>
        </div>
        <div class="field">
        <label class="label">URL Google Play Book</label>
        <div class="control">
            <input class="input" type="text" id="linkplaybook" name="linkplaybook" placeholder="linkplaybook">
        </div>
        </div>
        <div class="field">
        <label class="label">URL Gramedia</label>
        <div class="control">
            <input class="input" type="text" id="linkgramed" name="linkgramed" placeholder="linkgramed">
        </div>
        </div>
        <div class="field">
        <label class="label">URL Kubuku</label>
        <div class="control">
            <input class="input" type="text" id="linkkubuku" name="linkkubuku" placeholder="linkkubuku">
        </div>
        </div>
        <div class="field">
        <label class="label">URL MyEdisi</label>
        <div class="control">
            <input class="input" type="text" id="linkmyedisi" name="linkmyedisi" placeholder="linkmyedisi">
        </div>
        </div>
        <div class="field">
        <label class="label">URL Deposit Perpusnas</label>
        <div class="control">
            <input class="input" type="text" id="linkdepositperpusnas" name="linkdepositperpusnas" placeholder="linkdepositperpusnas">
        </div>
        </div>
        <div class="field">
        <label class="label">URL Deposit Perpusda</label>
        <div class="control">
            <input class="input" type="text" id="linkdepositperpusda" name="linkdepositperpusda" placeholder="linkdepositperpusda">
        </div>
        </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Publish",
    didOpen: () => {
        // Memanggil fungsi onInput setelah dialog SweetAlert2 dibuka
        onInput("approve", validateUserName);
    },
    preConfirm: () => {
        const approve = document.getElementById("approve").value;
        const projectId = document.getElementById("project-id").value;
        if (!approve) {
        Swal.showValidationMessage(`Ketik approve`);
        }
        return { approve, projectId };
    },
    });

    if (formValues) {
        const { approve, projectId } = formValues;
        // Logic to add member
        //onInput("phonenumber", validatePhoneNumber);
        let idprjusr = {
            _id: projectId,
        };
        putJSON(
            backend.project.publishbuku,
            "login",
            getCookie("login"),
            idprjusr,
            postResponseFunction
        );
    }
}


function postResponseFunction(result) {
    if (result.status === 200) {
      const katakata =
        "Berhasil approve draft buku project " + result.data.name;
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text:
          "Selamat kak proyek " +
          result.data.name +
          " dengan ID: " +
          result.data._id +
          " sudah di approved",
        footer:
          '<a href="https://wa.me/62895601060000?text=' +
          katakata +
          '" target="_blank">Verifikasi Proyek</a>',
        didClose: () => {
          reloadDataTable();
        },
      });
    } else {
      Swal.fire({
        icon: "error",
        title: result.data.status,
        text: result.data.response,
      });
    }
    console.log(result);
  }
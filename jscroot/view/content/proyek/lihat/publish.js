import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import {validateUserName} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.8/validate.js";
import {getValue} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.8/element.js";
import {putJSON} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/api.js";
import { backend } from "../../../../url/config.js";
import {getCookie} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/cookie.js";

export async function infoButton(event){
    const projectId = event.target.getAttribute("data-project-id");
    const projectName =event.target.getAttribute("data-project-name");
    const isbn =event.target.getAttribute("data-project-isbn");
    const terbit =event.target.getAttribute("data-project-terbit");
    const linkplaybook =event.target.getAttribute("data-project-linkplaybook");
    const linkgramed =event.target.getAttribute("data-project-linkgramed");
    const linkkubuku =event.target.getAttribute("data-project-linkkubuku");
    const linkmyedisi =event.target.getAttribute("data-project-linkmyedisi");
    const linkdepositperpusnas =event.target.getAttribute("data-project-linkdepositperpusnas");
    const linkdepositperpusda =event.target.getAttribute("data-project-linkdepositperpusda");
    Swal.fire({
    title: "Info Publish Buku",
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
            <input value="${isbn}" class="input" type="text" id="isbn" name="isbn" placeholder="ISBN dari Perpusnas" disabled>
        </div>
        </div>
        <div class="field">
        <label class="label">Tanggal Terbit</label>
        <div class="control">
            <input value="${terbit}" class="input" type="text" id="terbit" name="terbit" placeholder="terbit" disabled>
        </div>
        </div>
        <div class="field">
        <label class="label">URL Google Play Book</label>
        <div class="control">
            <input value="${linkplaybook}" class="input" type="text" id="linkplaybook" name="linkplaybook" placeholder="linkplaybook" disabled>
        </div>
        </div>
        <div class="field">
        <label class="label">URL Gramedia</label>
        <div class="control">
            <input value="${linkgramed}" class="input" type="text" id="linkgramed" name="linkgramed" placeholder="linkgramed" disabled>
        </div>
        </div>
        <div class="field">
        <label class="label">URL Kubuku</label>
        <div class="control">
            <input value="${linkkubuku}" class="input" type="text" id="linkkubuku" name="linkkubuku" placeholder="linkkubuku" disabled>
        </div>
        </div>
        <div class="field">
        <label class="label">URL MyEdisi</label>
        <div class="control">
            <input value="${linkmyedisi}" class="input" type="text" id="linkmyedisi" name="linkmyedisi" placeholder="linkmyedisi" disabled>
        </div>
        </div>
        <div class="field">
        <label class="label">URL Deposit Perpusnas</label>
        <div class="control">
            <input value="${linkdepositperpusnas}" class="input" type="text" id="linkdepositperpusnas" name="linkdepositperpusnas" placeholder="linkdepositperpusnas" disabled>
        </div>
        </div>
        <div class="field">
        <label class="label">URL Deposit Perpusda</label>
        <div class="control">
            <input value="${linkdepositperpusda}" class="input" type="text" id="linkdepositperpusda" name="linkdepositperpusda" placeholder="linkdepositperpusda" disabled>
        </div>
        </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Ok",
    });
}



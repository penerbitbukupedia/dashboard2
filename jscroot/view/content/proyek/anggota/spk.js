import { backend } from "/dashboard/jscroot/url/config.js";
import {getFileWithHeader} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.7/api.js";
import {getCookie} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.7/cookie.js";

export function SPKButtonListeners() {
    document.querySelectorAll(".draftButton").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const projectId = button.getAttribute("data-project-id");
        const projectName = button.getAttribute("data-project-name");
        const pathURLDoc = button.getAttribute("data-file-path");
        const projectNameField = `
          <div class="field">
            <label class="label">Unduh Dokumen</label>
            <div class="control">
              <button class="button is-info downloadButton" style="padding: 5px 10px; font-size: 12px;" data-project-name="${projectName}">
                    <i class="bx bx-download"></i>
              </button>
            </div>
          </div>
        `;
        // Mengecek apakah pathURLDoc benar-benar ada dan bukan "undefined" atau "null"
        let statusDraftBuku = pathURLDoc && pathURLDoc !== "undefined" && pathURLDoc !== "null" ? projectNameField : "";
        Swal.fire({
          title: "Edit Draft Buku",
          html: `
           <input class="input" type="hidden" id="_id" value="${projectId}" disabled>
            <div class="field">
              <label class="label">Project Name</label>
              <div class="control">
                <input class="input" type="text" id="name" value="${projectName}" disabled>
              </div>
            </div>
            ${statusDraftBuku}
            <div class="field">
              <label class="label">Docx Draft Buku</label>
              <div class="control">
                  <input class="input" type="file" id="fileInput" name="file" required>
              </div>
            </div>
            <div class="field">
                <div class="control">
                    <button class="button is-primary" id="uploadButton">Upload</button>
                </div>
            </div>
            <div class="field" id="imageField" style="display: none;">
                <div class="control">
                    <img id="uploadedImage" src="" alt="Uploaded Image" style="max-width: 100%;">
                </div>
            </div>
          `,
          didOpen: () => {
            // Memanggil fungsi onInput setelah dialog SweetAlert2 dibuka
            // onInput("phonenumber", validatePhoneNumber);
            onClick('uploadButton',uploadSPI);
            if(pathURLDoc){
              downloadDokumenButtonListeners();
            }
            
          },
          didClose: () => {
            reloadDataTable();
          },
        });
  
  
      });
    });
  }



  function uploadSPI(){
    const targetUrl = backend.project.draftbuku+document.getElementById("_id").value; // Ganti dengan URL backend Anda
    const fileInputId = 'fileInput';
    const formDataName = 'draftbuku'; // Sesuaikan dengan nama form-data di backend
    postFileWithHeader(targetUrl, "login", getCookie('login'), fileInputId, formDataName,runafterUploadSPI);
  }

  function runafterUploadSPI(result){
    //setValue('id',result.info);
    //setValue('image',result.location);
    document.getElementById('fileInput').style.display = 'none';
    document.getElementById('uploadButton').style.display = 'none';
    const imageField = document.getElementById('imageField');
    const uploadedImage = document.getElementById('uploadedImage');
    uploadedImage.src = result.location;
    imageField.style.display = 'block';
    console.log(result);
  
  }

  function downloadDokumenButtonListeners() {
    document.querySelectorAll(".downloadButton").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const prjname = button.getAttribute("data-project-name");
        getFileWithHeader(backend.project.downloadspk+prjname,'login',getCookie('login'),runafterDownloadDraft);
      });
    });
  }

  function runafterDownloadDraft(response){
    console.log(response);
  }
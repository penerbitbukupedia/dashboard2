import {getValue,onInput,onClick,addCSSIn} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.7/croot.js";
import { validatePhoneNumber } from "https://cdn.jsdelivr.net/gh/jscroot/validate@0.0.2/croot.js";
import { deleteJSON,postFileWithHeader,putJSON,getJSON,postJSON,getWithHeader } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.8/croot.js";
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { id, backend } from "/dashboard/jscroot/url/config.js";
import { loadScript } from "../../../controller/main.js";
import { truncateText, addRevealTextListeners } from "../../utils.js";

let dataTable;

export async function main() {
  await addCSSIn(
    "https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css",
    id.content
  );
  await addCSSIn("assets/css/custom.css", id.content);
  await loadScript("https://code.jquery.com/jquery-3.6.0.min.js");
  await loadScript("https://cdn.datatables.net/2.0.8/js/dataTables.min.js");

  getJSON(
    backend.project.data,
    "login",
    getCookie("login"),
    getResponseFunction
  );
}

function reloadDataTable() {
  if (dataTable) {
    dataTable.destroy(); // Destroy the existing DataTable
  }
  getJSON(
    backend.project.data,
    "login",
    getCookie("login"),
    getResponseFunction
  );
}

function getResponseFunction(result) {
  console.log(result);
  const tableBody = document.getElementById("webhook-table-body");
  if (tableBody) {
    if (result.status === 200) {
      // Clear existing table body content to avoid duplication
      tableBody.innerHTML = "";

      // Destroy existing DataTable instance if it exists
      if ($.fn.DataTable.isDataTable("#myTable")) {
        $("#myTable").DataTable().destroy();
      }

      // Menambahkan baris untuk setiap webhook dalam data JSON
      result.data.forEach((project) => {
        const truncatedDescription = truncateText(project.description, 50);

        // Gabungkan nama anggota dalam satu kolom dengan numbering dan tambahkan tombol Add Member
        let membersHtml =
          project.members && project.members.length > 0
            ? project.members
                .map(
                  (member, index) =>
                    `
                    <div class="tag is-success mb-3">
                       ${index + 1}. ${member.name}
                      <button class="delete is-small removeMemberButton" data-project-name="${
                        project.name
                      }" data-member-phonenumber="${
                      member.phonenumber
                    }"></button>
                    </div>
                  `
                )
                .join("<br>") // Tambahkan <br> untuk membuat baris baru untuk setiap anggota
            : "";
        membersHtml += `
          <button class="button box is-primary is-small btn-flex addMemberButton" data-project-id="${project._id}">
            <i class="bx bx-plus"></i>
            Add member
          </button>`;

        const row = document.createElement("tr");
        //pengecekan kelengkapan draft
        // pengecekan kelengkapan draft
        let statusDraftBuku = project.draftbuku ? "Sudah" : "Belum";
        let statusDraftPDFBuku = project.draftpdfbuku ? "Sudah" : "Belum";
        let statusSampulPDFBuku = project.sampulpdfbuku ? "Sudah" : "Belum";
        //pembuatan tabel
        row.innerHTML = `
          <td>${project.name} (${project.title})<br><img src="${project.coverbuku}">
            <button class="button is-success documentButton" data-project-id="${project._id}" data-project-name="${project.name}">
              <i class="bx bx-image"></i>
            </button>
          </td>
          <td>${membersHtml}</td>
          <td class="has-text-justified">
            ${truncatedDescription}
            <span class="full-text" style="display:none;">${project.description}</span>
          </td>
          <td>
          <ul style="list-style-type:none; padding-left:0;">
            <li>
                1. Draft Docx[<a href="javascript:void(0);" class="button is-success draftButton" data-project-id="${project._id}" data-project-name="${project.name}" data-file-path="${project.draftbuku}">${statusDraftBuku}</a>]
                <button class="button is-success draftButton" style="padding: 5px 10px; font-size: 12px;" data-project-id="${project._id}" data-project-name="${project.name}">
                  <i class="bx bx-file-find"></i>
                </button>
                <button class="button is-info downloadButton" style="padding: 5px 10px; font-size: 12px;" data-file-path="${project.draftbuku}">
                  <i class="bx bx-download"></i>
                </button>
            </li>
            <li>
                2. Draft PDF[${statusDraftPDFBuku}]
                <button class="button is-success pdfButton" style="padding: 5px 10px; font-size: 12px;" data-project-id="${project._id}" data-project-name="${project.name}">
                  <i class="bx bx-file-blank"></i>
                </button>
                <button class="button is-info downloadButton" style="padding: 5px 10px; font-size: 12px;" data-file-path="${project.draftpdfbuku}">
                  <i class="bx bx-download"></i>
                </button>
            </li>
            <li>
                3. Sampul PDF[${statusSampulPDFBuku}]
                <button class="button is-success pdfsampulButton" style="padding: 5px 10px; font-size: 12px;" data-project-id="${project._id}" data-project-name="${project.name}">
                  <i class="bx bx-file"></i>
                </button>
                <button class="button is-info downloadButton" style="padding: 5px 10px; font-size: 12px;" data-file-path="${project.sampulpdfbuku}">
                  <i class="bx bx-download"></i>
                </button>
            </li>
          </ul>
          </td>
          <td class="has-text-centered">
            <button class="button is-danger removeProjectButton" data-project-name="${project.name}">
              <i class="bx bx-trash"></i>          
            </button>
            <button class="button is-warning editProjectButton" data-project-id="${project._id}" data-project-name="${project.name}" data-project-title="${project.title}" data-project-kalimatpromosi="${project.kalimatpromosi}" data-project-description="${project.description}">
              <i class="bx bx-edit"></i>
            </button>
          </td>
        `;
        tableBody.appendChild(row);
      });

      // Initialize DataTable after populating the table body
      dataTable = $("#myTable").DataTable({
        responsive: true,
        autoWidth: false,
      });

      addRevealTextListeners();
      addMemberButtonListeners(); //  event listener tambah member
      addRemoveMemberButtonListeners(); //  event listener hapus member
      addRemoveProjectButtonListeners();
      addEditProjectButtonListeners(); //  event listener edit project
      addEditdocumentButtonListeners(); //  event listener edit document project
      addEditDraftButtonListeners();//draft doc
      addEditDraftPDFButtonListeners();//draft pdf
      addEditSampulPDFButtonListeners();//sampul buku
      downloadDraftButtonListeners();//download draft
    } else {
      Swal.fire({
        icon: "error",
        title: result.data.status,
        text: result.data.response,
      });
    }
  } else {
    console.error('Element with ID "webhook-table-body" not found.');
  }
}

// Function to add event listeners to addMemberButtons
function addMemberButtonListeners() {
  document.querySelectorAll(".addMemberButton").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const projectId = button.getAttribute("data-project-id");
      const projectName =
        button.getAttribute("data-project-name") ||
        button.closest("tr").querySelector("td:first-child").innerText;
      const { value: formValues } = await Swal.fire({
        title: "Tambah Penulis",
        html: `
          <div class="field">
            <div class="control">
              <label class="label">Nama Project</label>
              <input type="hidden" id="project-id" name="projectId" value="${projectId}">
              <input class="input" type="text" value="${projectName}" disabled>
            </div>
          </div>
          <div class="field">
            <label class="label">Nomor Telepon Calon Penulis</label>
            <div class="control">
              <input class="input" type="tel" id="phonenumber" name="phonenumber" placeholder="628111" required>
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Tambah Member",
        didOpen: () => {
          // Memanggil fungsi onInput setelah dialog SweetAlert2 dibuka
          onInput("phonenumber", validatePhoneNumber);
        },
        preConfirm: () => {
          const phoneNumber = document.getElementById("phonenumber").value;
          const projectId = document.getElementById("project-id").value;
          if (!phoneNumber) {
            Swal.showValidationMessage(`Please enter a phone number`);
          }
          return { phoneNumber, projectId };
        },
      });

      if (formValues) {
        const { phoneNumber, projectId } = formValues;
        // Logic to add member
        //onInput("phonenumber", validatePhoneNumber);
        let idprjusr = {
          _id: projectId,
          phonenumber: phoneNumber,
        };
        postJSON(
          backend.project.anggota,
          "login",
          getCookie("login"),
          idprjusr,
          postResponseFunction
        );
      }
    });
  });
}

// Add project event listener
document.getElementById("addButton").addEventListener("click", () => {
  Swal.fire({
    title: "Add New Project",
    html: `
            <div class="field">
                <label class="label">Project Name</label>
                <div class="control">
                    <input class="input" type="text" id="name" placeholder="huruf kecil tanpa spasi boleh pakai - dan _">
                </div>
            </div>
            <div class="field">
                <label class="label">Judul Buku</label>
                <div class="control">
                    <input class="input" type="text" id="title" placeholder="Judul Buku">
                </div>
            </div>
            <div class="field">
                <label class="label">Sinopsis</label>
                <div class="control">
                    <textarea class="textarea" id="description" placeholder="Sinopsis buku yang akan dipublikasikan di katalog"></textarea>
                </div>
            </div>
            <div class="field">
                <label class="label">Kalimat Promosi Buku</label>
                <div class="control">
                    <input class="input" type="text" id="kalimatpromosi" placeholder="Kalimat yang membuat orang membeli buku ini">
                </div>
            </div>
        `,
    showCancelButton: true,
    confirmButtonText: "Add",
    cancelButtonText: "Cancel",
    preConfirm: () => {
      const name = Swal.getPopup().querySelector("#name").value;
      const title = Swal.getPopup().querySelector("#title").value;
      const description = Swal.getPopup().querySelector("#description").value;
      const kalimatpromosi = Swal.getPopup().querySelector("#kalimatpromosi").value;

      const namePattern = /^[a-z0-9_-]+$/;
      if (!name || !title || !description || !kalimatpromosi) {
        Swal.showValidationMessage(`Please enter all fields`);
      } else if (!namePattern.test(name)) {
        Swal.showValidationMessage(
          `Project Name hanya boleh mengandung huruf kecil, angka, '-' dan '_'`
        );
      } else {
        return {
          name: name,
          title: title,
          description: description,
          kalimatpromosi:kalimatpromosi,
        };
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      let resultData = {
        name: getValue("name"),
        title: getValue("title"),
        description: getValue("description"),
        kalimatpromosi: getValue("kalimatpromosi"),
      };
      if (getCookie("login") === "") {
        redirect("/signin");
      } else {
        postJSON(
          backend.project.data,
          "login",
          getCookie("login"),
          resultData,
          responseFunction
        );
      }
    }
  });
});


function responseFunction(result) {
  if (result.status === 200) {
    const katakata = "Pembuatan proyek baru " + result.data._id;
    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text:
        "Selamat kak proyek " +
        result.data.name +
        " sudah terdaftar dengan ID: " +
        result.data._id +
        " dan Secret: " +
        result.data.secret,
      footer:
        '<a href="https://wa.me/6287752000300?text=' +
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

function postResponseFunction(result) {
  if (result.status === 200) {
    const katakata =
      "Berhasil memasukkan member baru ke project " + result.data.name;
    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text:
        "Selamat kak proyek " +
        result.data.name +
        " dengan ID: " +
        result.data._id +
        " sudah mendapat member baru",
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

// Function to add event listeners to removeMemberButtons
function addRemoveMemberButtonListeners() {
  document.querySelectorAll(".removeMemberButton").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const projectName = button.getAttribute("data-project-name");
      const memberPhoneNumber = button.getAttribute("data-member-phonenumber");

      const result = await Swal.fire({
        title: "Hapus member ini?",
        text: "Kamu tidak dapat mengembalikan aksi ini!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Hapus member",
        cancelButtonText: "Kembali",
      });

      if (result.isConfirmed) {
        const memberWillBeDeleted = {
          project_name: projectName,
          phone_number: memberPhoneNumber,
        };

        deleteJSON(
          backend.project.anggota,
          "login",
          getCookie("login"),
          memberWillBeDeleted,
          removeMemberResponse
        );
      }
    });
  });
}

function removeMemberResponse(result) {
  if (result.status === 200) {
    Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "Member has been removed.",
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

// Remove project mechanism
function addRemoveProjectButtonListeners() {
  document.querySelectorAll(".removeProjectButton").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const projectName = button.getAttribute("data-project-name");

      const result = await Swal.fire({
        title: "Hapus project ini?",
        text: "Kamu tidak dapat mengembalikan aksi ini!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Hapus project",
        cancelButtonText: "Kembali",
      });

      if (result.isConfirmed) {
        const projectWillBeDeleted = {
          project_name: projectName,
        };

        deleteJSON(
          backend.project.data,
          "login",
          getCookie("login"),
          projectWillBeDeleted,
          removeProjectResponse
        );
      }
    });
  });
}

function removeProjectResponse(result) {
  if (result.status === 200) {
    Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "Project has been removed.",
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

function addEditProjectButtonListeners() {
  document.querySelectorAll(".editProjectButton").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const projectId = button.getAttribute("data-project-id");
      const projectName = button.getAttribute("data-project-name");
      const projecttitle = button.getAttribute("data-project-title");
      const projectkalimatpromosi = button.getAttribute("data-project-kalimatpromosi");
      const projectDescription = button.getAttribute(
        "data-project-description"
      );

      const { value: formValues } = await Swal.fire({
        title: "Edit Project",
        html: `
          <div class="field">
            <label class="label">Project Name</label>
            <div class="control">
              <input class="input" type="text" id="name" value="${projectName}" disabled>
            </div>
          </div>
          <div class="field">
            <label class="label">Judul Buku</label>
            <div class="control">
              <input class="input" type="text" id="title" value="${projecttitle}">
            </div>
          </div>
          <div class="field">
            <label class="label">Kalimat Promosi</label>
            <div class="control">
              <input class="input" type="text" id="kalimatpromosi" value="${projectkalimatpromosi}">
            </div>
          </div>
          <div class="field">
            <label class="label">Sinopsis</label>
            <div class="control">
              <textarea class="textarea" id="description">${projectDescription}</textarea>
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Update",
        cancelButtonText: "Cancel",
        preConfirm: () => {
          const kalimatpromosi = Swal.getPopup().querySelector("#kalimatpromosi").value;
          const title =
            Swal.getPopup().querySelector("#title").value;
          const description =
            Swal.getPopup().querySelector("#description").value;
          if (!title || !kalimatpromosi || !description) {
            Swal.showValidationMessage(`Please enter all fields`);
          }
          return { title, kalimatpromosi, description };
        },
      });

      if (formValues) {
        const { title, kalimatpromosi, description } = formValues;
        const updatedProject = {
          _id: projectId,
          title: title,
          kalimatpromosi: kalimatpromosi,
          description: description,
        };
        putJSON(
          backend.project.data, // Assumes a POST method will handle updates as well
          "login",
          getCookie("login"),
          updatedProject,
          updateResponseFunction
        );
      }
    });
  });
}

function updateResponseFunction(result) {
  if (result.status === 200) {
    Swal.fire({
      icon: "success",
      title: "Project Updated",
      text: `Project ${result.data.name} has been updated successfully.`,
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



function addEditdocumentButtonListeners() {
  document.querySelectorAll(".documentButton").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const projectId = button.getAttribute("data-project-id");
      const projectName = button.getAttribute("data-project-name");
      Swal.fire({
        title: "Edit Cover Buku",
        html: `
         <input class="input" type="hidden" id="_id" value="${projectId}" disabled>
          <div class="field">
            <label class="label">Project Name</label>
            <div class="control">
              <input class="input" type="text" id="name" value="${projectName}" disabled>
            </div>
          </div>
          <div class="field">
            <label class="label">Gambar Cover Buku</label>
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
          onClick('uploadButton',uploadCoverBuku);
        },
        didClose: () => {
          reloadDataTable();
        },
      });


    });
  });
}



function uploadCoverBuku(){
  const targetUrl = backend.project.coverbuku+document.getElementById("_id").value; // Ganti dengan URL backend Anda
  const fileInputId = 'fileInput';
  const formDataName = 'coverbuku'; // Sesuaikan dengan nama form-data di backend
  postFileWithHeader(targetUrl, "login", getCookie('login'), fileInputId, formDataName,runafterUploadCoverBuku);
}

function runafterUploadCoverBuku(result){
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


////upload draft doc

function addEditDraftButtonListeners() {
  document.querySelectorAll(".draftButton").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const projectId = button.getAttribute("data-project-id");
      const projectName = button.getAttribute("data-project-name");
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
          onClick('uploadButton',uploadDraftBuku);
        },
        didClose: () => {
          reloadDataTable();
        },
      });


    });
  });
}



function uploadDraftBuku(){
  const targetUrl = backend.project.draftbuku+document.getElementById("_id").value; // Ganti dengan URL backend Anda
  const fileInputId = 'fileInput';
  const formDataName = 'draftbuku'; // Sesuaikan dengan nama form-data di backend
  postFileWithHeader(targetUrl, "login", getCookie('login'), fileInputId, formDataName,runafterUploadDraftBuku);
}

function runafterUploadDraftBuku(result){
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


//upload draft pdf


function addEditDraftPDFButtonListeners() {
  document.querySelectorAll(".pdfButton").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const projectId = button.getAttribute("data-project-id");
      const projectName = button.getAttribute("data-project-name");
      Swal.fire({
        title: "Edit Draft PDF Buku",
        html: `
         <input class="input" type="hidden" id="_id" value="${projectId}" disabled>
          <div class="field">
            <label class="label">Project Name</label>
            <div class="control">
              <input class="input" type="text" id="name" value="${projectName}" disabled>
            </div>
          </div>
          <div class="field">
            <label class="label">PDF Draft Buku</label>
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
          onClick('uploadButton',uploadDraftPDFBuku);
        },
        didClose: () => {
          reloadDataTable();
        },
      });


    });
  });
}



function uploadDraftPDFBuku(){
  const targetUrl = backend.project.draftpdfbuku+document.getElementById("_id").value; // Ganti dengan URL backend Anda
  const fileInputId = 'fileInput';
  const formDataName = 'draftpdfbuku'; // Sesuaikan dengan nama form-data di backend
  postFileWithHeader(targetUrl, "login", getCookie('login'), fileInputId, formDataName,runafterUploadDraftPDFBuku);
}

function runafterUploadDraftPDFBuku(result){
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


//upload sampul pdf

function addEditSampulPDFButtonListeners() {
  document.querySelectorAll(".pdfsampulButton").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const projectId = button.getAttribute("data-project-id");
      const projectName = button.getAttribute("data-project-name");
      Swal.fire({
        title: "Edit Sampul PDF Buku",
        html: `
         <input class="input" type="hidden" id="_id" value="${projectId}" disabled>
          <div class="field">
            <label class="label">Project Name</label>
            <div class="control">
              <input class="input" type="text" id="name" value="${projectName}" disabled>
            </div>
          </div>
          <div class="field">
            <label class="label">PDF Sampul Buku</label>
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
          onClick('uploadButton',uploadSampulPDFBuku);
        },
        didClose: () => {
          reloadDataTable();
        },
      });


    });
  });
}



function uploadSampulPDFBuku(){
  const targetUrl = backend.project.sampulpdfbuku+document.getElementById("_id").value; // Ganti dengan URL backend Anda
  const fileInputId = 'fileInput';
  const formDataName = 'sampulpdfbuku'; // Sesuaikan dengan nama form-data di backend
  postFileWithHeader(targetUrl, "login", getCookie('login'), fileInputId, formDataName,runafterUploadSampulPDFBuku);
}

function runafterUploadSampulPDFBuku(result){
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


//download file draft 

//upload sampul pdf

function downloadDraftButtonListeners() {
  document.querySelectorAll(".downloadButton").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const filePath = button.getAttribute("data-file-path");
      getFileWithHeader(backend.project.downloaddraft+btoa(filePath),'login',getCookie('login'),runafterDownloadDraft);
    });
  });
}

function runafterDownloadDraft(response){
  console.log(response);
}


export function getFileWithHeader(target_url, tokenkey, tokenvalue, responseFunction) {

  let myHeaders = new Headers();
  myHeaders.append(tokenkey, tokenvalue);

  let requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders
  };

  fetch(target_url, requestOptions)
      .then(response => {
          if (response.status === 200) {
              // Jika status 200, download file
              return response.blob().then(blob => {
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  let base64fileurl = target_url.split('/').pop();
                  a.download = atob(base64fileurl); // Nama file dari URL
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
              });
          } else {
              // Jika status selain 200, parse sebagai JSON
              return response.json().then(result => responseFunction(result));
          }
      })
      .catch(error => console.log('error', error));
}

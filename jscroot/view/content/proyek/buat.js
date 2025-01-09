import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { addCSSIn,onClick } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { id, backend } from "/dashboard/jscroot/url/config.js";
import { loadScript } from "../../../controller/main.js";
import { addNotificationCloseListeners, truncateText, addCopyButtonListeners, addRevealTextListeners } from "../../utils.js";


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
    backend.project.editor,
    "login",
    getCookie("login"),
    getResponseFunction
  );

  addNotificationCloseListeners();
}

function reloadDataTable() {
  if (dataTable) {
    dataTable.destroy(); // Destroy the existing DataTable
  }
  getJSON(
    backend.project.editor,
    "login",
    getCookie("login"),
    getResponseFunction
  );
}

function getResponseFunction(result) {
  if (result.status === 200) {
    // Menambahkan baris untuk setiap webhook dalam data JSON
    console.log(result.data);
    result.data.forEach((project) => {
      const row = document.createElement("tr");

      let statusDraft = project.draftpdfbuku ? "Ada" : "Belum";
      let warnaTombolstatusSPK = project.spk ? "is-success" : "is-warning";
      let statusSPI = project.spi ? "Ada" : "Belum";
      let warnaTombolstatusSPI = project.spi ? "is-success" : "is-warning";
      let hashview=backend.project.downloaddraft+btoa(project.draftpdfbuku);
      let urldraftbuku="https://naskah.bukupedia.co.id/view/#"+btoa(hashview);

      const truncatedDescription = truncateText(project.description, 50);
      row.innerHTML = `
                <td>${project.name}(${project.title})<br>
                    <a href="${project.pathkatalog}" target="_blank">Katalog Buku</a><br>
                    <a href="${urldraftbuku}" target="_blank">Draft Buku</a>

                            
                </td>
                <td class="code-box">
                <button class="button ${warnaTombolstatusSPK} spkButton" data-project-id="${project._id}" data-project-name="${project.name}">
                                  Approve
                </button>
                  <a class="tag is-link copy-btn" data-copy-text="${project.secret}">Copy</a>
                </td>
                <td class="code-box">
                <a href="https://wa.me/${project.owner.phonenumber}" target="_blank">${project.owner.name}</a>
                  <a class="tag is-link copy-btn" data-copy-text="${project._id}">Copy</a> 
                </td>
                <td>${truncatedDescription}<span class="full-text" style="display:none; ">${project.description}</span></td>
            `;
      document.getElementById("webhook-table-body").appendChild(row);
    });

    $(document).ready(function () {
      dataTable = $("#myTable").DataTable({
        responsive: true,
        autoWidth: false,
      });
    });

     addRevealTextListeners();
     addCopyButtonListeners();
     const buttons = document.querySelectorAll('.spkButton');
      buttons.forEach(button => {
        button.addEventListener('click', approvalButton);
      });

     //onClick("approvalbutton",approvalButton);
  } else {
    Swal.fire({
      icon: "error",
      title: result.data.status,
      text: result.data.response,
    });
  }
}




async function approvalButton(event){
  const projectId = event.target.getAttribute("data-project-id");
    const projectName =
      event.target.getAttribute("data-project-name") ||
      event.target.closest("tr").querySelector("td:first-child").innerText;
    const { value: formValues } = await Swal.fire({
      title: "Approve Draft Buku",
      html: `
        <div class="field">
          <div class="control">
            <label class="label">Nama Project</label>
            <input type="hidden" id="project-id" name="projectId" value="${projectId}">
            <input class="input" type="text" value="${projectName}" disabled>
          </div>
        </div>
        <div class="field">
          <label class="label">Ketik approve</label>
          <div class="control">
            <input class="input" type="text" id="approve" name="approve" placeholder="approve" required>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Approve",
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
        backend.project.editor,
        "login",
        getCookie("login"),
        idprjusr,
        postResponseFunctionapprovalButton
      );
    }
}


function postResponseFunctionapprovalButton(result) {
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
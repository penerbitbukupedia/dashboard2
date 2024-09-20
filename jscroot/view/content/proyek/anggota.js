import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { addCSSIn,onClick } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { id, backend } from "/dashboard/jscroot/url/config.js";
import { loadScript } from "../../../controller/main.js";
import { addNotificationCloseListeners, truncateText, addCopyButtonListeners, addRevealTextListeners } from "../../utils.js";
import {publishButtonListeners} from "./anggota/publish.js";
import {SPKButtonListeners} from "./anggota/spk.js";
import {SPIButtonListeners} from "./anggota/spi.js";

export async function main() {
  await addCSSIn(
    "https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css",
    id.content
  );
  await addCSSIn("assets/css/custom.css", id.content);

  await loadScript("https://code.jquery.com/jquery-3.6.0.min.js");
  await loadScript("https://cdn.datatables.net/2.0.8/js/dataTables.min.js");

  getJSON(
    backend.project.anggota,
    "login",
    getCookie("login"),
    getResponseFunction
  );

  addNotificationCloseListeners();
}

function getResponseFunction(result) {
  if (result.status === 200) {
    // Menambahkan baris untuk setiap webhook dalam data JSON
    console.log(result.data);
    result.data.forEach((project) => {
      const row = document.createElement("tr");

      let statusSPK = project.spk ? "Sudah" : "Belum";
      let warnaTombolstatusSPK = project.spk ? "is-success" : "is-warning";
      let statusSPI = project.spi ? "Sudah" : "Belum";
      let warnaTombolstatusSPI = project.spi ? "is-success" : "is-warning";

      const truncatedDescription = truncateText(project.description, 50);
      row.innerHTML = `
                <td>${project.name}
                            <button class="button is-success publishButton" data-project-id="${project._id}" data-project-name="${project.name}">
                            <i class="bx bx-send"></i>
                            </button>
                </td>
                <td class="code-box">

                    <ul style="list-style-type:none; padding-left:0;">
                          <li>
                              1. Perjanjian Kerjasama
                              <button class="button ${warnaTombolstatusSPK} spkButton" style="padding: 4px 10px; font-size: 12px;" data-project-id="${project._id}" data-project-name="${project.name}">
                                  ${statusSPK}
                              </button>
                          </li>
                          <li>
                              2. Pengajuan ISBN
                              <button class="button ${warnaTombolstatusSPI} spiButton" style="padding: 5px 10px; font-size: 12px;" data-file-path="${project.sampulpdfbuku}" data-project-id="${project._id}" data-project-name="${project.name}">
                                ${statusSPI}
                              </button>
                          </li>
                    </ul>
                  <a class="tag is-link copy-btn" data-copy-text="${project.secret}">Copy</a>
                </td>
                <td class="code-box">
                  <code>                 
                    ${project.editor.name}
                  </code>
                  <a class="tag is-link copy-btn" data-copy-text="${project._id}">Copy</a> 
                </td>
                <td>${truncatedDescription}<span class="full-text" style="display:none; ">${project.description}</span></td>
            `;
      document.getElementById("webhook-table-body").appendChild(row);
    });

    $(document).ready(function () {
      $("#myTable").DataTable({
        responsive: true,
        autoWidth: false,
      });
    });

     addRevealTextListeners();
     addCopyButtonListeners();
     publishButtonListeners();
     SPKButtonListeners();
     SPIButtonListeners();
  } else {
    Swal.fire({
      icon: "error",
      title: result.data.status,
      text: result.data.response,
    });
  }
}





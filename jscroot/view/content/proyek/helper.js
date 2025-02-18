import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { addCSSIn,onClick } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { id, backend } from "../../../url/config.js";
import { loadScript } from "../../../controller/main.js";
import { addNotificationCloseListeners, truncateText, addCopyButtonListeners, addRevealTextListeners } from "../../utils.js";
import {publishButtonListeners} from "./helper/publish.js";
import {SPKButtonListeners} from "./helper/spk.js";
import {SPIButtonListeners} from "./helper/spi.js";

export async function main() {
  await addCSSIn(
    "https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css",
    id.content
  );
  await addCSSIn("assets/css/custom.css", id.content);

  await loadScript("https://code.jquery.com/jquery-3.6.0.min.js");
  await loadScript("https://cdn.datatables.net/2.0.8/js/dataTables.min.js");

  getJSON(
    backend.project.helper,
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

      let urlspkt=backend.project.downloadspkt+btoa(project.name);
      let linkskt = "https://naskah.bukupedia.co.id/view/#"+btoa(urlspkt);

      let urlspktdc=backend.project.downloadspktdc+btoa(project.name);
      let linksktdc = "https://naskah.bukupedia.co.id/view/#"+btoa(urlspktdc);

      let urlspktpc=backend.project.downloadspktpc+btoa(project.name);
      let linksktpc = "https://naskah.bukupedia.co.id/view/#"+btoa(urlspktpc);

      const truncatedDescription = truncateText(project.description, 50);
      row.innerHTML = `
                <td>${project.name}
                            <button class="button is-success publishButton" data-project-id="${project._id}" data-project-name="${project.name}">
                            <i class="bx bx-send"></i>
                            </button><br>
                            <a href=" ${project.pathkatalog ?? ""}" target="_blank">Kunjungi Katalog</a>

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
                          <li>
                              <a href="${linkskt}" target="_blank">3. Surat Penyerahan Karya Terbitan(SKT)</a>
                          </li>
                          <li>
                              <a href="${linksktdc}" target="_blank">4. Surat Penyerahan Karya Terbitan(SKT) Cetak Daerah</a>
                          </li>
                          <li>
                              <a href="${linksktpc}" target="_blank">5. Surat Penyerahan Karya Terbitan(SKT) Cetak Pusat</a>
                          </li>
                    </ul>
                  <a class="tag is-link copy-btn" data-copy-text="${project.secret}">Copy</a>
                </td>
                <td class="code-box">
                <a href="https://wa.me/${project.editor.phonenumber ?? ""}" target="_blank">${project.editor.name ?? ""}</a>
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





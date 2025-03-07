import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import { addCSSIn,onClick } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { id, backend } from "../../../url/config.js";
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

      let statusISBN = project.isbn ? "Sudah" : "Belum";
      let warnaTombolISBN = project.isbn ? "is-success" : "is-warning";

      let statusPlaybook = project.linkplaybook ? "Sudah" : "Belum";
      let warnaTombolPlaybook = project.linkplaybook ? "is-success" : "is-warning";

      let statusGramedia = project.linkgramed ? "Sudah" : "Belum";
      let warnaTombolGramedia = project.linkgramed ? "is-success" : "is-warning";

      let statusMyEd = project.linkmyedisi ? "Sudah" : "Belum";
      let warnaTombolMyEd = project.linkmyedisi ? "is-success" : "is-warning";

      let statusKubuku = project.linkkubuku ? "Sudah" : "Belum";
      let warnaTombolKubuku = project.linkkubuku ? "is-success" : "is-warning";

      let statusDepositPerpusnas = project.linkdepositperpusnas ? "Sudah" : "Belum";
      let warnaTombolDepositPerpusnas = project.linkdepositperpusnas ? "is-success" : "is-warning";

      let statusDepositPerpusda = project.linkdepositperpusda ? "Sudah" : "Belum";
      let warnaTombolDepositPerpusda = project.linkdepositperpusda ? "is-success" : "is-warning";


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
                              Update Katalog
                            </button><br>
                            <a href="${project.pathkatalog ?? ""}" target="_blank">Kunjungi Katalog</a>
                            </button><br>
                            <button class="button is-link statusButton" data-project-id="${project._id}" data-project-name="${project.name}">
                              Status
                            </button>
                            <ul style="list-style-type:none; padding-left:0;">
                              <li>
                                1. Nomor ISBN
                                <button class="button ${warnaTombolISBN}" style="padding: 4px 10px; font-size: 12px;" data-project-id="${project._id}" data-project-name="${project.name}">
                                  ${statusISBN}
                                </button>
                              </li>
                              <li>
                                2. Link Play book
                                <button class="button ${warnaTombolPlaybook}" style="padding: 4px 10px; font-size: 12px;" data-project-id="${project._id}" data-project-name="${project.name}">
                                  ${statusPlaybook}
                                </button>
                              </li>
                              <li>
                                3. Link Gramedia
                                <button class="button ${warnaTombolGramedia}" style="padding: 4px 10px; font-size: 12px;" data-project-id="${project._id}" data-project-name="${project.name}">
                                  ${statusGramedia}
                                </button>
                              </li>
                              <li>
                                4. Link MyEdisi
                                <button class="button ${warnaTombolMyEd}" style="padding: 4px 10px; font-size: 12px;" data-project-id="${project._id}" data-project-name="${project.name}">
                                  ${statusMyEd}
                                </button>
                              </li>
                              <li>
                                5. Link Kubuku
                                <button class="button ${warnaTombolKubuku}" style="padding: 4px 10px; font-size: 12px;" data-project-id="${project._id}" data-project-name="${project.name}">
                                  ${statusKubuku}
                                </button>
                              </li>
                              <li>
                                6. Nomor Resi Pengiriman Perpusnas
                                <button class="button ${warnaTombolDepositPerpusnas}" style="padding: 4px 10px; font-size: 12px;" data-project-id="${project._id}" data-project-name="${project.name}">
                                  ${statusDepositPerpusnas}
                                </button>
                              </li>
                              <li>
                                7. Nomor Resi Pengiriman Perpusda
                                <button class="button ${warnaTombolDepositPerpusda}" style="padding: 4px 10px; font-size: 12px;" data-project-id="${project._id}" data-project-name="${project.name}">
                                  ${statusDepositPerpusda}
                                </button>
                              </li>
                            </ul>
                </td>
                <td class="code-box">

                    <ul style="list-style-type:none; padding-left:0;">
                          <li>
                              1. Perjanjian Kerjasama(tidak wajib/opsional)
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
                              <a href="${linkskt}" target="_blank">3. Surat Penyerahan Karya Terbitan(SKT) Elektronik</a>
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
                  <br>
                  <span class="tag ${project.isapproved ? 'is-success' : 'is-danger'}">${project.isapproved ? 'Sudah Di Approve' : 'Belum di Approve'}</span>
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

     // Menambahkan event listener untuk tombol "Status"
    document.querySelectorAll('.statusButton').forEach(button => {
      button.addEventListener('click', function() {
        const projectId = this.getAttribute('data-project-id');
        const projectName = this.getAttribute('data-project-name');

        // Mencari project berdasarkan ID
        const project = result.data.find(p => p._id === projectId);

        // Menampilkan modal dengan status masing-masing
        Swal.fire({
          title: `Status untuk Project: ${projectName}`,
          html: `
            <p>1. ISBN: ${project.isbn ? "Sudah" : "Belum"}</p>
            <p>2. Link Playbook: ${project.linkplaybook ? "Sudah" : "Belum"}</p>
            <p>3. Link Gramedia: ${project.linkgramed ? "Sudah" : "Belum"}</p>
            <p>4. Link MyEd: ${project.linkmyedisi ? "Sudah" : "Belum"}</p>
            <p>5. Link Kubuku: ${project.linkkubuku ? "Sudah" : "Belum"}</p>
            <p>6. Link Deposit Perpusnas: ${project.linkdepositperpusnas ? "Sudah" : "Belum"}</p>
            <p>7. Link Deposit Perpusda: ${project.linkdepositperpusda ? "Sudah" : "Belum"}</p>
          `,
          icon: 'info',
          confirmButtonText: 'Tutup'
        });
      });
    });

  } else {
    Swal.fire({
      icon: "error",
      title: result.data.status,
      text: result.data.response,
    });
  }
}





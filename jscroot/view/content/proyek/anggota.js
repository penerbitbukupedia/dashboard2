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


    document.querySelectorAll('.statusButton').forEach(button => {
      button.addEventListener('click', function() {
        const projectId = this.getAttribute('data-project-id');
        const projectName = this.getAttribute('data-project-name');
        const project = result.data.find(p => p._id === projectId);
        Swal.fire({
          title: `Status untuk Project: ${projectName}`,
          html: `
                <div>
                  <table style="width: 100%; border-collapse: collapse; text-align: left;">
                    <tr>
                      <td style="padding: 8px; width: 50%; white-space: nowrap;">1. Nomor ISBN:</td>
                      <td style="padding: 8px; text-align: right;">
                        <button class="button ${project.isbn ? 'is-success' : 'is-warning'}" style="padding: 5px 10px;">
                          ${project.isbn ? 'Sudah' : 'Belum'}
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; white-space: nowrap;">2. Link Playbook:</td>
                      <td style="padding: 8px; text-align: right;">
                        <button class="button ${project.linkplaybook ? 'is-success' : 'is-warning'}" style="padding: 5px 10px;">
                          ${project.linkplaybook ? 'Sudah' : 'Belum'}
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; white-space: nowrap;">3. Link Gramedia:</td>
                      <td style="padding: 8px; text-align: right;">
                        <button class="button ${project.linkgramed ? 'is-success' : 'is-warning'}" style="padding: 5px 10px;">
                          ${project.linkgramed ? 'Sudah' : 'Belum'}
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; white-space: nowrap;">4. Link MyEdisi:</td>
                      <td style="padding: 8px; text-align: right;">
                        <button class="button ${project.linkmyedisi ? 'is-success' : 'is-warning'}" style="padding: 5px 10px;">
                          ${project.linkmyedisi ? 'Sudah' : 'Belum'}
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; white-space: nowrap;">5. Link Kubuku:</td>
                      <td style="padding: 8px; text-align: right;">
                        <button class="button ${project.linkkubuku ? 'is-success' : 'is-warning'}" style="padding: 5px 10px;">
                          ${project.linkkubuku ? 'Sudah' : 'Belum'}
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; white-space: nowrap;">6. Nomor Resi Pengiriman Perpusnas:</td>
                      <td style="padding: 8px; text-align: right;">
                        <button class="button ${project.linkdepositperpusnas ? 'is-success' : 'is-warning'}" style="padding: 5px 10px;">
                          ${project.linkdepositperpusnas ? 'Sudah' : 'Belum'}
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px; white-space: nowrap;">7. Nomor Resi Pengiriman Perpusda:</td>
                      <td style="padding: 8px; text-align: right;">
                        <button class="button ${project.linkdepositperpusda ? 'is-success' : 'is-warning'}" style="padding: 5px 10px;">
                          ${project.linkdepositperpusda ? 'Sudah' : 'Belum'}
                        </button>
                      </td>
                    </tr>
                  </table>
                </div>
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





import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import {validateUserName} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.8/validate.js";
import {onInput} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.8/element.js";

export async function approvalButton(event){
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
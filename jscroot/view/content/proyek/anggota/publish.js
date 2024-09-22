import { id, backend } from "/dashboard/jscroot/url/config.js";
import {postJSON} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.7/api.js";
import {getCookie} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.7/cookie.js";

// Function to add event listeners to addMemberButtons
export function publishButtonListeners() {
    document.querySelectorAll(".publishButton").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const projectId = button.getAttribute("data-project-id");
        const idprjusr={
          _id:projectId
        }
        postJSON(
          backend.project.katalogbuku,
          "login",
          getCookie("login"),
          idprjusr,
          postpublishFunction
        );
      });
    });
  }


function postpublishFunction(result) {
    if (result.status === 200) {
      const katakata =
        "Berhasil publish katalog " + result.data.title;
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text:
          "Selamat kak proyek " +
          result.data.name +
          " dengan ID: " +
          result.data.pathkatalog +
          " sudah update konten baru",
        footer:
          '<a href="https://wa.me/62895601060000?text=' +
          katakata +
          '" target="_blank">Verifikasi Proyek</a>',
        didClose: () => {
          //reloadDataTable();
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
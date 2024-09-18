// Function to add event listeners to addMemberButtons
export function publishButtonListeners() {
    document.querySelectorAll(".publishButton").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const projectId = button.getAttribute("data-project-id");
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
            postpublishFunction
          );
        }
      });
    });
  }


function postpublishFunction(result) {
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
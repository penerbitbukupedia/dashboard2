//lib call
import {folderPath} from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";
//please always use trailing slash(/) for folder or extension for file.
//never use slash in front of file or directory
//u might change croot parameter based on your path

const baseURL="https://asia-southeast2-awangga.cloudfunctions.net/bukupedia"

export const backend={
    user:{
        data:baseURL+"/data/user",
        todo:baseURL+"/data/user/task/todo",
        doing:baseURL+"/data/user/task/doing",
        done:baseURL+"/data/user/task/done",
    },
    wa:{
        text:"https://api.wa.my.id/api/v2/send/message/text",
        device:"https://api.wa.my.id/api/device/",
    },
    project:{
        data:baseURL+"/data/proyek",
        approved:baseURL+"/data/proyek/approved",
        anggota:baseURL+"/data/proyek/anggota",
        editor:baseURL+"/data/proyek/editor",
        coverbuku:baseURL+"/upload/coverbuku/",
        metadatabuku:baseURL+"/data/metadatabuku",
        publishbuku:baseURL+"/data/proyek/publishbuku",
        draftbuku:baseURL+"/upload/draftbuku/",
        draftpdfbuku:baseURL+"/upload/draftpdfbuku/",
        sampulpdfbuku:baseURL+"/upload/sampulpdfbuku/",
        spk:baseURL+"/upload/spk/",
        spi:baseURL+"/upload/spi/",
        downloaddraft:baseURL+"/download/draft/",
        katalogbuku:baseURL+"/data/proyek/katalog",
        downloadspi:baseURL+"/download/dokped/spi/",
        downloadspk:baseURL+"/download/dokped/spk/",
    },
    ux:{
        feedback:baseURL+"/notif/ux/postfeedback",
        laporan:baseURL+"/notif/ux/postlaporan",
        rating:baseURL+"/notif/ux/rating",
        meeting:baseURL+"/notif/ux/postmeeting",
    }
}

export const croot = folderPath()+"jscroot/";

export const folder={
    template:croot+"template/",
    controller : croot+"controller/",
    view : croot+"view/",
}

export const url={
    template:{
        content : folder.template+"content/",
        header: folder.template+"header.html",
        navbar:folder.template+"navbar.html" ,
        settings:folder.template+"settings.html" ,
        sidebar:folder.template+"sidebar.html" ,
        footer:folder.template+"footer.html", 
        rightbar:folder.template+"rightbar.html"
    },
    controller:{
        content : folder.controller+"content/",
        main : folder.controller+"main.js",
        navbar : folder.controller+"navbar.js"
    },
    view : {
        content:folder.view+"content/",
        header: folder.view+"header.js",
        search:folder.view+"search.js" ,
        settings:folder.view+"settings.js" ,
        navbar:folder.view+"navbar.js" ,
        footer:folder.view+"footer.js" 
    }
}

export const id={
    header:"header__container",
    navbar:"navbar",
    content:"content"
}
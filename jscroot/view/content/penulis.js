import {id} from '../../url/config.js';
import {addCSSIn} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";

export async function main(){
    await addCSSIn("assets/css/penuis.css",id.content);
}
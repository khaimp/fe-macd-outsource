import { _URL } from "./const"
export const getData = () => fetch(_URL, {
     method: "POST",
}).then(response => response.json())

export const getDetailCoin = (symbol) => {
     const form_data = new FormData()
     form_data.append("symbol", symbol)
     return fetch(_URL, {
          method: "POST",
          body: form_data,
          redirect: "follow",
     }).then(response => response.json())
}

export function getStatus(status, id) {
     const idx = this.data_table.findIndex((item) => item.id == id);
     if (idx > -1) {
          if (status == true) {
               return "changed";
          }
     }
     return "normal";
}
export function getColor(color_val) {
     if (Number(color_val) >= 0) {
          return "color-green";
     } else {
          return "color-red";
     }
}
export function getRsiColor(color_val) {
     if (Number(color_val) > 70) {
          return "color-green";
     } else if (Number(color_val) < 30) {
          return "color-red";
     } else {
          return "color-orange";
     }
}
export function getSrc(src) {
     return (
          "https://quantifycrypto.s3-us-west-2.amazonaws.com/pictures/crypto-img/32/icon/" +
          src.toLowerCase() +
          ".png"
     );
}
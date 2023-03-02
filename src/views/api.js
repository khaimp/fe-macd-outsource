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
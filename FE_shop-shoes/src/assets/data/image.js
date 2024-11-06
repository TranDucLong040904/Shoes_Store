import { Buffer } from "buffer";

export function getBase64(file) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export const convertBase64ToImage = (base64) => {
  let image = new Buffer(base64 || "", "base64").toString("utf-8");
  return image;
};

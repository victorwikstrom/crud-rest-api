import ResErr from "./resErr.js";
import fs from "fs";
import "express-async-errors";

export const readJsonData = async (filePath) => {
  return new Promise((resolve) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        throw new ResErr(500, `Something went wrong reading the file...`);
      }
      resolve(data);
    });
  });
};

export const writeJsonData = async (filePath, data) => {
  fs.writeFile(filePath, JSON.stringify(data), (err) => {
    if (err) {
      throw new ResErr(500, `Something went wrong writing the file...`);
    }
  });
};

export const getNewId = (list) => {
  let newId = 0;
  list.forEach((o) => {
    if (Number(o.id) >= newId) {
      newId = o.id;
    }
  });
  newId++;
  return newId;
};

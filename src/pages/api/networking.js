
import axios from 'axios';123456


var baseURL = 'http://192.168.2.97:3001/api/'

const axios_mysql = axios.create({
  baseURL: baseURL,
  headers: { "Access-Control-Allow-Origin": "*", 'Access-Control-Allow-Credentials': true },
  timeout: 5000,
  withCredentials: true,
  crossDomain: true
});

async function getAllFingerPrint() {
  const res = await axios_mysql.get(`fingerprint-manager/all`)
  if (res.data.result.status === 'success') {
    return res.data.result.data;
  }
  else {
    return null;
  }
}

async function getFingerPrintById(id) {
  const res = await axios_mysql.get(`fingerprint-manager/get-by-id/${id}`)
  if (res.data.result.status === 'success') {
    return res.data.result.data;
  }
  else {
    return null;
  }
}

async function updateFingerPrint(data) {
  const res = await axios_mysql.put(`fingerprint-manager/update/`, data)
  if (res.data.result.status === 'success') {
      return true
  }
  else {
      return false
  }
}

async function getAllHistory() {
  const res = await axios_mysql.get(`history/all`)
  if (res.data.result.status === 'success') {
    return res.data.result.data;
  }
  else {
    return null;
  }
}

async function addHistory(data) {
  const res = await axios_mysql.post(`history/add`, data)
  if (res.data.result.status === 'success') {
    return true;
  }
  else {
    return false;
  }
}

async function filterHistory(data) {
  let url = `history/filter/${data.from}/${data.to}/${data.sort}`;
  if(data.name){
    if(data.name.length > 0){
      url = `history/filter/${data.name}/${data.from}/${data.to}/${data.sort}`;
    }
  }
  const res = await axios_mysql.get(url);
  if (res.data.result.status === 'success') {
    return res.data.result.data;
  }
  else {
    return null;
  }
}

export {
  getAllFingerPrint,
  getFingerPrintById,
  updateFingerPrint,
  getAllHistory,
  addHistory,
  filterHistory
}
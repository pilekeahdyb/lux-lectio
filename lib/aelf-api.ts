import axios from "axios";

export async function fetchAelfOffice(type: string, date?: string) {
  const targetDate = date || new Date().toISOString().slice(0, 10);
  const url = `https://api.aelf.org/v1/office/${type}/${targetDate}/france`;
  const response = await axios.get(url);
  return response.data;
}

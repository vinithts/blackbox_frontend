import React, { useState } from "react";
import { Form } from "react-bootstrap";
import * as XLSX from "xlsx";
import { instance } from "../Api";
import { toast } from "react-toastify";
import Loading from "./Loading";

const Upload = () => {
  const columnNames = [
    "Portfolio Name",
    "Leg ID",
    "Exchange",
    "Exchange Symbol",
    "Product",
    "Order Type",
    "Order ID",
    "Time",
    "Txn",
    "Qty",
    "Filled Qty",
    "Exchg Time",
    "Avg Price",
    "Status",
    "Limit Price",
    "Order Failed",
    "User ID",
    "User Alias",
    "Remarks",
    "Tag",
    "B/S MTM",
    "NETP&L",
    "TAG",
  ];
  const [loading, setLoading] = useState(false);
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    setLoading(true);
    reader.onload = async (event) => {
      const binaryString = event.target.result;
      const workBook = XLSX.read(binaryString, { type: "binary" });
      const sheetName = workBook.SheetNames[0];
      const sheet = workBook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      function ensureMandatoryKeys(obj) {
        for (const columnName of columnNames) {
          if (!obj.hasOwnProperty(columnName)) {
            obj[columnName] = "-";
          }
        }
      }

      for (const obj of jsonData) {
        ensureMandatoryKeys(obj);
      }
      // console.log(jsonData);

      try {
        const response = await instance.post(`/api/uploadFilesLedger`, {
          data: jsonData,
        });
        if (response.status === 200) {
          // getUploadFilesLedger();
          toast.success("Uploaded Successfully !", {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: "foo-bar",
          });
          setLoading(false);
        }

        // console.log(response);
      } catch (e) {
        console.log(e);
        toast.error("Something went to wrong !", {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: "foo-bar",
        });
      }
    };

    if (file) {
      reader.readAsBinaryString(file);
    }
  };
  return (
    <div>
      {loading && <Loading />}
      <Form.Group controlId="formFile">
        <Form.Label style={{ color: "gray", fontWeight: "600" }}>
          Upload csv,xlsx
        </Form.Label>
        <Form.Control
          type="file"
          accept=".xls,.xlsx,.csv"
          onChange={handleFileChange}
        />
      </Form.Group>
    </div>
  );
};

export default Upload;

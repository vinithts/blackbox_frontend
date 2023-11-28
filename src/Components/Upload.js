import React, { useState } from "react";
import { Form } from "react-bootstrap";
import * as XLSX from "xlsx";
import { instance } from "../Api";
import { toast } from "react-toastify";
import Loading from "./Loading";

const Upload = () => {

  const [loading, setLoading] = useState(false);
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
      try {
        const response = await instance.post(`/api/tradeFile`, {
          file: file,
        }, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.status === 200) {
          toast.success("Uploaded Successfully !", {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: "foo-bar",
          });
          setLoading(false);
        }
      } catch (e) {
        console.log(e);
        toast.error("Something went to wrong !", {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: "foo-bar",
        });
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

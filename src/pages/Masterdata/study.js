// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Modal } from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { use } from "i18next";

function Study() {
  const [modal_standard, setmodal_standard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [protocols, setProtocols] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://52.8.28.154:8005/api/protocols", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        // setData(result);
        console.log(result);
        const protocolsData = result.map((item) => item.protocols[0]);
        setProtocols(protocolsData);
        console.log(protocolsData);
      } else {
        setError(`Error: ${response.statusText}`);
      }
    } catch (error) {
      setError(`Network Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  function tog_standard() {
    setmodal_standard(!modal_standard);
    removeBodyCss();
  }
  function removeBodyCss() {
    document.body.classList.add("no_padding");
  }
  const [Data, setData] = useState({
    protocol_id: "",
    title: "",
    protocol_summary: "",
    version: 1,
    date: "",
    created_by_id: 2,
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setData({ ...Data, [name]: value });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted Data", Data);
    fetch("http://52.8.28.154:8005/api/protocols", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Data),
    })
      .then((response) => {
        console.log(response);

        setmodal_standard(false);
        fetchData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="row">
        <div className="col-md-9">
          <h5 className="r-red-text mb-3 d-block d-sm-none">
            Study Design Phase
          </h5>
        </div>
        <div className="col-md-3">
          <button
            type="button"
            className="btn btn-warning waves-effect btn-label waves-light r-red pull-Right float-end"
            data-bs-toggle="modal"
            data-bs-target=".bs-example-modal-lg2"
            onClick={() => {
              tog_standard();
            }}
          >
            <i className="bx bx-plus label-icon"></i> Add Study Design Phase
          </button>
        </div>
      </div>
      <hr className="mb-4" width="100%"></hr>
      <div
        id="datatable_wrapper"
        className="dataTables_wrapper dt-bootstrap4 no-footer"
      >
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <div className="dataTables_length" id="datatable_length">
              <label>
                Show{" "}
                <select
                  name="datatable_length"
                  aria-controls="datatable"
                  className="custom-select custom-select-sm form-control form-control-sm"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>{" "}
                entries
              </label>
            </div>
          </div>
          <div className="col-sm-12 col-md-6">
            <div id="datatable_filter" className="dataTables_filter">
              <label>
                Search:
                <input
                  type="search"
                  className="form-control form-control-sm"
                  placeholder=""
                  aria-controls="datatable"
                />
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <table
              id="datatable"
              className="table table-bordered mb-0 table-responsive"
              role="grid"
              aria-describedby="datatable_info"
            >
              <thead className="table-light">
                <tr role="row">
                  <th
                    className="sorting_asc"
                    tabIndex="0"
                    aria-controls="datatable"
                    rowspan="1"
                    colspan="1"
                    aria-sort="ascending"
                    aria-label="Study Design : activate to sort column descending"
                  >
                    Protocol ID
                  </th>
                  <th
                    className="sorting"
                    tabIndex="0"
                    aria-controls="datatable"
                    rowspan="1"
                    colspan="1"
                    aria-label="Description: activate to sort column ascending"
                  >
                    Title
                  </th>
                  <th
                    className="sorting"
                    tabIndex="0"
                    aria-controls="datatable"
                    rowspan="1"
                    colspan="1"
                    aria-label="Description: activate to sort column ascending"
                  >
                    Protocol Summary
                  </th>
                  <th
                    className="sorting"
                    tabIndex="0"
                    aria-controls="datatable"
                    rowspan="1"
                    colspan="1"
                    aria-label="Description: activate to sort column ascending"
                  >
                    Version
                  </th>
                  <th
                    className="sorting"
                    tabIndex="0"
                    aria-controls="datatable"
                    rowspan="1"
                    colspan="1"
                    aria-label="Description: activate to sort column ascending"
                  >
                    Date
                  </th>
                  <th
                    className="sorting"
                    tabIndex="0"
                    aria-controls="datatable"
                    rowspan="1"
                    colspan="1"
                    aria-label="Description: activate to sort column ascending"
                  >
                    Status
                  </th>
                  <th
                    className="sorting"
                    tabIndex="0"
                    aria-controls="datatable"
                    rowspan="1"
                    colspan="1"
                    aria-label="Actions: activate to sort column ascending"
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {protocols.map((protocol, index) => (
                  <tr key={index}>
                    <td>{protocol.protocol_id}</td>
                    <td>{protocol.title}</td>
                    <td>{protocol.protocol_summary}</td>
                    <td>{protocol.version}</td>
                    <td>{protocol.date}</td>
                    <td>{protocol.protocol_status_value}</td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-5">
            <div
              className="dataTables_info"
              id="datatable_info"
              role="status"
              aria-live="polite"
            >
              Showing 1 to 1 of 1 entries
            </div>
          </div>
          <div className="col-sm-12 col-md-7">
            <div
              className="dataTables_paginate paging_simple_numbers"
              id="datatable_paginate"
            >
              <ul className="pagination">
                <li
                  className="paginate_button page-item previous disabled"
                  id="datatable_previous"
                >
                  <a
                    href="/"
                    aria-controls="datatable"
                    data-dt-idx="0"
                    tabIndex="0"
                    className="page-link"
                  >
                    Previous
                  </a>
                </li>
                <li className="paginate_button page-item active">
                  <a
                    href="/"
                    aria-controls="datatable"
                    data-dt-idx="1"
                    tabIndex="0"
                    className="page-link"
                  >
                    1
                  </a>
                </li>
                <li
                  className="paginate_button page-item next disabled"
                  id="datatable_next"
                >
                  <a
                    href="/"
                    aria-controls="datatable"
                    data-dt-idx="2"
                    tabIndex="0"
                    className="page-link"
                  >
                    Next
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Modal
        size="lg"
        isOpen={modal_standard}
        toggle={() => {
          tog_standard();
        }}
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0" id="myModalLabel">
            Modal Heading
          </h5>
          <button
            type="button"
            onClick={() => {
              setmodal_standard(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div class="modal-body">
            <form>
              <div class="row mt-4 mb-4">
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">
                      Protocol ID<span class="mandotary"> *</span>
                    </label>
                    <input
                      onChange={handleChange}
                      type="text"
                      class="form-control"
                      id=""
                      name="protocol_id"
                      value={Data.id}
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">
                      Title<span class="mandotary"> *</span>
                    </label>
                    <input
                      onChange={handleChange}
                      type="text"
                      class="form-control"
                      id=""
                      name="title"
                      value={Data.title}
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">
                      Protocol Summary<span class="mandotary"> *</span>
                    </label>
                    <input
                      onChange={handleChange}
                      type="text"
                      class="form-control"
                      id=""
                      name="protocol_summary"
                      value={Data.summary}
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">
                      Version<span class="mandotary"> *</span>
                    </label>
                    <input
                      onChange={handleChange}
                      type="number"
                      class="form-control"
                      id=""
                      name="version"
                      value={Data.version}
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">
                      Date<span class="mandotary"> *</span>
                    </label>
                    <input
                      onChange={handleChange}
                      type="date"
                      class="form-control"
                      id=""
                      name="date"
                      value={Data.date}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              onClick={() => {
                tog_standard();
              }}
              className="btn btn-secondary "
              data-dismiss="modal"
            >
              Close
            </button>
            <button type="submit" className="btn btn-primary ">
              Save changes
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default Study;

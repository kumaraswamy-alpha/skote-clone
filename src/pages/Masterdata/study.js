import React, { useState, useEffect } from "react"
import { Modal } from "reactstrap"
import { version } from "toastr"

function Study() {
  const [modal_standard, setmodal_standard] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [protocols, setProtocols] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({
    key: "protocol_id",
    direction: "ascending",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const fetchData = async () => {
    try {
      const response = await fetch("http://52.8.28.154:8005/api/protocols", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const result = await response.json()
        const protocolsData = result.map(item => item.protocols[0])
        setProtocols(protocolsData)
      } else {
        setError(`Error: ${response.statusText}`)
      }
    } catch (error) {
      setError(`Network Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  function tog_standard() {
    setmodal_standard(!modal_standard)
    removeBodyCss()
  }

  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }

  const [Data, setData] = useState({
    protocol_id: "",
    title: "",
    protocol_summary: "",
    version: 1,
    date: "",
    created_by_id: 2,
  })

  function handleChange(e) {
    const { name, value } = e.target
    setData({ ...Data, [name]: value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    fetch("http://52.8.28.154:8005/api/protocols", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Data),
    })
      .then(response => {
        setmodal_standard(false)
        fetchData()
      })
      .catch(error => {
        console.log(error)
      })
  }

  const handleSearchChange = e => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleSort = key => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const generateSortingIndicator = key => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? (
        <i className="fas fa-sort-up"></i>
      ) : (
        <i className="fas fa-sort-down"></i>
      )
    }
    return <i className="fas fa-sort"></i>
  }

  const sortedProtocols = protocols.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1
    }
    return 0
  })
  function editProtocol(data) {
    console.log(data)
    tog_standard()
  }
  function deleteProtocol(data) {
    console.log(data)
    tog_standard()
  }
  const filteredProtocols = protocols.filter(protocol => {
    const {
      title,
      protocol_id,
      date,
      protocol_status_value,
      protocol_summary,
      version,
    } = protocol
    const lowerSearchTerm = searchTerm
    return (
      title.toLowerCase().includes(lowerSearchTerm.toLowerCase()) ||
      version
        .toString()
        .toLowerCase()
        .includes(lowerSearchTerm.toLowerCase()) ||
      protocol_id.toLowerCase().includes(lowerSearchTerm.toLowerCase()) ||
      date.toString().includes(lowerSearchTerm.toString()) ||
      protocol_status_value
        .toLowerCase()
        .includes(lowerSearchTerm.toLowerCase()) ||
      protocol_summary.toLowerCase().includes(lowerSearchTerm.toLowerCase())
    )
  })

  const paginatedProtocols = filteredProtocols.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredProtocols.length / itemsPerPage)

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
            onClick={tog_standard}
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
                  value={itemsPerPage}
                  onChange={e => setItemsPerPage(Number(e.target.value))}
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
                  value={searchTerm}
                  onChange={handleSearchChange}
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
                    className={`sorting ${
                      sortConfig.key === "protocol_id"
                        ? sortConfig.direction === "ascending"
                          ? "sorting_asc"
                          : "sorting_desc"
                        : ""
                    }`}
                    onClick={() => handleSort("protocol_id")}
                  >
                    <div className="cursor-pointer select-none">
                      Protocol ID {generateSortingIndicator("protocol_id")}
                    </div>
                  </th>
                  <th
                    className={`sorting ${
                      sortConfig.key === "title"
                        ? sortConfig.direction === "ascending"
                          ? "sorting_asc"
                          : "sorting_desc"
                        : ""
                    }`}
                    onClick={() => handleSort("title")}
                  >
                    <div className="cursor-pointer select-none">
                      Title {generateSortingIndicator("title")}
                    </div>
                  </th>
                  <th
                    className={`sorting ${
                      sortConfig.key === "protocol_summary"
                        ? sortConfig.direction === "ascending"
                          ? "sorting_asc"
                          : "sorting_desc"
                        : ""
                    }`}
                    onClick={() => handleSort("protocol_summary")}
                  >
                    <div className="cursor-pointer select-none">
                      Protocol Summary{" "}
                      {generateSortingIndicator("protocol_summary")}
                    </div>
                  </th>
                  <th
                    className={`sorting ${
                      sortConfig.key === "version"
                        ? sortConfig.direction === "ascending"
                          ? "sorting_asc"
                          : "sorting_desc"
                        : ""
                    }`}
                    onClick={() => handleSort("version")}
                  >
                    <div className="cursor-pointer select-none">
                      Version {generateSortingIndicator("version")}
                    </div>
                  </th>
                  <th
                    className={`sorting ${
                      sortConfig.key === "date"
                        ? sortConfig.direction === "ascending"
                          ? "sorting_asc"
                          : "sorting_desc"
                        : ""
                    }`}
                    onClick={() => handleSort("date")}
                  >
                    <div className="cursor-pointer select-none">
                      Date {generateSortingIndicator("date")}
                    </div>
                  </th>
                  <th
                    className={`sorting ${
                      sortConfig.key === "protocol_status_value"
                        ? sortConfig.direction === "ascending"
                          ? "sorting_asc"
                          : "sorting_desc"
                        : ""
                    }`}
                    onClick={() => handleSort("protocol_status_value")}
                  >
                    <div className="cursor-pointer select-none">
                      Status {generateSortingIndicator("protocol_status_value")}
                    </div>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProtocols.map((protocol, index) => (
                  <tr key={index}>
                    <td>{protocol.protocol_id}</td>
                    <td>{protocol.title}</td>
                    <td>{protocol.protocol_summary}</td>
                    <td>{protocol.version}</td>
                    <td>{protocol.date}</td>
                    <td>{protocol.protocol_status_value}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => editProtocol(protocol)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteProtocol(protocol.protocol_id)}
                      >
                        Delete
                      </button>
                    </td>
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
              Showing{" "}
              {Math.min(
                (currentPage - 1) * itemsPerPage + 1,
                filteredProtocols.length
              )}{" "}
              to{" "}
              {Math.min(currentPage * itemsPerPage, filteredProtocols.length)}{" "}
              of {filteredProtocols.length} entries
            </div>
          </div>
          <div className="col-sm-12 col-md-7">
            <div
              className="dataTables_paginate paging_simple_numbers"
              id="datatable_paginate"
            >
              <ul className="pagination">
                <li
                  className={`paginate_button page-item previous ${
                    currentPage === 1 ? "disabled" : ""
                  }`}
                  onClick={() =>
                    currentPage > 1 && setCurrentPage(currentPage - 1)
                  }
                >
                  <a
                    href="#"
                    aria-controls="datatable"
                    data-dt-idx="0"
                    tabIndex="0"
                    className="page-link"
                  >
                    Previous
                  </a>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li
                    key={i}
                    className={`paginate_button page-item ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    <a
                      href="#"
                      aria-controls="datatable"
                      data-dt-idx={i + 1}
                      tabIndex="0"
                      className="page-link"
                    >
                      {i + 1}
                    </a>
                  </li>
                ))}
                <li
                  className={`paginate_button page-item next ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                  }
                >
                  <a
                    href="#"
                    aria-controls="datatable"
                    data-dt-idx="7"
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

      <Modal size="lg" isOpen={modal_standard} toggle={tog_standard}>
        <div className="modal-header">
          <h5 className="modal-title mt-0" id="myModalLabel">
            Modal Heading
          </h5>
          <button
            type="button"
            onClick={() => setmodal_standard(false)}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="row mt-4 mb-4">
              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">
                    Protocol ID<span className="mandatory"> *</span>
                  </label>
                  <input
                    onChange={handleChange}
                    type="text"
                    className="form-control"
                    id=""
                    name="protocol_id"
                    value={Data.protocol_id}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">
                    Title<span className="mandatory"> *</span>
                  </label>
                  <input
                    onChange={handleChange}
                    type="text"
                    className="form-control"
                    id=""
                    name="title"
                    value={Data.title}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">
                    Protocol Summary<span className="mandatory"> *</span>
                  </label>
                  <input
                    onChange={handleChange}
                    type="text"
                    className="form-control"
                    id=""
                    name="protocol_summary"
                    value={Data.protocol_summary}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">
                    Version<span className="mandatory"> *</span>
                  </label>
                  <input
                    onChange={handleChange}
                    type="number"
                    className="form-control"
                    id=""
                    name="version"
                    value={Data.version}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <label className="form-label">
                    Date<span className="mandatory"> *</span>
                  </label>
                  <input
                    onChange={handleChange}
                    type="date"
                    className="form-control"
                    id=""
                    name="date"
                    value={Data.date}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              onClick={tog_standard}
              className="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
            <button type="submit" className="btn btn-primary">
              Save changes
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default Study

// @ts-nocheck
import React from "react";
import Study from "./study";
const Masterdata = function masterdata() {
  console.log("====================================");
  console.log();
  console.log("====================================");
  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 col">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 className="mb-sm-0 font-size-18">MasterData</h4>
                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <a href="/dashboard">MasterData</a>
                    </li>
                    <li className="active breadcrumb-item" aria-current="page">
                      <a href="/dashboard">MasterData</a>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <Study />
          </div>
        </div>
      </div>
    </>
  );
};

export default Masterdata;

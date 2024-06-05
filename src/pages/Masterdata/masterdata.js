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
            <div class="col-12 col">
              <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 class="mb-sm-0 font-size-18">MasterData</h4>
                <div class="page-title-right">
                  <ol class="breadcrumb m-0">
                    <li class="breadcrumb-item">
                      <a href="/dashboard">MasterData</a>
                    </li>
                    <li class="active breadcrumb-item" aria-current="page">
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

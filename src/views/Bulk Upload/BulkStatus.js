/*
Copyright (c) 2018 Qualcomm Technologies, Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted (subject to the limitations in the disclaimer below) provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Qualcomm Technologies, Inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS LICENSE. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import React, { Component } from 'react';
import {downloadBulkFile, getAuthHeader} from '../../utilities/helpers'
import i18n from "i18next";

/**
 *Bulk Status component
 */
class BulkStatus extends Component {
  constructor(props) {
    super(props);
    this.updateTokenHOC = this.updateTokenHOC.bind(this)
  }
  /**
   * HOC function to update token
   * @param callingFunc
   */
  updateTokenHOC(callingFunc, param1, param2) {
    let config = null;
    if (this.props.kc.isTokenExpired(0)) {
      this.props.kc.updateToken(0)
        .success(() => {
          localStorage.setItem('token', this.props.kc.token)
          config = {
            headers: getAuthHeader(this.props.kc.token)
          }
          callingFunc(config, param1, param2);
        })
        .error(() => this.props.kc.logout());
    } else {
      config = {
        headers: getAuthHeader()
      }
      callingFunc(config, param1, param2);
    }
  }
  render() {
    const { details } = this.props.location.state;
    return (
      <div>
        <div className="submitted">
          <div className="icon-box">
            <i className={details.icon}></i>
          </div>
            <h4>{i18n.t('fileHasBeen')} <span>{i18n.t('uploaded')}</span> {i18n.t('successfully')}.</h4>
          <div className="msg row justify-content-center">
            <div className="col-md-8">
              <h6 className="text-left">{i18n.t('summary')}: </h6>
              <table className="table table-bordered bulk-table">
                <tbody>
                <tr>
                  <th className="text-left">{i18n.t('total')} MSISDNs/IMSIs</th>
                  <td>{details.response.Total_Records}</td>
                </tr>
                <tr className={details.response.Deleted_Record !== 0 ? 'table-danger': ''}>
                  <th className="text-left">{i18n.t('invalid')} MSISDNs/IMSIs</th>
                  <td>{details.response.Deleted_Record} <br/>
                  {details.response.Deleted_Record !== 0 &&
                  <button className="btn-link" onClick={(e)=>{this.updateTokenHOC(downloadBulkFile,details.response.link,e)}}>{i18n.t('clickToDownload')}</button>
                  }
                  </td>
                </tr>
                <tr>
                  <th className="text-left">{i18n.t('valid')} MSISDNs/IMSIs</th>
                  <td>{details.response.Successful_Records}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default BulkStatus;

/*
Copyright (c) 2018-2019 Qualcomm Technologies, Inc.
All rights reserved.
Redistribution and use in source and binary forms, with or without modification, are permitted (subject to the limitations in the 
disclaimer below) provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer 
      in the documentation and/or other materials provided with the distribution.
    * Neither the name of Qualcomm Technologies, Inc. nor the names of its contributors may be used to endorse or promote 
      products derived from this software without specific prior written permission.
    * The origin of this software must not be misrepresented; you must not claim that you wrote the original software. If you use 
      this software in a product, an acknowledgment is required by displaying the trademark/log as per the details provided 
      here: https://www.qualcomm.com/documents/dirbs-logo-and-brand-guidelines
    * Altered source versions must be plainly marked as such, and must not be misrepresented as being the original software.
    * This notice may not be removed or altered from any source distribution.
NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS LICENSE. THIS SOFTWARE IS PROVIDED 
BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT 
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO 
EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, 
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; 
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS 
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import React, {Component} from 'react';
import {translate} from 'react-i18next';
import {Row, Col, Button, Form, Card, CardHeader, CardBody} from 'reactstrap';
import {withFormik, Field, FieldArray} from 'formik';
import {errors, instance, getAuthHeader, languageCheck} from "../../utilities/helpers";
import doubleEntryInput from '../../components/Form/DoubleEntryInput'
import renderInput from '../../components/Form/RenderInput'
import RenderSelect from '../../components/Form/RenderSelect'
import {COUNTRY_CODE} from '../../utilities/constants'
import {toast} from 'react-toastify';
import i18n from 'i18next';

export function errorClass(errors, touched, i) {
  return (errors &&
    errors.imei &&
    errors.imei[i] &&
    errors.imei[i]['imei'] &&
    touched &&
    touched.imei &&
    touched.imei[i] &&
    touched.imei[i]['imei']) ? 'is-invalid' : '';

}

class CaseForm extends Component {
  render() {
    const {
      values,
      touched,
      errors,
      isSubmitting,
      handleSubmit,
      setFieldValue,
      setFieldTouched
    } = this.props;
    return (
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12} xl={4} className="order-xl-12 mt-3">
            <div>
              <div className="alert alert-info mb-2"><b>{i18n.t('deviceImeiS')}:</b>
                <ul>
                  <li>{i18n.t('IMEIDeviceInfoOne')}
                  </li>
                  <li>{i18n.t('IMEIDeviceInfoTwo')}</li>
                </ul>
              </div>
              <div className="alert alert-info"><b> {i18n.t('macWiFiAddress')}:</b>
                <ul>
                  <li>{i18n.t('MACInfoOne')}:
                    <ul>
                      <li>A2:C9:66:F8:47:C5</li>
                      <li>A2-C9-66-F8-47-C5</li>
                      <li>A2C.966.F84.7C5</li>
                      <li>00:25:96:FF:FE:12:34:56</li>
                      <li>0025:96FF:FE12:3456</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </Col>
          <Col xs={12} xl={8} className="order-xl-1 mt-3">
            <Card>
              <CardHeader><b>{i18n.t('deviceImeiS')}</b></CardHeader>
              <CardBody>
                <div className="add-remove-wrap position-relative">
                  <FieldArray
                    name="imei"
                    render={({insert, remove, push}) => {
                      return (
                        <div>
                          {values.imei && values.imei.length > 0 && values.imei.map((imei, i) => {
                            let inputClass = errorClass(errors, touched, i);
                            let reInputClass = errorClass(errors, touched, i);
                            return (
                              <Row key={i} className="mt-3">
                                <Col xs={6}>
                                  <Field name={`imei[${i}].imei`} component={doubleEntryInput} label={i18n.t('typeImei')}
                                         type="text" placeholder={i18n.t('typeImei') + ' ' + (i + 1)} requiredStar groupClass="mb-0"
                                         inputClass={inputClass}/>
                                  {errors &&
                                  errors.imei &&
                                  errors.imei[i] &&
                                  errors.imei[i]['imei'] &&
                                  touched &&
                                  touched.imei &&
                                  touched.imei[i] &&
                                  touched.imei[i]['imei'] &&
                                  (
                                    <span className="invalid-feedback p-0"
                                          style={{display: 'block'}}>{errors.imei[i]['imei']}</span>
                                  )}
                                </Col>
                                <Col xs={6}>
                                  <div className="buttonbox">
                                    <Field name={`imei[${i}].reImei`} component={doubleEntryInput} label={i18n.t('retypeImei')}
                                           type="text" placeholder={i18n.t('retypeImei') + ' ' + (i + 1)} requiredStar
                                           groupClass="mb-0" inputClass={reInputClass}/>
                                    {errors &&
                                    errors.imei &&
                                    errors.imei[i] &&
                                    errors.imei[i]['reImei'] &&
                                    touched &&
                                    touched.imei &&
                                    touched.imei[i] &&
                                    touched.imei[i]['reImei'] &&
                                    (
                                      <span className="invalid-feedback p-0"
                                            style={{display: 'block'}}>{errors.imei[i]['reImei']}</span>
                                    )}
                                    {i !== 0 && <button
                                      type="button"
                                      className="button button-remove"
                                      onClick={() => remove(i)}
                                    ></button>}
                                  </div>
                                </Col>
                              </Row>
                            )
                          })}
                          <Button
                            type="button"
                            className={values.imei.length >= 5 ? 'btn btn-outline-primary mt-3 d-none text-capitalize' : 'btn btn-outline-primary mt-3 text-capitalize'}
                            onClick={() => push({imei: "", reImei: ""})}
                            disabled={values.imei.length >= 5}
                          >
                              {i18n.t('addImeIs')}
                          </Button>
                        </div>
                      )
                    }}
                  />
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader><b>{i18n.t('deviceIdentifiers')}</b></CardHeader>
              <CardBody>

                <Row>
                  <Col xs={12} sm={6}>
                    <Field name="serial_no" component={doubleEntryInput} label={i18n.t('serialNumber')} type="text"
                           placeholder={i18n.t('serialNumber')} requiredStar maxLength={1000}/>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Field name="retype_serial_no" component={doubleEntryInput} label={i18n.t('retypeSerialNumber')} type="text"
                           placeholder={i18n.t('retypeSerialNumber')} requiredStar maxLength={1000}/>
                  </Col>
                </Row>

                <Row>
                  <Col xs={12} sm={6}>
                    <Field name="brand" component={renderInput} label={i18n.t('brand')} type="text" placeholder={i18n.t('brand')}
                           requiredStar/>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Field name="model" component={renderInput} label={i18n.t('modelName')} type="text"
                           placeholder={i18n.t('modelName')} requiredStar/>
                  </Col>
                </Row>

                <Row>
                  <Col xs={12} sm={6}>
                    <Field name="mac" component={doubleEntryInput} label={i18n.t('macWiFiAddress')} type="text"
                           placeholder={i18n.t('macWiFiAddress')} maxLength={23} />
                  </Col>
                  <Col xs={12} sm={6}>
                    <Field name="retype_mac" component={doubleEntryInput} label={i18n.t('retypeMacWiFiAddress')} type="text"
                           placeholder={i18n.t('retypeMacWiFiAddress')} maxLength={23} />
                  </Col>
                </Row>

                <Row>
                  <Col xs={12} sm={6}>
                    <RenderSelect
                      value={values.rat}
                      onChange={setFieldValue}
                      options={[{label: '2G', value: '2G'}, {label: '3G', value: '3G'}, {
                        label: '4G',
                        value: '4G'
                      }, {label: '5G', value: '5G'}]}
                      onBlur={setFieldTouched}
                      error={errors.rat}
                      touched={touched.rat}
                      fieldName="rat"
                      label={i18n.t('radioAccessTechnologies')}
                      placeholder={i18n.t('selectTechnologies')}
                      requiredStar
                      stayOpen={true}
                      multi={true}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <Field name="contact_no" component={renderInput} label={i18n.t('referenceMsisdn')} type="text"
                           placeholder={i18n.t('referenceMsisdn')} requiredStar maxLength={15} groupClass="prefix-group"
                           prefix={COUNTRY_CODE}/>
                  </Col>
                </Row>

              </CardBody>
            </Card>
            <div className="text-right">
              <Button color="primary" type="submit" className="btn-next-prev" disabled={isSubmitting}
                      role="button">{i18n.t('submit')}</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}

const MyEnhancedForm = withFormik({
  mapPropsToValues: () => ({
    "imei": [{imei: '', reImei: ''}],
    "serial_no": "",
    "retype_serial_no": "",
    "brand": "",
    "model": "",
    "mac": "",
    "retype_mac": "",
    "rat": [],
    "contact_no": ""
  }),

  // Custom sync validation
  validate: values => {
    let errors = {};
    let imei = [];
    if (values.imei.length > 0) {
      for (let i = 0; i < values.imei.length; i++) {
        if (typeof errors.imei === "undefined") {
          errors.imei = [];
        }
        if (typeof errors.imei[i] === "undefined") {
          errors.imei[i] = {};
        }


        if (!values.imei[i].imei) {
          errors.imei[i].imei = i18n.t('validation.thisFieldIsRequired')
        } else if (!/^(?=.[A-F]*)(?=.[0-9]*)[A-F0-9]{14,16}$/.test(values.imei[i].imei)) {
          errors.imei[i].imei = i18n.t('validation.imeiMustContain')
        }

        if (!values.imei[i].reImei) {
          errors.imei[i].reImei = i18n.t('validation.thisFieldIsRequired')
        } else if (!/^(?=.[A-F]*)(?=.[0-9]*)[A-F0-9]{14,16}$/.test(values.imei[i].reImei)) {
          errors.imei[i].reImei = i18n.t('validation.imeiMustContain')
        } else if (values.imei[i].imei !== values.imei[i].reImei) {
          errors.imei[i].reImei = i18n.t('validation.enteredImeiDoesnTMatch')
        }
        if (values.imei[i].imei.length > 0) {
          imei.push(values.imei[i].imei)
        }
        if (Object.keys(errors.imei[i]).length === 0) {
          delete (errors.imei[i]);
        }
        if (Object.keys(errors.imei).length === 0) {
          delete (errors.imei);
        }
        /*
        if (hasDuplicates(imei)) {
          errors.duplicateImeis = 'Duplicate IMEIs found'
        }*/
      }
    }

    if (!values.brand) {
      errors.brand = i18n.t('validation.thisFieldIsRequired')
    }else if (languageCheck(values.brand) === false && !/[-& ]/g.test(values.brand)){
      errors.brand = i18n.t('validation.langError')
    }
    else if (!/^([a-zA-Z &-])([a-zA-Z 0-9 &-])*$/i.test(values.brand)) {
      errors.brand = i18n.t('validation.brandMustContainCharactersAndACombinationOf')
    } else if (values.brand.length >= 1000) {
      errors.brand = i18n.t('validation.brandMustBe1000CharactersOrLess')
    }
    if (!values.model) {
      errors.model = i18n.t('validation.thisFieldIsRequired')
    }else if (languageCheck(values.model) === false && !/[-() ]/g.test(values.model)){
      errors.model = i18n.t('validation.langError')
    }
    else if (!/^([a-zA-Z ()'-])([a-zA-Z 0-9 ()'-])*$/i.test(values.model) ) {
      errors.model = i18n.t('validation.modelNameMustContainCharactersAndACombinationOf')
    } else if (values.model.length >= 1000) {
      errors.model = i18n.t('validation.modelNameMustBe1000CharactersOrLess')
    }

    if (!values.serial_no) {
      errors.serial_no = i18n.t('validation.thisFieldIsRequired')
    } else if (!/^([a-zA-Z0-9])([a-zA-Z 0-9.'_-])*$/i.test(values.serial_no)) {
      errors.serial_no = i18n.t('validation.serialNumberMustContainCharactersAndACombinationOf')
    } else if (values.serial_no.length >= 1000) {
      errors.serial_no = i18n.t('validation.serialNumberMustBe1000CharactersOrLess')
    }

    if (!values.retype_serial_no) {
      errors.retype_serial_no = i18n.t('validation.thisFieldIsRequired')
    } else if (values.serial_no !== values.retype_serial_no) {
      errors.retype_serial_no = i18n.t('validation.enteredSerialNumberDoesnTMatch')
    }

    if(values.mac) {

      if (!/^([0-9A-F]{2,4}[.:-]){3,7}([0-9A-F]{2,4})$/i.test(values.mac)) {
        errors.mac = i18n.t('validation.invalidFormatValidFormatsAreGivenInDescription')
      }

    }

    if (values.mac !== values.retype_mac) {
      errors.retype_mac = i18n.t('validation.enteredMacAddressDoesnTMatch')
    }

    if (!values.rat || !values.rat.length) {
      errors.rat = i18n.t('validation.thisFieldIsRequired')
    }

    if (!values.contact_no) {
      errors.contact_no = i18n.t('validation.thisFieldIsRequired')
    } else if (!/^([0-9]{1,11})$/i.test(values.contact_no)) {
      errors.contact_no = i18n.t('validation.invalidFormatValidFormatIs3001234567891')
    }

    return errors;
  },

  handleSubmit: (values, bag) => {
    bag.setSubmitting(false);
    bag.props.callServer(prepareAPIRequest(values));
  },

  displayName: 'CaseForm', // helps with React DevTools
})(CaseForm);

function prepareAPIRequest(values) {
  // Validate Values before sending
  const searchParams = {};
  if (values.contact_no) {
    // searchParams.contact_no = {}
    // searchParams.contact_no.CC = COUNTRY_CODE;
    // searchParams.contact_no.SN = values.contact_no;
    searchParams.contact_no = COUNTRY_CODE + values.contact_no;
  }
  if (values.model) {
    searchParams.model = values.model;
  }
  if (values.brand) {
    searchParams.brand = values.brand;
  }
  if (values.serial_no) {
    searchParams.serial_no = values.serial_no;
  }
  if (values.mac) {
    searchParams.mac = values.mac;
  } 
  if (values.rat) {
    searchParams.rat = [];
    for (let i = 0; i < values.rat.length; i++) {
      searchParams.rat[i] = values.rat[i].value;
    }
    searchParams.rat = searchParams.rat.join(',');
  }
  if (values.imei.length > 0) {
    searchParams.imei = [];
    for (let i = 0; i < values.imei.length; i++) {
      searchParams.imei[i] = values.imei[i].imei
    }
  }
  return searchParams;
}

class GeneratePairCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: false,
      caseSubmitted: false
    }
    this.saveCase = this.saveCase.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);
  }

  updateTokenHOC(callingFunc, values = null) {
    let config = null;
    if (this.props.kc.isTokenExpired(0)) {
      this.props.kc.updateToken(0)
        .success(() => {
          localStorage.setItem('token', this.props.kc.token)
          config = {
            headers: getAuthHeader(this.props.kc.token)
          }
          callingFunc(config, values);
        })
        .error(() => this.props.kc.logout());
    } else {
      config = {
        headers: getAuthHeader()
      }
      callingFunc(config, values);
    }
  }

  saveCase(config, values) {
    instance.post('/device-reg', values, config)
      .then(response => {
        if (response.data) {
          this.setState({loading: false, caseSubmitted: true});
          //toast.success('Case has been registered successfully!');
          const statusDetails = {
            id: response.data.pair_code,
            icon: 'fa fa-check',
            action: i18n.t('registered'),
            showButton: false,
            link: null
          }
          this.props.history.push({
            pathname: '/request-status',
            state: {details: statusDetails}
          });
        } else {
          toast.error(i18n.t('wentWrong'));
        }
      })
      .catch(error => {
        errors(this, error);
        console.log(error);
      })
  }

  render() {
    return (
      <div>
        <MyEnhancedForm callServer={(values) => this.updateTokenHOC(this.saveCase, values)}
                        caseSubmitted={this.state.caseSubmitted}/>
      </div>
    )
  }
}

export default translate('translations')(GeneratePairCode);

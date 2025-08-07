const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post('/employee-login', async (req, res) => {
    const { EmpId, Password } = req.body;

    if (!EmpId || !Password) {
        return res.status(400).json({ error: 'EmpId and Password are required' });
    }

    const soapXML = `<?xml version="1.0" encoding="UTF-8"?>
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:n0="urn:sap-com:document:sap:soap:functions:mc-style">
       <soapenv:Header/>
       <soapenv:Body>
          <n0:ZfmEmLoginPr>
             <EmpId>${EmpId}</EmpId>
             <Password>${Password}</Password>
          </n0:ZfmEmLoginPr>
       </soapenv:Body>
    </soapenv:Envelope>`;

    try {
        const response = await axios.post(
            'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zser_em_login_pr?sap-client=100',
            soapXML,
            {
                headers: {
                    'Content-Type': 'text/xml',
                    'SOAPAction': '',
                },
                auth: {
                    username: 'k901673',   // 🔁 Replace with your SAP username
                    password: 'Tpraburam733@',   // 🔁 Replace with your SAP password
                }
            }
        );

        // Debug logs
        console.log("🟡 Raw XML:\n", response.data);

        const parser = new XMLParser({ ignoreAttributes: false });
        const json = parser.parse(response.data);

        console.log("🟢 Parsed JSON:\n", JSON.stringify(json, null, 2));

        // ✅ Corrected parsing
        const returnMsg = json['soap-env:Envelope']
            ?.['soap-env:Body']
            ?.['n0:ZfmEmLoginPrResponse']
            ?.Return;

        if (returnMsg === 'SUCCESS') {
            res.json({ status: 'SUCCESS' });
        } else {
            res.status(401).json({ status: 'FAILED', return: returnMsg });
        }
    } catch (err) {
        console.error('🔴 Error:', err.message);
        res.status(500).json({ error: 'Login failed', details: err.message });
    }
});

app.post('/employee-profile', async (req, res) => {
    const { IvEmpId } = req.body;

    if (!IvEmpId) {
        return res.status(400).json({ error: 'IvEmpId is required' });
    }

    const soapXML = `<?xml version="1.0" encoding="UTF-8"?>
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:n0="urn:sap-com:document:sap:soap:functions:mc-style">
       <soapenv:Header/>
       <soapenv:Body>
          <n0:ZfmEmProfilePr>
             <IvEmpId>${IvEmpId}</IvEmpId>
          </n0:ZfmEmProfilePr>
       </soapenv:Body>
    </soapenv:Envelope>`;

    try {
        const response = await axios.post(
            'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zser_em_profile_pr?sap-client=100',
            soapXML,
            {
                headers: {
                    'Content-Type': 'text/xml',
                    'SOAPAction': '',
                },
                auth: {
                    username: 'k901673',
                    password: 'Tpraburam733@',
                }
            }
        );

        const parser = new XMLParser({ ignoreAttributes: false });
        const json = parser.parse(response.data);

        // 🧠 Extract EsEmpProfile
        const empProfile = json['soap-env:Envelope']
            ?.['soap-env:Body']
            ?.['n0:ZfmEmProfilePrResponse']
            ?.EsEmpProfile;

        if (empProfile) {
            res.json({ status: 'SUCCESS', profile: empProfile });
        } else {
            res.status(404).json({ status: 'FAILED', message: 'Profile not found' });
        }
    } catch (err) {
        console.error('🔴 Error:', err.message);
        res.status(500).json({ error: 'Profile fetch failed', details: err.message });
    }
});

app.post('/employee-leave', async (req, res) => {
    const { IvEmpId } = req.body;

    if (!IvEmpId) {
        return res.status(400).json({ error: 'IvEmpId is required' });
    }

    const soapXML = `<?xml version="1.0" encoding="UTF-8"?>
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:n0="urn:sap-com:document:sap:soap:functions:mc-style">
       <soapenv:Header/>
       <soapenv:Body>
          <n0:ZfmEmLeavePr>
             <IvEmpId>${IvEmpId}</IvEmpId>
          </n0:ZfmEmLeavePr>
       </soapenv:Body>
    </soapenv:Envelope>`;

    try {
        const response = await axios.post(
            'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zser_em_leave_pr?sap-client=100',
            soapXML,
            {
                headers: {
                    'Content-Type': 'text/xml',
                    'SOAPAction': '',
                },
                auth: {
                    username: 'k901673', // 🔁 Replace with actual
                    password: 'Tpraburam733@',
                }
            }
        );

        const parser = new XMLParser({ ignoreAttributes: false });
        const json = parser.parse(response.data);

        const responseBody = json['soap-env:Envelope']
            ?.['soap-env:Body']
            ?.['n0:ZfmEmLeavePrResponse'];

        if (!responseBody) {
            return res.status(500).json({ error: 'Invalid SAP response' });
        }

        const EtAbsences = responseBody.EtAbsences?.item || [];
        const EtQuotas = responseBody.EtQuotas?.item || [];
        const EvDays = responseBody.EvDays ? responseBody.EvDays.toString().trim() : null;
const EvHours = responseBody.EvHours ? responseBody.EvHours.toString().trim() : null;
const EvLeaveTaken = responseBody.EvLeaveTaken ? responseBody.EvLeaveTaken.toString().trim() : null;
const EvTotalQuota = responseBody.EvTotalQuota ? responseBody.EvTotalQuota.toString().trim() : null;


        res.json({
            status: 'SUCCESS',
            absences: Array.isArray(EtAbsences) ? EtAbsences : [EtAbsences],
            quotas: Array.isArray(EtQuotas) ? EtQuotas : [EtQuotas],
            summary: {
                days: EvDays,
                hours: EvHours,
                leaveTaken: EvLeaveTaken,
                totalQuota: EvTotalQuota
            }
        });
    } catch (err) {
        console.error('🔴 Error:', err.message);
        res.status(500).json({ error: 'Leave fetch failed', details: err.message });
    }
});

app.post('/employee-payroll', async (req, res) => {
    const { IvPernr } = req.body;

    if (!IvPernr) {
        return res.status(400).json({ error: 'IvPernr is required' });
    }

    const soapXML = `<?xml version="1.0" encoding="UTF-8"?>
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:n0="urn:sap-com:document:sap:soap:functions:mc-style">
       <soapenv:Header/>
       <soapenv:Body>
          <n0:ZfmEmPayrollPr>
             <IvPernr>${IvPernr}</IvPernr>
          </n0:ZfmEmPayrollPr>
       </soapenv:Body>
    </soapenv:Envelope>`;

    try {
        const response = await axios.post(
            'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zser_em_payroll_pr?sap-client=100',
            soapXML,
            {
                headers: {
                    'Content-Type': 'text/xml',
                    'SOAPAction': '',
                },
                auth: {
                    username: 'k901673', // 🔁 Replace with actual credentials
                    password: 'Tpraburam733@'
                }
            }
        );

        const parser = new XMLParser({ ignoreAttributes: false });
        const json = parser.parse(response.data);

        const responseBody = json['soap-env:Envelope']
            ?.['soap-env:Body']
            ?.['n0:ZfmEmPayrollPrResponse'];

        if (!responseBody || !responseBody.EsPayroll) {
            return res.status(404).json({ status: 'FAILED', message: 'Payroll data not found' });
        }

        res.json({
            status: 'SUCCESS',
            payroll: responseBody.EsPayroll
        });
    } catch (err) {
        console.error('🔴 Error:', err.message);
        res.status(500).json({ error: 'Payroll fetch failed', details: err.message });
    }
});

app.post('/api/payslip-pdf', async (req, res) => {
  const { pernr } = req.body;

  if (!pernr) {
    return res.status(400).json({ error: 'Missing personnel number (pernr)' });
  }

  try {
    // 🔧 Build SOAP XML input
    const soapXML = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                        xmlns:n0="urn:sap-com:document:sap:soap:functions:mc-style">
        <soapenv:Header/>
        <soapenv:Body>
          <n0:ZfmEmPayslipformsPr>
            <Pernr>${pernr}</Pernr>
          </n0:ZfmEmPayslipformsPr>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

    const response = await axios.post(
      'http://AZKTLDS5CP.kcloud.com:8000/sap/bc/srt/scs/sap/zser_em_payslipforms_pr?sap-client=100',
      soapXML,
      {
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8',
          'SOAPAction': '',
        },
        auth: {
          username: 'k901673',
          password: 'Tpraburam733@',
        },
      }
    );

    // 🧾 Log full response for debugging
    console.log('🔵 Raw SAP Response:', response.data);

    // 🔍 Match <PPdf> or any known XSTRING tag
    const match = response.data.match(/<PPdf>([\s\S]*?)<\/PPdf>/) ||
                  response.data.match(/<PayslipPdf>([\s\S]*?)<\/PayslipPdf>/);

    if (!match) {
      throw new Error('No PDF data found in SAP response');
    }

    let base64PDF = match[1]
      .replace(/\s+/g, '')       // remove all whitespaces
      .replace(/&#xA;/g, '')     // remove encoded newlines
      .replace(/&#.*?;/g, '');   // remove any other encoded entities

    const pdfBuffer = Buffer.from(base64PDF, 'base64');

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="payslip.pdf"',
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error('❌ Payslip PDF Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch payslip PDF', details: err.message });
  }
});





app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});

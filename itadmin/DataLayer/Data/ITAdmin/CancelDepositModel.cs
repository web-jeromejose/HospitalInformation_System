using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Globalization;
using System.Data;
using System.ComponentModel;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Web;
using System.Data.SqlClient;



namespace DataLayer.ITAdmin.Model
{
    public class CancelDepositModel
    {
                public string ErrorMessage { get; set; }

                DBHelper db = new DBHelper();


                public bool Save(CancelDepositHeaderSave entry)
                {

                    try
                    {
                        List<CancelDepositHeaderSave> CancelDepositHeaderSave = new List<CancelDepositHeaderSave>();
                        CancelDepositHeaderSave.Add(entry);

                        List<CancelDepositDetailsSave> CancelDepositDetailsSave = entry.CancelDepositDetailsSave;
                        if (CancelDepositDetailsSave == null) CancelDepositDetailsSave = new List<CancelDepositDetailsSave>();


                        DBHelper db = new DBHelper();
                        db.param = new SqlParameter[] {
                        new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                        new SqlParameter("@xmlCancelDepositHeaderSave",CancelDepositHeaderSave.ListToXml("CancelDepositHeaderSave")) ,       
                        new SqlParameter("@xmlCancelDepositDetailsSave",CancelDepositDetailsSave.ListToXml("CancelDepositDetailsSave")),
                                     
                };

                        db.param[0].Direction = ParameterDirection.Output;
                        db.ExecuteSP("ITADMIN.CancelDepositSave_SCS");
                        this.ErrorMessage = db.param[0].Value.ToString();

                        bool isOK = this.ErrorMessage.Split('-')[0] == "100";

                        return isOK;
                    }
                    catch (Exception x)
                    {
                        this.ErrorMessage = x.Message;
                        return false;
                    }

                }

                public List<PatientCancelInformation> PatientCancelInformationView(int IPID)
                {
                    db.param = new SqlParameter[] {
                    new SqlParameter("@IPID", IPID)
                };

                    DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.FetchCancelPatientInformation_View_SCS");
                    List<PatientCancelInformation> list = new List<PatientCancelInformation>();
                    if (dt.Rows.Count > 0) list = dt.ToList<PatientCancelInformation>();
                    return list;
                }

                public List<CancelDepositDashBoard> CancelDepositDashBoardList(int IPID)
                {
                    db.param = new SqlParameter[] {
                    new SqlParameter("@IPID", IPID)
                };

                    DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.FetchCancelDepositInformation_DashBoard_SCS");
                    List<CancelDepositDashBoard> list = new List<CancelDepositDashBoard>();
                    if (dt.Rows.Count > 0) list = dt.ToList<CancelDepositDashBoard>();
                    return list;
                }

     }

    public class CancelDepositHeaderSave
    {
        public int Action { get; set; }
        public int IPID { get; set; }
        public int OperatorId { get; set; }
        public int CancelReasonId { get; set; }
        public List<CancelDepositDetailsSave> CancelDepositDetailsSave { get; set; }

    }

    public class CancelDepositDetailsSave
    {
        public int ReceiptNo { get; set; }
        public int Type { get; set; }
    }

    public class PatientCancelInformation
    {
        public string PatientName { get; set; }
        public string CompanyName { get; set; }
        public int CompanyId { get; set; }
        public int IPID { get; set; }
        public string RegistrationNo { get; set; }
        public string DischargeDateTime { get; set; }
    }

    public class CancelDepositDashBoard
    {
        public string ReceiptNo { get; set; }
        public string DateTime { get; set; }
        public string Type { get; set; }
        public string Amount { get; set; }
        //public string ChangeType { get; set; }
        public int ModeOfPayment { get; set; }
        public int IPID { get; set; }
        public int TypeID { get; set; }
        public int CompanyID { get; set; }
        public int selected { get; set; }
        //public int OldTypeId { get; set; }
        //public string Di  schargeDateTime { get; set; }
        //public string AdmitDateTime { get; set; }

    }

    }


     


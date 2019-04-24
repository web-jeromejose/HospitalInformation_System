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
    public class PatientOrderCancelationModel
    {
                public string ErrorMessage { get; set; }

                DBHelper db = new DBHelper();


                public bool Save(PatientOrderHeaderSave entry)
                {

                    try
                    {
                        List<PatientOrderHeaderSave> PatientOrderHeaderSave = new List<PatientOrderHeaderSave>();
                        PatientOrderHeaderSave.Add(entry);

                        List<PatientCancelOrderSave> PatientCancelOrderSave = entry.PatientCancelOrderSave;
                        if (PatientCancelOrderSave == null) PatientCancelOrderSave = new List<PatientCancelOrderSave>();

                        DBHelper db = new DBHelper();
                        db.param = new SqlParameter[] {
                        new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                        new SqlParameter("@xmlPatientOrderHeaderSave",PatientOrderHeaderSave.ListToXml("PatientOrderHeaderSave")),    
                        new SqlParameter("@xmlPatientCancelOrderSave",PatientCancelOrderSave.ListToXml("PatientCancelOrderSave"))
                                     
                    };

                        db.param[0].Direction = ParameterDirection.Output;
                        db.ExecuteSP("ITADMIN.PatientCancelOrder_Save_SCS");
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

                public List<PatientCancelOrderInformation> PatientCancelInformationView(int IPID)
                {
                    db.param = new SqlParameter[] {
                    new SqlParameter("@IPID", IPID)
                };

                    DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.FetchPatientOrder_View_SCS");
                    List<PatientCancelOrderInformation> list = new List<PatientCancelOrderInformation>();
                    if (dt.Rows.Count > 0) list = dt.ToList<PatientCancelOrderInformation>();
                    return list;
                }

                public List<CancelPatientOrderDashBoard> CancelPatientOrderDashBoard(int Id)
                {
                    db.param = new SqlParameter[] {
                    new SqlParameter("@Id", Id)
                };

                    DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.PatientOrder_Dashboard_SCS");
                    List<CancelPatientOrderDashBoard> list = new List<CancelPatientOrderDashBoard>();
                    if (dt.Rows.Count > 0) list = dt.ToList<CancelPatientOrderDashBoard>();
                    return list;
                }

     }

    public class CancelPatientOrderHeaderSave
    {
        public int Action { get; set; }
        public int IPID { get; set; }
        public int OperatorId { get; set; }
        public int CancelReasonId { get; set; }
        public List<CancelPatientOrderDetailsSave> CancelPatientOrderDetailsSave { get; set; }

    }

    public class CancelPatientOrderDetailsSave
    {
        public int ReceiptNo { get; set; }
        public int Type { get; set; }
    }

    public class PatientCancelOrderInformation
    {
        public string RegistrationNo { get; set; }
        public string PatientName { get; set; }
        public string BedName { get; set; }
        public string AdmitDateTime { get; set; }
        public string CompanyName { get; set; }
        public string CompanyId { get; set; }
        public string Pin { get; set; }
        public string IPID { get; set; }
    }

    public class CancelPatientOrderDashBoard
    {
        public string DepartmentName { get; set; }
        public string OrderID { get; set; }
        public int selected { get; set; }
        public string DateTime { get; set; }
        public string Name { get; set; }
        public string StationName { get; set; }
        public string DisPatchQuantity { get; set; }
        public string Unit { get; set; }
        public string SerialNo { get; set; }
        public string Operator {get; set;}
        public string Status { get; set; }
        public string id { get; set; }
        public string serviceid { get; set; }
        public string stationId { get; set; }
        public string groupId { get; set; }

    }

    public class PatientOrderHeaderSave
    {
        public int Action { get; set; }
        public int OperatorId { get; set; }
        public List<PatientCancelOrderSave> PatientCancelOrderSave { get; set; }
        
    }

    public class PatientCancelOrderSave	
    {
        public int OrderId { get; set; }
        public int TypeId { get; set; }
        public int groupId { get; set; }
  
    }

 }


     


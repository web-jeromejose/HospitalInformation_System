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
    public class TransferDepositTypeModel
    {
                public string ErrorMessage { get; set; }

                DBHelper db = new DBHelper();

                public bool Save(ChangeTransferDepositTypeHeaderSave entry)
                {

                    try
                    {
                        List<ChangeTransferDepositTypeHeaderSave> ChangeTransferDepositTypeHeaderSave = new List<ChangeTransferDepositTypeHeaderSave>();
                        ChangeTransferDepositTypeHeaderSave.Add(entry);

                        List<ChangeTypeDetailsSave> ChangeTypeDetailsSave = entry.ChangeTypeDetailsSave;
                        if (ChangeTypeDetailsSave == null) ChangeTypeDetailsSave = new List<ChangeTypeDetailsSave>();


                        DBHelper db = new DBHelper();
                        db.param = new SqlParameter[] {
                        new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                        new SqlParameter("@xmlChangeTransferDepositTypeHeaderSave",ChangeTransferDepositTypeHeaderSave.ListToXml("ChangeTransferDepositTypeHeaderSave")) ,       
                        new SqlParameter("@xmlChangeTypeDetailsSave",ChangeTypeDetailsSave.ListToXml("ChangeTypeDetailsSave")),
                                     
                };

                        db.param[0].Direction = ParameterDirection.Output;
                        db.ExecuteSP("ITADMIN.ChangeTransferDepositTypeSave_SCS");
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

                public List<TransferDepositType> TransferInfo(int IPID)
                {
                    db.param = new SqlParameter[] {
                    new SqlParameter("@IPID", IPID)
                };

                    DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.FetchPatientInformation_DashBoard_SCS");
                    List<TransferDepositType> list = new List<TransferDepositType>();
                    if (dt.Rows.Count > 0) list = dt.ToList<TransferDepositType>();
                    return list;
                }

                public List<PatientInformation> PatientInformationView(int IPID)
                {
                    db.param = new SqlParameter[] {
                    new SqlParameter("@IPID", IPID)
                };

                    DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.FetchPatientInformation_View_SCS");
                    List<PatientInformation> list = new List<PatientInformation>();
                    if (dt.Rows.Count > 0) list = dt.ToList<PatientInformation>();
                    return list;
                }
            
                public List<ReasonListModel> ReasonListDAL(string id)
                {
                    return db.ExecuteSQLAndReturnDataTableLive("SELECT id,Name as text, Name as name from CancelBillReason where name like '%" + id + "%' ").DataTableToList<ReasonListModel>();
                    //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
                }



     }

        public class ChangeTransferDepositTypeHeaderSave
        {
            public int Action { get; set; }
            public int IPID { get; set; }
            public int OperatorId { get; set; }
            public int CancelReasonId { get; set; }
            public List<ChangeTypeDetailsSave> ChangeTypeDetailsSave { get; set; }
    
        }

        public class ChangeTypeDetailsSave
        {
            public int ReceiptNo { get; set; }
            public int Type { get; set; }
            public int OldTypeId { get; set; }
        }


        public class PatientInformation 
        {
            public string PatientName { get; set; }
            public string CompanyName { get; set; }
            public int CompanyId { get; set; }
            public int IPID { get; set; }
            public string RegistrationNo { get; set; }
        }



        public class ReasonListModel
        {
            public string id { get; set; }
            public string name { get; set; }
            public string text { get; set; }
    
        }



        public class TransferDepositType
        {
            public string ReceiptNo { get; set; }
            public string DateTime { get; set; }
            public string Type { get; set; }
            public string Amount { get; set; }
            public string ChangeType { get; set; }
            public int ModeOfPayment { get; set; }
            public int IPID { get; set; }
            public int TypeID { get; set; }
            public int CompanyID { get; set; }
            public int OldTypeId { get; set; }
        
            //public string AdmitDateTime { get; set; }

        }


    }


     


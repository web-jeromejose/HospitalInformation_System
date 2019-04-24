using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer.ITAdmin.Model
{
    public class CancelBillReasonModel
    {
                public string ErrorMessage { get; set; }

                DBHelper db = new DBHelper();

                public bool Save(CancelBillReasonSave entry)
                {

                    try
                    {
                        List<CancelBillReasonSave> CancelBillReasonSave = new List<CancelBillReasonSave>();
                        CancelBillReasonSave.Add(entry);


                        DBHelper db = new DBHelper();
                        db.param = new SqlParameter[] {
                        new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                        new SqlParameter("@xmlCancelBillReasonSave",CancelBillReasonSave.ListToXml("CancelBillReasonSave"))     
                                     
                    };

                        db.param[0].Direction = ParameterDirection.Output;
                        db.ExecuteSP("ITADMIN.CancelBillReason_Save_SCS");
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


                public List<CancelBillDashBoard> CancelBillDashBoard()
                {
                    DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.CancelBillReason_DashBoard_SCS");
                    List<CancelBillDashBoard> list = new List<CancelBillDashBoard>();
                    if (dt.Rows.Count > 0) list = dt.ToList<CancelBillDashBoard>();
                    return list;
                }

                public List<CancelBillView> CancelBillView(int CancelbillId)
                {

                    db.param = new SqlParameter[] {
                     new SqlParameter("@CancelbillId", CancelbillId)
           
           
                    };
                    DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.CancelBillReason_View_SCS");
                    List<CancelBillView> list = new List<CancelBillView>();
                    if (dt.Rows.Count > 0) list = dt.ToList<CancelBillView>();
                    return list;
                }

     }
   


    }

        public class CancelBillReasonSave
        {
            public int Action { get; set; }
            public int CancelBillId { get; set; }
            public string Name { get; set; }
            public int ReissueId { get; set; }
            public int OperatorId { get; set; }

        }
        

        public class CancelBillDashBoard
        {
            public string Name { get; set; }
            public string ReIssue { get; set; }
            public int ReissueId { get; set; }
            public int CancelbillId { get; set; }
        }

        public class CancelBillView
        {
            public string Name { get; set; }
            public string ReIssue { get; set; }
            public int ReissueId { get; set; }
            public int CancelbillId { get; set; }
        }




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
    public class CancelBillMappingModel
    {
                public string ErrorMessage { get; set; }

                DBHelper db = new DBHelper();


                public bool Save(CancelTypeMappingSave entry)
                {

                    try
                    {
                        List<CancelTypeMappingSave> CancelTypeMappingSave = new List<CancelTypeMappingSave>();
                        CancelTypeMappingSave.Add(entry);


                        DBHelper db = new DBHelper();
                        db.param = new SqlParameter[] {
                        new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                        new SqlParameter("@xmlCancelTypeMappingSave",CancelTypeMappingSave.ListToXml("CancelTypeMappingSave"))     
                                     
                    };

                        db.param[0].Direction = ParameterDirection.Output;
                        db.ExecuteSP("ITADMIN.CancelBillMapping_Save_SCS");
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

                public List<CancelTypeDashBoard> CancelTypeFetchView(int Id)
                {

                  db.param = new SqlParameter[] {
                  new SqlParameter("@Id", Id),

                };
                    DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.get_cacellation_type_details_View_SCS");
                    List<CancelTypeDashBoard> list = new List<CancelTypeDashBoard>();
                    if (dt.Rows.Count > 0) list = dt.ToList<CancelTypeDashBoard>();
                    return list;
                }

                public List<CancelTypeDashBoard> CancelTypeDashBoardView(int Id)
                {

                db.param = new SqlParameter[] {
                new SqlParameter("@Id", Id),

                };
                DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.get_cacellation_type_details_SCS");
                List<CancelTypeDashBoard> list = new List<CancelTypeDashBoard>();
                if (dt.Rows.Count > 0) list = dt.ToList<CancelTypeDashBoard>();
                return list;
                }

  }

    public class CancelTypeDashBoard
    {
        public string  DetailName { get; set;}
        public string STDate { get; set; }
        public string Id { get; set; }
        public string MainReasonId { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string Del { get; set; }
        public string MainReasonName { get; set; }
    }


    public class CancelTypeMappingSave
    {
        public int Action { get; set; }
        public int Id { get; set; }
        public int MainReasonId { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public int Deleted { get; set; }
        public int OperatorId { get; set; }
    
    }

            
     }


     


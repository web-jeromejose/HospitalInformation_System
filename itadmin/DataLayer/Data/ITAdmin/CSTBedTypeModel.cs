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


namespace DataLayer
{

    public class CSTBedTypeModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();


        public bool Save(CSTBedTypeHeader entry)
        {

            try
            {
                List<CSTBedTypeHeader> CSTBedTypeHeader = new List<CSTBedTypeHeader>();
                CSTBedTypeHeader.Add(entry);

                List<CSTBedTypeMarkUpSave> CSTBedTypeMarkUpSave = entry.CSTBedTypeMarkUpSave;
                if (CSTBedTypeMarkUpSave == null) CSTBedTypeMarkUpSave = new List<CSTBedTypeMarkUpSave>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlCSTBedTypeHeader",CSTBedTypeHeader.ListToXml("CSTBedTypeHeader")),
                    new SqlParameter("@xmlCSTBedTypeMarkUpSave",CSTBedTypeMarkUpSave.ListToXml("CSTBedTypeMarkUpSave"))
    
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.CSTBedTypeMarkUP_Save");
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


        public List<CSTBedTypeDashboard> CSTBedTypeDashboard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.MarckupBedType_DashBoard_SCS");
            List<CSTBedTypeDashboard> list = new List<CSTBedTypeDashboard>();
            if (dt.Rows.Count > 0) list = dt.ToList<CSTBedTypeDashboard>();
            return list;
        }

       
    }

    public class CSTBedTypeDashboard
    {
        public int Selected { get; set; }
        public string Name { get; set; }
        public int MarkupPer { get; set; }
        public int NewMarkUp { get; set; }
        public int Id { get; set; }
    }


    public class CSTBedTypeHeader 
    {
        public int Action { get; set; }
        public int OperatorId { get; set; }
        public List<CSTBedTypeMarkUpSave> CSTBedTypeMarkUpSave  { get; set; }
    }


    public class CSTBedTypeMarkUpSave 
    {
        public int BedTypeId { get; set; }
        public int MarkupPer { get; set; }
    }

   

}




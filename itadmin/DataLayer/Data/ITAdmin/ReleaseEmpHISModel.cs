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
    public class ReleaseEmpHISModel
    {
        public string ErrorMessage { get; set; }

        DBHelper db = new DBHelper();


        public List<ReleaseEmpDashBoardModel> ReleaseEmpDashBoardModel()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.ReleaseHISEmployeeVacation_DashBoard_SCS");
            List<ReleaseEmpDashBoardModel> list = new List<ReleaseEmpDashBoardModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<ReleaseEmpDashBoardModel>();
            return list;
        }


        public bool Save(ReleaseEmpVacationHeaderSave entry)
        {

            try
            {
                List<ReleaseEmpVacationHeaderSave> ReleaseEmpVacationHeaderSave = new List<ReleaseEmpVacationHeaderSave>();
                ReleaseEmpVacationHeaderSave.Add(entry);

                List<ReleaseEmpVacationDetails> ReleaseEmpVacationDetails = entry.ReleaseEmpVacationDetails;
                if (ReleaseEmpVacationDetails == null) ReleaseEmpVacationDetails = new List<ReleaseEmpVacationDetails>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlReleaseEmpVacationHeaderSave",ReleaseEmpVacationHeaderSave.ListToXml("ReleaseEmpVacationHeaderSave")),
                    new SqlParameter("@xmlReleaseEmpVacationDetails", ReleaseEmpVacationDetails.ListToXml("ReleaseEmpVacationDetails")),

                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.ReleaseEmployeeVacationSave_SCS");
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


    }

            public class ReleaseEmpDashBoardModel
            {
                public string selected { get; set; }
                public string EmployeeID { get; set; }
                public string Name { get; set; }
                public string DPT { get; set; }
                public string FromDate { get; set; }
                public string ToDate { get; set; }
                public string LeaveID { get; set; }
    
            }

            public class ReleaseEmpVacationHeaderSave
            {
                public string Action { get; set; }
                public List<ReleaseEmpVacationDetails> ReleaseEmpVacationDetails { get; set; }

            }

            public class ReleaseEmpVacationDetails
            {
                public int LeaveID { get; set; }
        
            }
        

}




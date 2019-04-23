using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Data.SqlClient;
using System.Data;

using DataLayer;
using HIS_OT.Areas.OT.Models;
using HIS_OT.Controllers;
using HIS_OT.Models;

namespace HIS_OT.Areas.OT.Models
{
    public class EmployeeMappingModel
    {
        public string ErrorMessage { get; set; }

        public List<IdName> ShowSelected(int id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@employeeid", id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.ShowSelectedEmployeeMapping");
            List<IdName> list = new List<IdName>();
            if (dt.Rows.Count > 0) list = dt.ToList<IdName>();

            return list;
        }

        public bool Save(OTEmployeeDoctor entry)
        {
            try
            {
                List<OTEmployeeDoctor> OTEmployeeDoctor = new List<OTEmployeeDoctor>();
                OTEmployeeDoctor.Add(entry);

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@Action", entry.Action),
                    new SqlParameter("@xmlOTEmployeeDoctor",OTEmployeeDoctor.ListToXml("OTEmployeeDoctor"))
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("OT.EmployeeMappingSave");
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





    #region Entity

    public class OTEmployeeDoctor
    {
        public int Action { get; set; }
        public int IDD { get; set; }
        public int Typeid { get; set; }
        public int Employeeid { get; set; }
    } 

    #endregion

}
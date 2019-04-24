using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer.ITAdmin.Model
{
    public class IpOpMarkUpModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(IPOPMarkUpSave entry)
        {

            try
            {
                List<IPOPMarkUpSave> IPOPMarkUpSave = new List<IPOPMarkUpSave>();
                IPOPMarkUpSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlOPIPMarkUpSave",IPOPMarkUpSave.ListToXml("OPIPMarkUpSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.IPOPMarkUp_Save_SCS");
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

        public List<IpOpDMarkUpDashBoard> IpOpDMarkUpDashBoard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.IPOPMarkUP_DashBoard_SCS");
            List<IpOpDMarkUpDashBoard> list = new List<IpOpDMarkUpDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<IpOpDMarkUpDashBoard>();
            return list;
        }

        public List<IPOPViewDetails> IPOPViewDetails(int DoctorId)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@DoctorId", DoctorId)
           
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.OPIPView_SCS");
            List<IPOPViewDetails> list = new List<IPOPViewDetails>();
            if (dt.Rows.Count > 0) list = dt.ToList<IPOPViewDetails>();
            return list;
        }




    }



}

public class IpOpDMarkUpDashBoard
{
    public int SNo { get; set; }
    public string EmpCode { get; set; }
    public string Name { get; set; }
    public string MarkUpPercent { get; set; }
    public int ID { get; set; }
}

public class IPOPViewDetails
{
    public int ID { get; set; }
    public string Name { get; set; }
    public int MarkUpPercent { get; set; }

}

public class IPOPMarkUpSave
{
    public int Action { get; set; }
    public int DoctorId { get; set; }
    public int MarkUpPercent { get; set; }
    public int OperatorId { get; set; }
}

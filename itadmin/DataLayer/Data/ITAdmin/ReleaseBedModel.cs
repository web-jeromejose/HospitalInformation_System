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
    public class ReleaseBedModel
    {
        public string ErrorMessage { get; set; }

        DBHelper db = new DBHelper();



        public List<ReleaseBedBoardModel> ReleaseBedBoardModel()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.ReleaseBed_DashBoard_SCS");
            List<ReleaseBedBoardModel> list = new List<ReleaseBedBoardModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<ReleaseBedBoardModel>();
            return list;
        }


        public bool Save(ReleaseBedHeaderSave entry)
        {

            try
            {
                List<ReleaseBedHeaderSave> ReleaseBedHeaderSave = new List<ReleaseBedHeaderSave>();
                ReleaseBedHeaderSave.Add(entry);

                List<ReleaseBedDetaisSave> ReleaseBedDetaisSave = entry.ReleaseBedDetaisSave;
                if (ReleaseBedDetaisSave == null) ReleaseBedDetaisSave = new List<ReleaseBedDetaisSave>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlReleaseBedHeaderSave",ReleaseBedHeaderSave.ListToXml("ReleaseBedHeaderSave")),
                    new SqlParameter("@xmlReleaseBedDetaisSave", ReleaseBedDetaisSave.ListToXml("ReleaseBedDetaisSave")),

                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.ReleaseBedClearanceSave_SCS");
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

        public List<ReleaseBedBoardModel> ForVacantReleaseBedBoardModel()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.ReleaseBed_DashBoard_ForVacant");
            List<ReleaseBedBoardModel> list = new List<ReleaseBedBoardModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<ReleaseBedBoardModel>();
            return list;
        }


        public bool ForVacantSave(ReleaseBedHeaderSave entry)
        {

            try
            {
                List<ReleaseBedHeaderSave> ReleaseBedHeaderSave = new List<ReleaseBedHeaderSave>();
                ReleaseBedHeaderSave.Add(entry);

                List<ReleaseBedDetaisSave> ReleaseBedDetaisSave = entry.ReleaseBedDetaisSave;
                if (ReleaseBedDetaisSave == null) ReleaseBedDetaisSave = new List<ReleaseBedDetaisSave>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlReleaseBedHeaderSave",ReleaseBedHeaderSave.ListToXml("ReleaseBedHeaderSave")),
                    new SqlParameter("@xmlReleaseBedDetaisSave", ReleaseBedDetaisSave.ListToXml("ReleaseBedDetaisSave")),

                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.ReleaseBedClearanceSave_ForVacant");
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

            public class ReleaseBedBoardModel
            {
                public string selected { get; set; }
                public string Room { get; set; }
                public string IntimationDate { get; set; }
                public string DischargeDateTime { get; set; }
                public string HouseKeepingDateTime { get; set; }
                public string FinalApproval { get; set; }
                public string ID { get; set; }
                public string FinalDateTime { get; set; }
    
            }


            public class ReleaseBedHeaderSave
            {
                public int Action { get; set; }
                public int OperatorId { get; set; }
                public List<ReleaseBedDetaisSave> ReleaseBedDetaisSave { get; set; }
            }

            public class ReleaseBedDetaisSave
            {
                public int BedId { get; set; }
                
            
            }
   
        

}




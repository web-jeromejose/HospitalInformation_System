using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{
    public class ORTrackingModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();


        public bool Save(AccessIdSave entry)
        {

            try
            {
                List<AccessIdSave> AccessIdSave = new List<AccessIdSave>();
                AccessIdSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlAccessIdSave",AccessIdSave.ListToXml("AccessIdSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.AccessOPRevisitApproval_Save_SCS");
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

        public List<ORTrackingDashBoard> ORTrackingDashBoardList()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.ORTracked_DashBoard_SCS");
            List<ORTrackingDashBoard> list = new List<ORTrackingDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<ORTrackingDashBoard>();
            return list;
        }


        public List<ORTRackingView> ORTrackingViewList(int OrId)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@OrId", OrId),
 
            };

            DataTable dt = db.ExecuteSPAndReturnDataTable("OT.ORTracked_View_SCS");
            List<ORTRackingView> list = new List<ORTRackingView>();
            if (dt.Rows.Count > 0) list = dt.ToList<ORTRackingView>();
            return list;
        }

        //public List<Select2PatientInfo> CurrentRoomDAL(string id)
        //{
        //    return db.ExecuteSQLAndReturnDataTableLive("SELECT Distinct top 100 b.Id id,b.Name as text, Name as name from Bedtransfers a LEFT JOIN BED b on a.bedid = b.id  where convert(varchar(20),b.id)  + b.Name '%" + id + "%' ").DataTableToList<Select2PatientInfo>();
        //}


    }

    public class ORTrackingDashBoard
    {
        public string PIN { get; set; }
        public string Status { get; set; }
        public string TimeOR { get; set; }
        public string TimeTheatre { get; set; }
        public string Recovery { get; set; }
        public string SurgeonName { get; set; }
        public string Id { get; set; }
    }

    public class ORTRackingView
    {
        public string PIN { get; set; }
        public string Status { get; set; }
        public string TimeOR { get; set; }
        public string TimeTheatre { get; set; }
        public string OutProcedure { get; set; }
        public string OutCathLab { get; set; }
        public string SurgeonName { get; set; }
        public string ServiceCode { get; set; }
        public string ServiceName { get; set; }
        public string PatientName { get; set; }
        public int ORId { get; set; }
        public int IPId { get; set; }
        public string RegistrationNo { get; set; }
        public string BedName { get; set; }
        public int BedId { get; set; }
        public string ORRoomName { get; set; }
        public int ORRoomId { get; set; }
        public int SurgeonId {get; set;}
        public int AsstSurgeonId {get; set;}
        public int ItemCode { get; set; }
        public string AsstSurgeonName { get; set; }
        public int Anestid { get; set; }
        public string AnestName { get; set; }


    }



    public class Select2PatientInfo
    {
        public string id { get; set; }
        public string text { get; set; }
        public string name { get; set; }
    }





}




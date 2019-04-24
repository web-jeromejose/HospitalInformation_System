using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{
    public class DocRecepMappingModel
    {
        public string ErrorMessage { get; set; }
        
        DBHelper db = new DBHelper();

        public bool Save(DoctorRecepHeaderSave entry)
        {

            try
            {
                List<DoctorRecepHeaderSave> DoctorRecepHeaderSave = new List<DoctorRecepHeaderSave>();
                DoctorRecepHeaderSave.Add(entry);

                List<DoctorRecepDetailsSave> DoctorRecepDetailsSave = entry.DoctorRecepDetailsSave;
                if (DoctorRecepDetailsSave == null) DoctorRecepDetailsSave = new List<DoctorRecepDetailsSave>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlDoctorRecepHeaderSave",DoctorRecepHeaderSave.ListToXml("DoctorRecepHeaderSave")),
                    new SqlParameter("@xmlDoctorRecepDetailsSave", DoctorRecepDetailsSave.ListToXml("DoctorRecepDetailsSave")),
                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.DoctorReceptionistMappingSave_SCS");
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


        public List<ReceptionistDashBoard> ReceptionistDashBoard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.DoctorReceptionMapping_DashBoard_SCS");
            List<ReceptionistDashBoard> list = new List<ReceptionistDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<ReceptionistDashBoard>();
            return list;
        }



        public List<SelectedReceptionist> SelectedReceptionistView(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id),
 

            };


            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.DoctorReceptionMappingView_DashBoard_SCS");
            List<SelectedReceptionist> list = new List<SelectedReceptionist>();
            if (dt.Rows.Count > 0) list = dt.ToList<SelectedReceptionist>();
            return list;
        }





    }

    public class DoctorRecepHeaderSave
    {

        public int Action { get; set; }
        public int OperatorId {get; set;}
        public int DoctorId { get; set; }
        public string DoctorName { get; set; }
        public int Confine { get; set; }
        public List<DoctorRecepDetailsSave> DoctorRecepDetailsSave { get; set; }

    
    }

    public class DoctorRecepDetailsSave
    {
        public int ReceptionistId { get; set; }
        public string ReceptionistName { get; set; }
        
    
    }

    

    public class ReceptionistDashBoard
    {
        public int Id { get; set; }
        public string Name { get; set; }
    
    }

    public class SelectedReceptionist
    {

        public int Id { get; set; }
        public string Name { get; set; }

    }


}




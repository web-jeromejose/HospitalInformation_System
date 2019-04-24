using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{
    public class MappingCombinedDocCodeModel
    {
        public string ErrorMessage { get; set; }
        
        DBHelper db = new DBHelper();


        public bool Save(CombinedDoctorHeaderSave entry)
        {

            try
            {
                List<CombinedDoctorHeaderSave> CombinedDoctorHeaderSave = new List<CombinedDoctorHeaderSave>();
                CombinedDoctorHeaderSave.Add(entry);

                List<CombinedDoctorDetailsSave> CombinedDoctorDetailsSave = entry.CombinedDoctorDetailsSave;
                if (CombinedDoctorDetailsSave == null) CombinedDoctorDetailsSave = new List<CombinedDoctorDetailsSave>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlCombinedDoctorHeaderSave",CombinedDoctorHeaderSave.ListToXml("CombinedDoctorHeaderSave")),
                    new SqlParameter("@xmlCombinedDoctorDetailsSave", CombinedDoctorDetailsSave.ListToXml("CombinedDoctorDetailsSave")),
                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.MappingCombinedDoctorSave_SCS");
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


        public List<DoctorListCombinedDoctor> DoctorCombinedCodeList(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 50 Id id,Empcode + ' - ' + Name as text, Name as name from Doctor where Deleted = 0  and name like '%" + id + "%' ").DataTableToList<DoctorListCombinedDoctor>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }

        public List<CombinedDoctorDashBoard> CombinedDoctorDashBoard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.MappingCombinedDoctor_DashBoard_SCS");
            List<CombinedDoctorDashBoard> list = new List<CombinedDoctorDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<CombinedDoctorDashBoard>();
            return list;
        }


        public List<SelectedDoctorList> SelectedDoctorList(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id),
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.MappingCombinedSelectedDoctor_DetailsView_SCS");
            List<SelectedDoctorList> list = new List<SelectedDoctorList>();
            if (dt.Rows.Count > 0) list = dt.ToList<SelectedDoctorList>();
            return list;
        }

        public List<SelectedHeaderDoctorList> SelectedHeaderDoctorList(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id),
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.MappingCombinedSelectedDoctor_HeaderView_SCS");
            List<SelectedHeaderDoctorList> list = new List<SelectedHeaderDoctorList>();
            if (dt.Rows.Count > 0) list = dt.ToList<SelectedHeaderDoctorList>();
            return list;
        }


    }

    public class SelectedDoctorList
    {
        public int Id { get; set; }
        public string Name { get; set; }
    
    }

    public class SelectedHeaderDoctorList
    {
        public int Id { get; set; }
        public string Name { get; set; }

    }



    public class CombinedDoctorHeaderSave
    {
        public int Action { get; set; }
        public int OperatorId { get; set; }
        public int CombinedDoctorId { get; set;}
        public int PrimaryConsultanId { get; set; }
        public List<CombinedDoctorDetailsSave> CombinedDoctorDetailsSave { get; set; }
        
    }

    public class CombinedDoctorDetailsSave
    {
        public int DoctorId { get; set; }
    }


    public class DoctorListCombinedDoctor
    {
        public string id { get; set; }
        public string text { get; set; }
        public string name { get; set; }

    }

    public class CombinedDoctorDashBoard
    {
        public int Id { get; set; }
        public string Name { get; set; }

    }

}




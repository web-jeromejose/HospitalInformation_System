using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{
    public class DocSpecMapModel
    {
        public string ErrorMessage { get; set; }
        
        DBHelper db = new DBHelper();


        public bool Save(DoctorSpecMappingHeaderSave entry)
        {

            try
            {
                List<DoctorSpecMappingHeaderSave> DoctorSpecMappingHeaderSave = new List<DoctorSpecMappingHeaderSave>();
                DoctorSpecMappingHeaderSave.Add(entry);

                List<DoctorSpecMappingDetailsSave> DoctorSpecMappingDetailsSave = entry.DoctorSpecMappingDetailsSave;
                if (DoctorSpecMappingDetailsSave == null) DoctorSpecMappingDetailsSave = new List<DoctorSpecMappingDetailsSave>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlDoctorSpecMappingHeaderSave",DoctorSpecMappingHeaderSave.ListToXml("DoctorSpecMappingHeaderSave")),
                    new SqlParameter("@xmlDoctorSpecMappingDetailsSave", DoctorSpecMappingDetailsSave.ListToXml("DoctorSpecMappingDetailsSave")),
                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.DoctorSpecializationMappingSave_SCS");
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

        //public List<DoctorListItem> DoctorListDal(string id)
        //{
        //    return db.ExecuteSQLAndReturnDataTableLive("SELECT top 50 ID id,EmpCode + '--' + EmployeeID + ' - ' + Name as text, Name as name from Employee where CategoryID in (1,2) and Deleted = 0 and EmpCode like '%' or name like '%" + id + "%' ").DataTableToList<DoctorListItem>();
        //    //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        //}




        public List<GeneralListDashBoard> GeneralListDashBoard()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.DoctorSpeMapping_DashBoard_SCS");
            List<GeneralListDashBoard> list = new List<GeneralListDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<GeneralListDashBoard>();
            return list;
        }


        public List<SelectedList> SelectedListView(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id),
 

            };


            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.DoctorMappingSelectedList_View_SCS");
            List<SelectedList> list = new List<SelectedList>();
            if (dt.Rows.Count > 0) list = dt.ToList<SelectedList>();
            return list;
        }


    }

    public class DoctorSpecMappingHeaderSave
    {
        public int Action { get; set; }
        public int DoctorId { get; set; }
        public int OperatorId { get; set; }
        public List<DoctorSpecMappingDetailsSave> DoctorSpecMappingDetailsSave { get; set; }
    }

    public class DoctorSpecMappingDetailsSave
    {
        public int SpecialisationId { get; set; }
    
    }


    public class SelectedList
    {

        public int Id { get; set; }
        public string Name { get; set; }
    
    }



    public class DoctorListItem
    {
        public string id { get; set; }
        public string text { get; set; }
        public string name { get; set; }

    }

    public class GeneralListDashBoard
    {
        public int Id { get; set; }
        public string Name { get; set; }
    
    }


}




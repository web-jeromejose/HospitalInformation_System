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

    public class OPDoctorClinicModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();



        public List<ListDepartDAL> Select2DepartList(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT Id id,Name as text,Name as name from Specialisation where Deleted = 0 and Name like '%" + id + "%' ").DataTableToList<ListDepartDAL>();
            //return db.ExecuteSQLAndReturnDataTableLive("SELECT top 100 id,Code + ' - ' + Name as text, code as name,tariffid from Company where name like '%" + id + "%' ").DataTableToList<ListCompModel>();            
        }


        public List<OPDoctorViewModel> OPDoctorViewModel(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id)
            
        
            };

            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.OPDoctorClinic_View_SCS");
            List<OPDoctorViewModel> list = new List<OPDoctorViewModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<OPDoctorViewModel>();
            return list;
        }


        public bool Save(OPDoctorClinicHeaderSave entry)
        {

            try
            {
                List<OPDoctorClinicHeaderSave> OPDoctorClinicHeaderSave = new List<OPDoctorClinicHeaderSave>();
                OPDoctorClinicHeaderSave.Add(entry);

                List<OPDoctorClinicDetailsSave> OPDoctorClinicDetailsSave = entry.OPDoctorClinicDetailsSave;
                if (OPDoctorClinicDetailsSave == null) OPDoctorClinicDetailsSave = new List<OPDoctorClinicDetailsSave>();


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlOPDoctorClinicHeaderSave",OPDoctorClinicHeaderSave.ListToXml("OPDoctorClinicHeaderSave")),
                    new SqlParameter("@xmlOPDoctorClinicDetailsSave", OPDoctorClinicDetailsSave.ListToXml("OPDoctorClinicDetailsSave")),

                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.DoctorClinicSave_SCS");
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


    public class ListDepartDAL
    {
        public string id { get; set; }
        public string name { get; set; }
        public string text { get; set; }
    }


    public class OPDoctorViewModel
    {
        public int SNo { get; set; }
        public int Id { get; set; }
        public string DoctorName { get; set; }
        public string ClinicName { get; set; }
        public string WaitTime { get; set; }
        public string Sequence { get; set; }
        public string selected { get; set; }
        public string BuildingId { get; set; }
        public string ClinicId { get; set; }
        public string RoomId { get; set; }
  
    }

    public class OPDoctorClinicHeaderSave
    {
        public int Action { get; set; }
        public int DepartmentId { get; set; }
        public List<OPDoctorClinicDetailsSave> OPDoctorClinicDetailsSave { get; set; }
    
    }

    public class OPDoctorClinicDetailsSave
    {
        public int DoctorId { get; set; }
        public string ClinicName { get; set; }
        public int WaitTime { get; set; }
        public int Sequence { get; set; }
        public int SqNumber { get; set; }
        public int BuildingId { get; set; }
        public int ClinicId { get; set; }
        public string RoomId { get; set; }
    }


}




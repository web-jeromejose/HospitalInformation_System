using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer.ITAdmin.Model
{
    public class OrganisationModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(OrganisationSave entry)
        {

            try
            {
                List<OrganisationSave> OrganisationSave = new List<OrganisationSave>();
                OrganisationSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlOrganisationSave",OrganisationSave.ListToXml("OrganisationSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.Organisation_Save_SCS");
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


        public List<OrganisationViewModel> OrganisationViewModel(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id)
           
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Organisation_View_SCS");
            List<OrganisationViewModel> list = new List<OrganisationViewModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<OrganisationViewModel>();
            return list;
        }

        public List<CompanyList> CompanyListDal(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 10 Id id,Name text, Name as name from Company where Deleted = 0  and name like '%" + id + "%' ").DataTableToList<CompanyList>();
        }

        public List<CurrencyList> CurrencyListDal(string id)
        {
            return db.ExecuteSQLAndReturnDataTableLive("SELECT top 10 c_id id,currency text,currency as name from CurrencyValues where currency like '%" + id + "%' ").DataTableToList<CurrencyList>();
        }
    }



    public class CompanyList
    {
        public string id { get; set; }
        public string text { get; set; }
        public string name { get; set; }

    }

    public class CurrencyList
    {
        public string id { get; set; }
        public string text { get; set; }
        public string name { get; set; }

    }


    public class OrganisationViewModel
    {
        public string Name { get; set; }
        public string AddInformation { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Address3 { get; set; }
        public string City { get; set; }
       // public string State { get; set; }
        public string Country { get; set; }
        public string PhoneNo { get; set; }
        public string EMail { get; set; }
        public string FaxNo { get; set; }
        public string PagerNo { get; set; }
        public string CellPhoneNo { get; set; }
        public string PinCode { get; set; }
        public string District { get; set; }
        public string IssueAuthorityCode { get; set; }
      //  public string ContactPerson { get; set; }
        public string CompanyId { get; set; }
        public string Company { get; set; }
        public string Currency { get; set; }
        public string CurrencyId { get; set; }

    }

    public class OrganisationSave
    {
        public int Action { get; set; }
        public string Name { get; set; }
        public string AddInformation { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Address3 { get; set; }
        public string City { get; set; }
   //     public string State { get; set; }
        public string Country { get; set; }
        public string PhoneNo { get; set; }
        public string EMail { get; set; }
        public string FaxNo { get; set; }
        public string PagerNo { get; set; }
        public string CellPhoneNo { get; set; }
        public string PinCode { get; set; }
        public string District { get; set; }
        public string IssueAuthorityCode { get; set; }
   //     public string ContactPerson { get; set; }
        public int CompanyId { get; set; }
        public int CurrencyId { get; set; }
        public int OperatorId { get; set; }
        public int Id { get; set; }

    }

}




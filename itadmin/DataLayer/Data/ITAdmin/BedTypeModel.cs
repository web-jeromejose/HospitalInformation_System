using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer.ITAdmin.Model
{
    public class BedTypeModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(BedTypeSave entry)
        {

            try
            {
                List<BedTypeSave> BedTypeSave = new List<BedTypeSave>();
                BedTypeSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlBedTypeSave",BedTypeSave.ListToXml("BedTypeSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.BedType_Save_SCS");
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

        public List<BedTypeDashBoard> BedTypeDashBoardDL()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.BEdType_DashBoard");
            List<BedTypeDashBoard> list = new List<BedTypeDashBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<BedTypeDashBoard>();
            return list;
        }

        public List<BedTypeViewModel> BedTypeViewModelDL(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id)
           
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.BedType_View_SCS");
            List<BedTypeViewModel> list = new List<BedTypeViewModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<BedTypeViewModel>();
            return list;
        }
    }


    public class BedTypeSave
    {

        public int Action { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
        public int Type { get; set; }
        public string Label { get; set; }
        public string Code { get; set; }
        public int OperatorId { get; set; }


    }

    public class BedTypeDashBoard
    {
        public string slno { get; set; }
        public string Name { get; set; }
        public string Id { get; set; }

    }

    public class BedTypeViewModel
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public string Label { get; set; }
        public string TypeId { get; set; }
        public string TypeName { get; set; }
        public string BedTypeId { get; set; }
    }
}




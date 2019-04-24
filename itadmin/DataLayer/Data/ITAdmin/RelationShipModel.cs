using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;


namespace DataLayer.ITAdmin.Model
{
    public class RelationShipModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(RelationshipSave entry)
        {

            try
            {
                List<RelationshipSave> ReligionSave = new List<RelationshipSave>();
                ReligionSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlRelationshipSave",ReligionSave.ListToXml("RelationshipSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.RelationshipSave_SCS");
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

        public List<RelationshipBoard> RelationshipBoardList()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Relationship_DashBoard_SCS");
            List<RelationshipBoard> list = new List<RelationshipBoard>();
            if (dt.Rows.Count > 0) list = dt.ToList<RelationshipBoard>();
            return list;
        }

        public List<RelationshipViewModel> RelationshipViewModelList(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id)
           
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Relationship_View_SCS");
            List<RelationshipViewModel> list = new List<RelationshipViewModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<RelationshipViewModel>();
            return list;
        }
    }


    public class RelationshipSave
    {

        public int Action { get; set; }
        public int Id { get; set; }
        public int OperatorId { get; set; }
        public string Name { get; set; }

    }

    public class RelationshipBoard
    {
        public string Name { get; set; }
        public int Id { get; set; }
    
    }


    public class RelationshipViewModel
    {
        public string Name { get; set; }
        public int Id { get; set; }
    }
}




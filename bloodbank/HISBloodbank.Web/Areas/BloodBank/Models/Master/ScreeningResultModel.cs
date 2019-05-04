using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

using HIS_BloodBank.Models;


namespace HIS_BloodBank.Areas.BloodBank.Models
{
    public class ScreeningResultModel
    {
        public string ErrorMessage { get; set; }

        public List<ScreeningResult> List()
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", -1)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListScreeningResult");
            List<ScreeningResult> list = new List<ScreeningResult>();
            if (dt.Rows.Count > 0) list = dt.ToList<ScreeningResult>();
            return list;

        }
        public List<ScreeningResult> ShowSelected(int id)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
                new SqlParameter("@Id", id)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListScreeningResult");
            List<ScreeningResult> list = new List<ScreeningResult>();
            if (dt.Rows.Count > 0)
            {
                list = dt.ToList<ScreeningResult>();
                list[0].Sequence = this.ListOfSequence();
            }
            return list;
        }
        public bool Save(ScreeningResult entry)
        {
            try
            {
                List<ScreeningResult> ScreeningResult = new List<ScreeningResult>();
                ScreeningResult.Add(entry);

                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@Action", entry.Action),
                    new SqlParameter("@xmlScreeningResult",ScreeningResult.ListToXml("ScreeningResult"))
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("BLOODBANK.MasterScreeningResultSave");
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

        private List<Sequence> ListOfSequence()
        {
            DBHelper db = new DBHelper();
            //db.param = new SqlParameter[] {
            //    new SqlParameter("@Id", -1)
            //};
            DataTable dt = db.ExecuteSPAndReturnDataTable("BLOODBANK.MainListScreeningResultSeq");
            List<Sequence> list = new List<Sequence>();
            if (dt.Rows.Count > 0) list = dt.ToList<Sequence>();                
            
            return list;

        }

    }


    public class Sequence : IdName
    {
        public string sequence { get; set; }
    }

}
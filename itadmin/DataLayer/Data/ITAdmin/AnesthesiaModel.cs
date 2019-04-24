using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;

namespace DataLayer
{

    public class AnesthesiaModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        public bool Save(AnesthesiaSave entry)
        {

            try
            {
                List<AnesthesiaSave> AnesthesiaSave = new List<AnesthesiaSave>();
                AnesthesiaSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlAnesthesiaSave",AnesthesiaSave.ListToXml("AnesthesiaSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.Anesthesia_Save_SCS");
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

        public List<AnesthesiaDashboardModel> AnesthesiaDashboardModel()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Anesthesia_DashBoard_SCS");
            List<AnesthesiaDashboardModel> list = new List<AnesthesiaDashboardModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<AnesthesiaDashboardModel>();
            return list;
        }

        public List<AnesthesiaViewModel> AnesthesiaViewModel(int Id)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Id", Id)
            
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Anesthesia_View_SCS");
            List<AnesthesiaViewModel> list = new List<AnesthesiaViewModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<AnesthesiaViewModel>();
            return list;
        }

       
         }

            public class AnesthesiaSave  
            {
                
                public int Action { get; set; }
                public int OperatorId { get; set; }
                public string Name {get; set;}
                public string Code { get; set; }
                public int BillingType { get; set; }
                public Decimal costprice { get; set; }
                public int Id { get; set; }
            
            
            }


                public class AnesthesiaDashboardModel
                {
                    public int SNo { get; set; }
                    public string Name { get; set; }
                    public int Id { get; set; }
    
                }

                public class AnesthesiaViewModel
                {

                        public int Id { get; set; }
                        public string Code { get; set; }
                        public string Name { get; set; }
                        public decimal costprice { get; set; }
                        public int billingtype { get; set; }
                }


    
    }







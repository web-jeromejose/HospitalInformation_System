using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataLayer;
using System.Data.SqlClient;
using System.Data;
using System.Text.RegularExpressions;


namespace DataLayer.ITAdmin.Model
{
    public class TariffModel
    {
        public string ErrorMessage { get; set; }


        DBHelper db = new DBHelper();

        #region  Tariff
        public bool Save(TariffSave entry)
        {

            try
            {
                List<TariffSave> TariffSave = new List<TariffSave>();
                TariffSave.Add(entry);


                DBHelper db = new DBHelper();
                db.param = new SqlParameter[] {
                    new SqlParameter("@ErrorMessage", SqlDbType.VarChar, 500),
                    new SqlParameter("@xmlTariffSave",TariffSave.ListToXml("TariffSave"))     
                                     
                };

                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP("ITADMIN.Tariff_Save_SCS");
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

        public List<TariffDashboardModel> TariffDashboardModel()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Tariff_DashBoard_SCS");
            List<TariffDashboardModel> list = new List<TariffDashboardModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<TariffDashboardModel>();
            return list;
        }

        public List<TariffViewModel> TariffViewModel(int @Tariffid)
        {

            db.param = new SqlParameter[] {
            new SqlParameter("@Tariffid", Tariffid)
           
           
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Tariff_View_SCS");
            List<TariffViewModel> list = new List<TariffViewModel>();
            if (dt.Rows.Count > 0) list = dt.ToList<TariffViewModel>();
            return list;
        }
        #endregion

        #region OPTariff


        public List<OPTariffDashBoardDAL> OPTariffDashBoard()
        {
            string sql1 = "";
            sql1 = @"   
                                declare @opbserviceid varchar(max) = '7'
                                declare @ipbserviceid varchar(max) = '0'
                                declare @deptid varchar(max) = '0'
                                declare @subdeptid varchar(max) = '0'

                                select A.ID  
                                ,ISNULL(A.TariffId,' ')  as TariffId
                                ,ISNULL(A.BedTypeId,'0')  as BedTypeId
                                ,ISNULL(A.OPServiceId,'0')  as OPServiceId
                                ,ISNULL(A.CategoryId,'0')  as CategoryId
                                ,ISNULL(A.ItemId,'0')  as ItemId
                                ,ISNULL(A.Price,'0')  as Price
                                ,ISNULL(A.Deleted,' ')  as Deleted
                                ,ISNULL(A.StartDateTime,' ')  as StartDateTime
                                ,ISNULL(A.EndDateTime,' ')  as EndDateTime
                                ,ISNULL(A.OperatorID,' ')  as OperatorID
                                ,ISNULL(A.CreatedDate,' ')  as CreatedDate
                                 from [dbo].[Tariff_OPPrice] A 

                                    ";

            sql1 = Regex.Replace(sql1, @"\t|\n|\r", "");

            DataTable dt = db.ExecuteSQLAndReturnDataTable(sql1);
            List<OPTariffDashBoardDAL> list = new List<OPTariffDashBoardDAL>();
            if (dt.Rows.Count > 0) list = dt.ToList<OPTariffDashBoardDAL>();
            return list;
        }


        #endregion

        #region IPTariff


        public List<IPTariffDashBoardDAL> IPTariffDashBoard()
        {
            string sql1 = "";
            sql1 = @"   
                                declare @opbserviceid varchar(max) = '7'
                                declare @ipbserviceid varchar(max) = '0'
                                declare @deptid varchar(max) = '0'
                                declare @subdeptid varchar(max) = '0'

                                select A.ID  
                                ,ISNULL(A.TariffId,' ')  as TariffId
                                ,ISNULL(A.BedTypeId,'0')  as BedTypeId
                                ,ISNULL(A.IPServiceId,'0')  as OPServiceId
                                ,ISNULL(A.CategoryId,'0')  as CategoryId
                                ,ISNULL(A.ItemId,'0')  as ItemId
                                ,ISNULL(A.Price,'0')  as Price
                                ,ISNULL(A.Deleted,' ')  as Deleted
                                ,ISNULL(A.StartDateTime,' ')  as StartDateTime
                                ,ISNULL(A.EndDateTime,' ')  as EndDateTime
                                ,ISNULL(A.OperatorID,' ')  as OperatorID
                                ,ISNULL(A.CreatedDate,' ')  as CreatedDate
                                 from [dbo].[Tariff_IPPrice] A 

                                    ";

            sql1 = Regex.Replace(sql1, @"\t|\n|\r", "");

            DataTable dt = db.ExecuteSQLAndReturnDataTable(sql1);
            List<IPTariffDashBoardDAL> list = new List<IPTariffDashBoardDAL>();
            if (dt.Rows.Count > 0) list = dt.ToList<IPTariffDashBoardDAL>();
            return list;
        }


        #endregion

    }



}


#region  Tariff
public class TariffSave
{

    public int Action { get; set; }
    public int Id { get; set; }
    public string Name { get; set; }

}


public class TariffDashboardModel
{
    public string Name { get; set; }
    public int Id { get; set; }
}

public class TariffViewModel
{
    public string Name { get; set; }
    public int Id { get; set; }
}

#endregion

#region  OPTariff
public class OPTariffDashBoardDAL
{
    public int ID { get; set; }
    public int TariffId { get; set; }
    public int BedTypeId { get; set; }
    public int OPServiceId { get; set; }
    public int CategoryId { get; set; }
    public int ItemId { get; set; }
    public int Price { get; set; }
    public int Deleted { get; set; }
    public string StartDateTime { get; set; }
    public string EndDateTime { get; set; }
    public string OperatorID { get; set; }
    public string CreatedDate { get; set; }
}

#endregion

#region  IPTariff
public class IPTariffDashBoardDAL
{
    public int ID { get; set; }
    public int TariffId { get; set; }
    public int BedTypeId { get; set; }
    public int IPServiceId { get; set; }
    public int CategoryId { get; set; }
    public int ItemId { get; set; }
    public int Price { get; set; }
    public int Deleted { get; set; }
    public string StartDateTime { get; set; }
    public string EndDateTime { get; set; }
    public string OperatorID { get; set; }
    public string CreatedDate { get; set; }
}

#endregion
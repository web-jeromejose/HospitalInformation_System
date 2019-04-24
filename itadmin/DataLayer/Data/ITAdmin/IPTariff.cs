using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using DataLayer.ITAdmin.Model;
using System.Data;
using System.Data.SqlClient;

namespace DataLayer.ITAdmin.Data
{
    public class IPTariffDB
    {
        DBHelper DB = new DBHelper();
        public string ItemCode { get; private set; }
        public string ItemName { get; private set; }
        public int ItemID { get; private set; }
        public int RowsAffected { get; private set; }

        public List<Tariff> GetAllTariff()
        {
            DataTable dt = DB.ExecuteSPAndReturnDataTable("ITADMIN.Tariff_Get_All");
            List<Tariff> tariff = (from DataRow row in dt.Rows
                                   select new Tariff
                                   {
                                       ID = row.Field<int>("ID"),
                                       Name = row.Field<string>("Name")
                                   }).ToList();
            return tariff;
        }

        public List<Services> GetAllServices()
        {
            DB.param = new SqlParameter[]{
                new SqlParameter("@IsIP", true)
            };
            DataTable dt = DB.ExecuteSPAndReturnDataTable("ITADMIN.Tariff_GetAllServices");

            List<Services> services = (from DataRow row in dt.Rows
                                       select new Services
                                       {
                                           ID = row.Field<int>("ID"),
                                           ServiceName = row.Field<string>("ServiceName")
                                       }).ToList();
            return services;
        }

        public List<SearchResult> SearchItem(int serviceID, Boolean blnByCode, string search)
        {
            DB.param = new SqlParameter[]{
                    new SqlParameter("@ServiceID", serviceID),
                    new SqlParameter("@SearchByCode", blnByCode),
                    new SqlParameter("@SearchText", search)
            };
            DataTable dt = DB.ExecuteSPAndReturnDataTable("ITADMIN.Tariff_IP_SearchItem");
            List<SearchResult> result = (from DataRow row in dt.Rows
                                         select new SearchResult
                                         {
                                             ID = row.Field<int>("ID"),
                                             Code = row.Field<string>("Code"),
                                             Name = row.Field<string>("Name")
                                         }).ToList();

            return result;
        }

        public List<TariffItemPrice> GetItemPrice(int tariffID, int serviceID, int? itemID, Boolean blnNextItem)
        {
            DB.param = new SqlParameter[]{
                    new SqlParameter("@TariffID", tariffID),
                    new SqlParameter("@ServiceID", serviceID),
                    new SqlParameter("@ItemID", SqlDbType.Int),
                    new SqlParameter("@ItemCode", SqlDbType.VarChar, 50),
                    new SqlParameter("@ItemName", SqlDbType.VarChar, 100),
                    new SqlParameter("@NextItem", SqlDbType.Bit)
            };

            DB.param[2].Direction = ParameterDirection.InputOutput;
            DB.param[3].Direction = ParameterDirection.Output;
            DB.param[4].Direction = ParameterDirection.Output;
            DB.param[2].Value = itemID ?? (object)DBNull.Value;
            DB.param[5].Value = blnNextItem;

            DataTable dt = DB.ExecuteSPAndReturnDataTable("ITADMIN.Tariff_IP_GetItemCodePrice");
            List<TariffItemPrice> price = (from DataRow row in dt.Rows
                                           select new TariffItemPrice
                                           {
                                               BedTypeID = (int)row["id"],
                                               BedType = row["name"].ToString(),
                                               Price = double.Parse(row["price"].ToString()),
                                               EffectiveFrom = (DateTime?)(row.IsNull("startdatetime") ? null : row.Field<DateTime?>("startdatetime")) 
                                           }).ToList();

            ItemID =  int.Parse(DB.param[2].Value.ToString());
            ItemCode = DB.param[3].Value.ToString();
            ItemName = DB.param[4].Value.ToString();
            return price;
        }

        public Boolean SaveItemPrice(SaveTariffParam param)
        {
            //Session["loggedInId"]
            DataTable dtPriceList = new DataTable();
            dtPriceList.Columns.AddRange(new[] {
                new DataColumn("BedTypeID", typeof(int)),
                new DataColumn("Price", typeof(double)),
                new DataColumn("EffectiveFrom", typeof(string))
            });
            foreach (var item in param.PriceList)
            {
                DataRow newRow = dtPriceList.NewRow();
                newRow["BedTypeID"] = item.BedTypeID;
                newRow["Price"] = item.Price;
                newRow["EffectiveFrom"] = item.EffectiveFrom.HasValue ? item.EffectiveFrom.ToString("dd-MMM-yyyy hh:mm:ss tt") : (object)DBNull.Value;
                dtPriceList.Rows.Add(newRow);
            }

            System.IO.StringWriter sw = new System.IO.StringWriter();
            dtPriceList.TableName = "pricelist";
            dtPriceList.WriteXml(sw);

            DB.param = new SqlParameter[]{
                new SqlParameter("@By", param.By),
                new SqlParameter("@TariffID", param.TariffID),
                new SqlParameter("@ServiceID", param.ServiceID),
                new SqlParameter("@ItemID", param.ItemID),
                new SqlParameter("@PriceList", sw.ToString())
            };

            return DB.ExecuteSP("ITADMIN.Tariff_IP_SaveItemPrice");
        }

        public Boolean SaveItemPrice(SaveTariffRevisedByParam param)
        {
            DB.param = new SqlParameter[]{
                new SqlParameter("@TariffID", param.TariffID),
                new SqlParameter("@ServiceID", param.ServiceID),
                new SqlParameter("@By", param.By),
                new SqlParameter("@StartDate", param.StartDate),
                new SqlParameter("@Percent", param.Percent),
                new SqlParameter("@RowsAffected", SqlDbType.Int)
            };

            DB.param[5].Direction = ParameterDirection.Output;
            Boolean res = DB.ExecuteSP("ITADMIN.Tariff_IP_RevisedByPercent");
            RowsAffected = (int)DB.param[5].Value;
            return res;
        }



        public List<FindIPTariff> ItemFindList(int ServiceID, Boolean SearchByCode, string SearchText)
        {
            DBHelper db = new DBHelper();
            db.param = new SqlParameter[] {
            new SqlParameter("@ServiceID", ServiceID),
            new SqlParameter("@SearchByCode", SearchByCode),
            new SqlParameter("@SearchText", SearchText)
           

            };
            DataTable dt = db.ExecuteSPAndReturnDataTable("ITADMIN.Tariff_IP_SearchItem");
            List<FindIPTariff> list = new List<FindIPTariff>();
            if (dt.Rows.Count > 0) list = dt.ToList<FindIPTariff>();
            return list;
        }
    }


 

}

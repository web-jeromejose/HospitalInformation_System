using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Data;
using System.Text.RegularExpressions;

namespace DataLayer
{
    public class MMSIpStationModel
    {
        DBHelper db;
        public string ErrorMessage { get; set; }

        public MMSIpStationModel()
        {
            db = new DBHelper();
        }

        public bool Save(MMSIpStationSave entry)
        {
            int[] a = new int[] { 1, 2, 3 };

            if (!a.Any(r => r == entry.Action))
            {
                throw new HISValidationException(HISConstant.NOT_ASSIGNED);
            }
            if (string.IsNullOrEmpty(entry.IPAddress))
            {
                throw new HISValidationException(HISConstant.INVALID_IP);
            }
            Regex ip = new Regex(@"\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b");
            if (!ip.IsMatch(entry.IPAddress))
            {
                throw new HISValidationException(HISConstant.INVALID_IP);
            }
            if (entry.StationId == 0)
            {
                throw new HISValidationException(HISConstant.INVALID_STATID);
            }
            if (entry.Action != 3)
            {
                if (string.IsNullOrEmpty(entry.LoginName))
                {
                    throw new HISValidationException(HISConstant.INVALID_LOGIN);
                }
            }
            var message = string.Empty;
            try
            {
                List<MMSIpStationSave> MMSIpStationSave = new List<MMSIpStationSave>();
                MMSIpStationSave.Add(entry);

                db.param = new SqlParameter[] {
                    new SqlParameter(HISConstant.ERROR_MESSAGE, SqlDbType.VarChar, 500),
                    new SqlParameter(HISConstant.XML_MMSIPSTATION_SAVE, MMSIpStationSave.ListToXml(HISConstant.MMSIPSTATION_SAVE))
                };
                message += "xmlMMSIpStationSave :" + MMSIpStationSave.ListToXml(HISConstant.MMSIPSTATION_SAVE).ToString();
                db.param[0].Direction = ParameterDirection.Output;
                db.ExecuteSP(HISConstant.MMSIPSTATION_SAVE_SP);
                message = "step 2";
                this.ErrorMessage = db.param[0].Value.ToString();
                message = db.param[0].Value.ToString();
                bool isOK = this.ErrorMessage.Split('-')[0] == "100";
                return isOK;
            }
            catch
            {
                throw;
            }
        }

        public List<MMSIpStationDT> GetMMSIpStationDataTable()
        {
            DataTable dt = db.ExecuteSPAndReturnDataTable(HISConstant.MMSIPSTATION_DT_SP);
            List<MMSIpStationDT> list = new List<MMSIpStationDT>();
            if (dt.Rows != null && dt.Rows.Count > 0) list = dt.ToList<MMSIpStationDT>();
            return list;
        }

        public MMSIpStationViewModel GetMMSIpStation(string ipAddress, int stationId)
        {
            db.param = new SqlParameter[]
            {
                new SqlParameter("@ipAddress", ipAddress),
                new SqlParameter("@stationId", stationId)
            };
            DataTable dt = db.ExecuteSPAndReturnDataTable(HISConstant.MMSIPSTATION_VIEW_SP);
            MMSIpStationViewModel result = new MMSIpStationViewModel();
            if (dt.Rows.Count > 0) result = dt.ToList<MMSIpStationViewModel>().FirstOrDefault();
            return result;
        }
    }

    #region Model
    public class MMSIpStationSave
    {
        public int Action { get; set; }
        public string IPAddress { get; set; }
        public int StationId { get; set; }
        public int OldStationId { get; set; }
        public string LoginName { get; set; }
        public string Location { get; set; }
    }

    public class MMSIpStationViewModel
    {
        public string IPAddr { get; set; }
        public int StationId { get; set; }
        public string StationName { get; set; }
        public string LoginName { get; set; }
        public string Location { get; set; }
    }

    public class MMSIpStationDT
    {
        public string IPAddr { get; set; }
        public int StationId { get; set; }
        public string StationName { get; set; }
        public string LoginName { get; set; }
        public string Location { get; set; }
    }
    #endregion
}

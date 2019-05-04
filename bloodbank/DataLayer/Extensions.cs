using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Globalization;
using System.Data;
using System.ComponentModel;
using System.Reflection;
using System.Text.RegularExpressions;

 
using System.IO;
using context = System.Web.HttpContext;
using System.Web;

using System.Web.Security;

namespace DataLayer
{
    public static class Extensions
    {
        public static string ToString(this DateTime? date)
        {
            return date.ToString(null, DateTimeFormatInfo.CurrentInfo);
        }
        public static string ToString(this DateTime? date, string format)
        {
            return date.ToString(format, DateTimeFormatInfo.CurrentInfo);
        }
        public static string ToString(this DateTime? date, IFormatProvider provider)
        {
            return date.ToString(null, provider);
        }
        public static string ToString(this DateTime? date, string format, IFormatProvider provider)
        {
            if (date.HasValue)
                return date.Value.ToString(format, provider);
            else
                return string.Empty;
        }
        public static string ReportDisplay(this DateTime? date)
        {
            if (date.HasValue)
                return date.ToString("dd MMM yyyy", DateTimeFormatInfo.CurrentInfo);
            else
                return string.Empty;
        }
        public static string DateTimeSaveFormat(this DateTime? date)
        {
            if (date.HasValue)
                return date.ToString("yyyy-MM-dd hh:mm:ss tt", DateTimeFormatInfo.CurrentInfo);
            else
                return null;            
        }
        public static string HandleNull(this string str)
        {
            if (string.IsNullOrEmpty(str)) return "";
            else return str;
        }
        public static DataTable LINQToDataTable<T>(this DataTable dt, IEnumerable<T> varlist)
        {
            DataTable dtReturn = new DataTable();

            // column names
            PropertyInfo[] oProps = null;
            Type colType;

            if (varlist == null) return dtReturn;

            foreach (T rec in varlist)
            {
                // Use reflection to get property names, to create table, Only first time, others will follow
                if (oProps == null)
                {
                    oProps = ((Type)rec.GetType()).GetProperties();
                    foreach (PropertyInfo pi in oProps)
                    {
                        colType = pi.PropertyType;

                        if ((colType.IsGenericType) && (colType.GetGenericTypeDefinition() == typeof(Nullable<>)))
                        {
                            colType = colType.GetGenericArguments()[0];
                        }

                        dtReturn.Columns.Add(new DataColumn(pi.Name, colType));
                    }
                }
                DataRow dr = dtReturn.NewRow();

                foreach (PropertyInfo pi in oProps)
                {
                    if (pi.GetValue(rec, null) == null)
                    {
                        if (pi.PropertyType.Name == "String") dr[pi.Name] = "";
                        else dr[pi.Name] = DBNull.Value;
                    }
                    else
                    {
                        dr[pi.Name] =pi.GetValue(rec, null);
                    }
                    // dr[pi.Name] = pi.GetValue(rec, null) == null ? DBNull.Value : pi.GetValue(rec, null);
                }

                dtReturn.Rows.Add(dr);
            }
            return dtReturn;
        }
        public static object ChangeType(object value, Type conversionType)
        {
            if (conversionType == null)
            {
                throw new ArgumentNullException("conversionType");
            }

            if (conversionType.IsGenericType &&
              conversionType.GetGenericTypeDefinition().Equals(typeof(Nullable<>)))
            {
                if (value == null)
                {
                    return null;
                }
                NullableConverter nullableConverter = new NullableConverter(conversionType);
                conversionType = nullableConverter.UnderlyingType;
            }

            return Convert.ChangeType(value, conversionType);
        }


        public static T DataTableToModel<T>(this DataTable table) where T : class, new()
        {
            try
            {
                T list = new T();

                foreach (var row in table.AsEnumerable())
                {
                    T obj = new T();

                    foreach (var prop in obj.GetType().GetProperties())
                    {
                        try
                        {
                            PropertyInfo propertyInfo = obj.GetType().GetProperty(prop.Name);
                            //propertyInfo.SetValue(obj, Convert.ChangeType(row[prop.Name], propertyInfo.PropertyType), null);
                            propertyInfo.SetValue(obj, ChangeType(row[prop.Name], propertyInfo.PropertyType), null);
                        }
                        catch
                        {
                            //throw new ApplicationException(ex.Message, ex.InnerException);
                            continue;
                        }
                    }

                    list = obj;
                }

                return list;
            }
            catch
            {
                return null;
            }
        }

        public static List<T> DataTableToList<T>(this DataTable table) where T : class, new()
        {
            try
            {
                List<T> list = new List<T>();

                foreach (var row in table.AsEnumerable())
                {
                    T obj = new T();

                    foreach (var prop in obj.GetType().GetProperties())
                    {
                        try
                        {
                            PropertyInfo propertyInfo = obj.GetType().GetProperty(prop.Name);
                            propertyInfo.SetValue(obj, Convert.ChangeType(row[prop.Name], propertyInfo.PropertyType), null);
                        }
                        catch (Exception ex)
                        {
                            throw new ApplicationException(ex.Message, ex.InnerException);
                            //continue;
                        }
                    }

                    list.Add(obj);
                }

                return list;
            }
            catch
            {
                return null;
            }
        }
        public static string HandleInt(this string i)
        {
            if (i == null) return "0";
            else if (string.IsNullOrEmpty(i.ToString())) return "0";
            else return i;
        }
        public static decimal ObjToDecimal(this object o)
        {
            if (o == null) return 0;
            else if (o.ToString().Trim().Length == 0) return 0;
            else
            {
                decimal ret = 0;
                decimal.TryParse(o.ToString(), out ret);
                return ret;
            }
        }
        public static DateTime? IsDate(this DateTime? obj)
        {
            string strDate = obj.ToString();
            try
            {
                DateTime dt;
                DateTime.TryParse(strDate, out dt);
                if (dt != DateTime.MinValue && dt != DateTime.MaxValue) return dt;
                return null;
            }
            catch
            {
                return null;
            } 
        }
        public static DateTime? ToDate(this string obj)
        {
            DateTime d = DateTime.MinValue;
            DateTime.TryParse(obj, out d);
            if (d == DateTime.MinValue) return null; 
            return d;
        }





        public static string SaveFormat(this DateTime o)
        {
            if (o==null) return null;
            return o.ToString("yyyy-MM-dd hh:mm:ss tt");            
        }
        public static DataTable ListToDataTable<T>(this IList<T> data)
        {
            PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(typeof(T));
            DataTable table = new DataTable();
            foreach (PropertyDescriptor prop in properties)
            {
                if (!prop.PropertyType.Name.Equals("List`1"))
                {
                    table.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
                }
            }
            foreach (T item in data)
            {
                DataRow row = table.NewRow();
                foreach (PropertyDescriptor prop in properties)
                {
                    if (!prop.PropertyType.Name.Equals("List`1"))
                    {
                        row[prop.Name] = prop.GetValue(item) ?? DBNull.Value;
                    }
                }
                table.Rows.Add(row);
            }
            return table;
        }
        public static string ListToXml<T>(this IList<T> data, string pTableName)
        {
            if (data == null) return null;
            DataTable dt = ListToDataTable(data);
            dt.TableName = pTableName;
            System.IO.StringWriter sw = new System.IO.StringWriter();
            dt.WriteXml(sw);            
            return sw.ToString();
        }
        public static void ForEach<T>(this IEnumerable<T> enumeration, Action<T> action)
        {

            foreach (T item in enumeration)
            {
                action(item);
            }
        }
        public static DataTable ToADOTable<T>(this IEnumerable<T> varlist, CreateRowDelegate<T> fn)
        {
            DataTable toReturn = new DataTable();

            // Could add a check to verify that there is an element 0 
            T TopRec = varlist.ElementAtOrDefault(0);

            if (TopRec == null)
                return toReturn;

            // Use reflection to get property names, to create table 
            // column names 

            PropertyInfo[] oProps = ((Type)TopRec.GetType()).GetProperties();

            foreach (PropertyInfo pi in oProps)
            {
                Type pt = pi.PropertyType;
                if (pt.IsGenericType && pt.GetGenericTypeDefinition() == typeof(Nullable<>))
                    pt = Nullable.GetUnderlyingType(pt);
                toReturn.Columns.Add(pi.Name, pt);
            }

            foreach (T rec in varlist)
            {
                DataRow dr = toReturn.NewRow();
                foreach (PropertyInfo pi in oProps)
                {
                    object o = pi.GetValue(rec, null);
                    if (o == null)
                        dr[pi.Name] = DBNull.Value;
                    else
                        dr[pi.Name] = o;
                }
                toReturn.Rows.Add(dr);
            }

            return toReturn;
        }
        public static DataTable ToADOTable<T>(this IEnumerable<T> varlist)
        {
            DataTable toReturn = new DataTable();

            // Could add a check to verify that there is an element 0 
            T TopRec = varlist.ElementAtOrDefault(0);

            if (TopRec == null)
                return toReturn;

            // Use reflection to get property names, to create table 
            // column names 

            PropertyInfo[] oProps = ((Type)TopRec.GetType()).GetProperties();

            foreach (PropertyInfo pi in oProps)
            {
                Type pt = pi.PropertyType;
                if (pt.IsGenericType && pt.GetGenericTypeDefinition() == typeof(Nullable<>))
                    pt = Nullable.GetUnderlyingType(pt);
                toReturn.Columns.Add(pi.Name, pt);
            }

            foreach (T rec in varlist)
            {
                DataRow dr = toReturn.NewRow();
                foreach (PropertyInfo pi in oProps)
                {
                    object o = pi.GetValue(rec, null);

                    if (o == null)
                        dr[pi.Name] = DBNull.Value;
                    else
                        dr[pi.Name] = o;
                }
                toReturn.Rows.Add(dr);
            }

            return toReturn;
        }
        public static List<T> ToList<T>(this DataTable datatable) where T : new()
        {
            List<T> Temp = new List<T>();
            try
            {
                List<string> columnsNames = new List<string>();
                foreach (DataColumn DataColumn in datatable.Columns)
                    columnsNames.Add(DataColumn.ColumnName);
                Temp = datatable.AsEnumerable().ToList().ConvertAll<T>(row => getObject<T>(row, columnsNames));
                return Temp;
            }
            catch (Exception ex)
            {
                string x = ex.Message;
                throw new Exception(x);                
            }
        }
        public static T getObject<T>(DataRow row, List<string> columnsName) where T : new()
        {
            string columnname = "";
            string value = "";

            T obj = new T();
            try
            {
                PropertyInfo[] Properties; Properties = typeof(T).GetProperties();
                foreach (PropertyInfo objProperty in Properties)
                {
                    columnname = columnsName.Find(name => name.ToLower() == objProperty.Name.ToLower());
                    if (!string.IsNullOrEmpty(columnname))
                    {
                        value = row[columnname].ToString();
                        if (!string.IsNullOrEmpty(value))
                        {
                            if (Nullable.GetUnderlyingType(objProperty.PropertyType) != null)
                            {
                                value = row[columnname].ToString().Replace("$", "").Replace(",", "");
                                objProperty.SetValue(obj, Convert.ChangeType(value, Type.GetType(Nullable.GetUnderlyingType(objProperty.PropertyType).ToString())), null);
                            }
                            else
                            {
                                value = row[columnname].ToString().Replace("%", "");
                                objProperty.SetValue(obj, Convert.ChangeType(value, Type.GetType(objProperty.PropertyType.ToString())), null);
                            }
                        }
                    }
                } return obj;
            }
            catch(Exception ex)
            {
                string col = columnname;
                string val = value;
                string x = ex.Message;
                throw new Exception(x);
            }
        }
        public delegate object[] CreateRowDelegate<T>(T t);

        //From http://stackoverflow.com/questions/5663655/like-operator-in-linq-to-objects
        //For sql "Like" comparison in linq to objects
        public static bool Like(this string s, string pattern)
        {
            //Find the pattern anywhere in the string
            pattern = ".*" + pattern + ".*";

            return Regex.IsMatch(s, pattern, RegexOptions.IgnoreCase);
        }




    }

    public class ExceptionLogging
    {
        private static String ErrorlineNo, Errormsg, extype, exurl, ErrorLocation;
        /*
         ** HOW TO USE JFJ Aug2017
         *
         * using DataLayer.Common;
         * ExceptionLogging eLOG = new ExceptionLogging();
           try
            {
            }
            catch (Exception ex)
            {
                eLOG.LogError(ex);
             }
         
         */
        public void LogError(Exception ex)
        {

            string opeid = context.Current.Request.Cookies["ELOG_PAR1"].Value;
            string ipaddr = context.Current.Request.Cookies["ELOG_PAR2"].Value;
            string station = context.Current.Request.Cookies["ELOG_PAR3"].Value;

            string oldtextfile = "";
            string newtextfile = "";

            var line = Environment.NewLine + Environment.NewLine;

            ErrorlineNo = ex.StackTrace.Substring(ex.StackTrace.Length - 7, 7);
            Errormsg = ex.GetType().Name.ToString();
            extype = ex.GetType().ToString();
            exurl = context.Current.Request.Url.ToString();
            ErrorLocation = ex.Message.ToString();

            try
            {
                string filepath = context.Current.Server.MapPath("~/Logs/");  //html File Path
                if (!Directory.Exists(filepath))
                {
                    Directory.CreateDirectory(filepath);
                }
                filepath = filepath + "Log_" + DateTime.Today.ToString("dd-MMM-yyyy") + ".html";   //html File Name
                if (!File.Exists(filepath))
                {
                    File.Create(filepath).Dispose();
                }

                oldtextfile = File.ReadAllText(filepath);

                newtextfile = "<div style='width:100%; background-color:#eee; color:#444; border:1px solid #333; padding:5px;box-sizing:border-box; font-family:consolas; font-size:12px; margin-bottom:5px;'>" +
                    "<p style='width:100%;padding:3px;box-sizing:border-box;text-align:left; background-color:#f1f1f1;'>" +
                        "<b>Log Date : </b>" + DateTime.Now.ToString("dddd, dd-MMM-yyyy hh:mm:ss tt") + "<br>" +
                        "<b>Station : </b>" + station + "<br>" +
                        "<b>Operator ID : </b>" + opeid + "<br>" +
                        "<b>Client I.P : </b>" + ipaddr +
                    "</p>" +
                    "<p style='width:100%;padding:3px;box-sizing:border-box;text-align:left;'>" +
                        "<b>URL : </b>" + exurl +
                    "</p>" +

                    "<p style='width:100%;padding:3px;box-sizing:border-box;text-align:left;'>" +
                        "<b>Error Message : </b>" + Errormsg +
                    "</p>" +

                    "<p style='width:100%;padding:3px;box-sizing:border-box;text-align:left;'>" +
                        "<b>Exception Type : </b>" + extype +
                    "</p>" +

                    "<p style='width:100%;padding:3px;box-sizing:border-box;text-align:left;'>" +
                        "<b>Error Location : </b>" + ErrorLocation +
                    "</p>" +

                    "</div>";

                File.WriteAllText(filepath, newtextfile + oldtextfile);

                //using (StreamWriter sw = File.AppendText(filepath))
                //{
                //    sw.WriteLine("<div style='width:100%; background-color:#eee; color:#444; border:1px solid #333; padding:5px;box-sizing:border-box; font-family:consolas; font-size:12px; margin-bottom:5px;'>");

                //    //basic information
                //    sw.WriteLine("<p style='width:100%;padding:3px;box-sizing:border-box;text-align:left; background-color:#f1f1f1;'>");
                //    sw.WriteLine("<b>Log Date : </b>" + DateTime.Now.ToString("dddd, dd-MMM-yy hh:mm:ss tt") + "<br>");
                //        sw.WriteLine("<b>Station : </b>" + station + "<br>");
                //        sw.WriteLine("<b>Operator ID : </b>" + opeid + "<br>");
                //        sw.WriteLine("<b>Client I.P : </b>" + ipaddr);
                //    sw.WriteLine("</p>");

                //    sw.WriteLine("<p style='width:100%;padding:3px;box-sizing:border-box;text-align:left;'>");
                //        sw.WriteLine("<b>URL : </b>" + exurl);
                //    sw.WriteLine("</p>");

                //    sw.WriteLine("<p style='width:100%;padding:3px;box-sizing:border-box;text-align:left;'>");
                //        sw.WriteLine("<b>Error Message : </b>" + Errormsg);
                //    sw.WriteLine("</p>");

                //    sw.WriteLine("<p style='width:100%;padding:3px;box-sizing:border-box;text-align:left;'>");
                //     sw.WriteLine("<b>Exception Type : </b>" + extype);
                //    sw.WriteLine("</p>");

                //    sw.WriteLine("<p style='width:100%;padding:3px;box-sizing:border-box;text-align:left;'>");
                //        sw.WriteLine("<b>Error Location : </b>" + ErrorLocation);
                //    sw.WriteLine("</p>");

                //    sw.WriteLine("</div>");

                //    sw.Flush();
                //    sw.Close();

                //}

            }
            catch (Exception e)
            {
                e.ToString();

            }
        }

        public void LogDetail(string details)
        {

            string opeid = context.Current.Request.Cookies["ELOG_PAR1"].Value;
            string ipaddr = context.Current.Request.Cookies["ELOG_PAR2"].Value;
            string station = context.Current.Request.Cookies["ELOG_PAR3"].Value;

            string oldtextfile = "";
            string newtextfile = "";

            var line = Environment.NewLine + Environment.NewLine;


            try
            {
                string filepath = context.Current.Server.MapPath("~/Logs/");  //html File Path
                if (!Directory.Exists(filepath))
                {
                    Directory.CreateDirectory(filepath);
                }
                filepath = filepath + "sql-errors.html";   //html File Name
                if (!File.Exists(filepath))
                {
                    File.Create(filepath).Dispose();
                }

                oldtextfile = File.ReadAllText(filepath);

                newtextfile = "<div style='width:100%; background-color:#eee; color:#444; border:1px solid #333; padding:5px;box-sizing:border-box; font-family:consolas; font-size:12px; margin-bottom:5px;'>" +
                    "<p style='width:100%;padding:3px;box-sizing:border-box;text-align:left; background-color:#f1f1f1;'>" +
                        "<b>Log Date : </b>" + DateTime.Now.ToString("dddd, dd-MMM-yyyy hh:mm:ss tt") + "<br>" +
                        "<b>Station : </b>" + station + "<br>" +
                        "<b>Operator ID : </b>" + opeid + "<br>" +
                        "<b>Client I.P : </b>" + ipaddr +
                    "</p>" +

                    "<p style='width:100%;padding:3px;box-sizing:border-box;text-align:left;'>" +
                        "<b>Details : </b>" + details +
                    "</p>" +



                    "</div>";

                File.WriteAllText(filepath, newtextfile + oldtextfile);



            }
            catch (Exception e)
            {
                e.ToString();

            }
        }
    }
}

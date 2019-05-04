using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace HisBloodbankEf.Core.Extension
{
    public static class Extension
    {
        public static string DescriptionAttr<T>(this T source)
        {
            FieldInfo fi = source.GetType().GetField(source.ToString());

            DescriptionAttribute[] attributes = (DescriptionAttribute[])fi.GetCustomAttributes(
                typeof(DescriptionAttribute), false);

            if (attributes != null && attributes.Length > 0) return attributes[0].Description;
            else return source.ToString();
        }

        public static string CleanDash<T>(this T source)
        {
            return source.ToString().Replace("--", "");
        }
    }

    public class StringHelper
    {
        public static string FixFilename(string filename, string type)
        {
            int fileExtPos = filename.LastIndexOf(".");
            if (fileExtPos >= 0)
            {
                var newFileName = filename.Substring(0, fileExtPos);
                var ext = filename.Substring(fileExtPos);
                newFileName += "_" + type + ext;
                return newFileName;
            }

            return filename;
        }

        public static string GetExtension(string filename)
        {
            int fileExtPos = filename.LastIndexOf(".");
            var ext = filename.Substring(fileExtPos);
            return ext;
        }
    }
}

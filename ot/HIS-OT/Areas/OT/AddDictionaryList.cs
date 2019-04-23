using HIS_OT.Areas.OT.Models;
using HIS_OT.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;

namespace HIS_OT.Areas.OT
{
    public static class AddDictionaryList
    {
        public static Dictionary<string, string> GetViewModel<T>(this T list) where T: class
        {
            var result = new Dictionary<string, string>();
            foreach (PropertyInfo p in typeof(T).GetProperties())
            {
                result.Add(p.Name, p.GetValue(list) == null ? "" : p.GetValue(list).ToString());
            }
            return result;
        }
    }
}
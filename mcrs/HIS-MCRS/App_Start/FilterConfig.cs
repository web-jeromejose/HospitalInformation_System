﻿using System.Web;
using System.Web.Mvc;

namespace HIS_MCRS
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
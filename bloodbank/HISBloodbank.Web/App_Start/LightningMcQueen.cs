using HisBloodbankEf.Core.Interface;
using HisBloodbankEf.Business;
using HisBloodbankEf.Infra;
using LightInject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HIS_BloodBank
{
    ///<summary>
    ///LightInjectConfig - Responsible for registration of your components and services.
    ///2/10/2015
    ///By:Fadz
    ///</summary>
    public class LightningMcQueen
    {
        private static ServiceContainer container;
        //I just love Flash to initialize the LightInject
        public static void Flash()
        {
            container = new ServiceContainer();

            container.Register<HisBloodbankDbContext>();
            container.Register<IDataManager, DataManager>();
            //HIS-HisBloodbank.Ef
            container.Register<IDonorBusiness, DonorBusiness>();
            container.Register<IReportBusiness, ReportBusiness>();

            container.RegisterControllers(typeof(MvcApplication).Assembly);
            container.EnableMvc();
        }

        //public static ServiceContainer Cointainer { get { return container; } }
    }
}
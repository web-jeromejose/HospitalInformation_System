using OTEf.Core.Interface;
using OTEf.Impl;
using OTEf.Infra;
using LightInject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HIS_OT.Infra
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

            container.Register<OTEfDbContext>();
            container.Register<IDataManager, DataManager>();
            //OTEf
            container.Register<IPatientBusiness, PatientBusiness>();
            container.Register<IMasterFileBusiness, MasterFileBusiness>();
            container.Register<IOperationBusiness, OperationBusiness>();
   
            container.RegisterControllers(typeof(MvcApplication).Assembly);
            container.EnableMvc();
        }

        //public static ServiceContainer Cointainer { get { return container; } }
    }
}
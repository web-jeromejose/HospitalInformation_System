
using HIS_ITADMIN_EF.Core.Interface;
using HIS_ITADMIN_EF.Core.Model;
using HIS_ITADMIN_EF.Core.Model.Sp;
using HIS_ITADMIN_EF.Infra;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HIS_ITADMIN_EF.Business
{
    public class DataManager : IDataManager
    {
        private HIS_ITADMIN_EFDbContext context;

        public IRepository<Donor> Donor { get; private set; }
        public IRepository<DonorVitalSign> DonorVitalSign { get; private set; }
        public IRepository<DonorQuestionaire> DonorQuestionaire { get; private set; }

        public IDbHelper<Patient> Patient { get; private set; }
        public IDbHelper<Sex> Sex { get; private set; }
     
        //DbContext is not a thread safe, 
        //So whenever we need datamanager, we will create a new instance of DbContext
        public DataManager()
        {
            context = new HIS_ITADMIN_EFDbContext();
            Donor = new HIS_ITADMIN_EFRepository<Donor>(context);
            DonorQuestionaire = new HIS_ITADMIN_EFRepository<DonorQuestionaire>(context);

            Patient = new DbHelper<Patient>(context);
            Sex = new DbHelper<Sex>(context);
 

            
        }
    }
}

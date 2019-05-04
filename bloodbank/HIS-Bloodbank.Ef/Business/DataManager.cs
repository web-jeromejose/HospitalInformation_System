
using HisBloodbankEf.Core.Interface;
using HisBloodbankEf.Core.Model;
using HisBloodbankEf.Infra;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HisBloodbankEf.Business
{
    public class DataManager : IDataManager
    {
        private HisBloodbankDbContext context;

        public IRepository<BloodDonor> Donor { get; private set; }


        //DbContext is not a thread safe, 
        //So whenever we need datamanager, we will create a new instance of DbContext
        public DataManager()
        {
            context = new HisBloodbankDbContext();
            Donor = new HisBloodbankEfRepository<BloodDonor>(context);
        }
    }
}

using HisBloodbankEf.Core.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HisBloodbankEf.Core.Interface
{
    public interface IDataManager
    {
        IRepository<BloodDonor> Donor { get; }
    }
}


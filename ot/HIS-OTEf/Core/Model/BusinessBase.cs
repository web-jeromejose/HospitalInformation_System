using OTEf.Core.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OTEf.Core.Model
{
    public abstract class BusinessBase
    {
        public IDataManager dataManager;

        public BusinessBase(IDataManager mgr)
        {
            dataManager = mgr;
        }
    }
}

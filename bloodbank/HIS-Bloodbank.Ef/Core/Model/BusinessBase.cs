using HisBloodbankEf.Core.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HisBloodbankEf.Core.Model
{
    public abstract class BusinessBase
    {
        public IDataManager Data;

        public BusinessBase(IDataManager mgr)
        {
            Data = mgr;
        }
    }
}

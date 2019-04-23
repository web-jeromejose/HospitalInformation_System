using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OTEf.Core.Model
{
    public class PreOperativeCheckPerformed:BaseModel
    {
        public int Id { get; set; }
        public virtual int PreOperativeCheckId { get; set; }

        //yes/no ,n/a
        public bool? isPerformed { get; set; }

        public virtual PreOperativeCheck CheckItem { get; set; }


    }
}

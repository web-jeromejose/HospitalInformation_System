using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OTEf.Core.Model
{
    public class BaseModel
    {
        public BaseModel()
        {
            CreatedAt = DateTime.Now;
            Active = true;
        }

        public string CreatedByName { set; get; }
        public string ModifiedByName { set; get; }

        public int ModifiedById { get; set; }
        public int CreatedById { get; set; }

        public DateTime CreatedAt { set; get; }
        public DateTime? ModifiedAt { set; get; }
        public bool Active { set; get; }
    }
}

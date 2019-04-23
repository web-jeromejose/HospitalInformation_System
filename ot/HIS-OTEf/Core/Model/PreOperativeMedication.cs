using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OTEf.Core.Model
{
    public class PreOperativeMedication : BaseModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool HasOperationalValue { get; set; }
    }
}
